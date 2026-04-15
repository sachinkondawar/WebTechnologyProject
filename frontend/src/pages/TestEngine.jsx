import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// --- ALL MODULE COMPONENTS ---
import VisualNaming from '../components/VisualNaming';
import AudioDictation from '../components/AudioDictation';
import DrawingCanvas from '../components/DrawingCanvas';
import StroopTask from '../components/StroopTask';
import DigitSpan from '../components/DigitSpan';
import PatternMemory from '../components/PatternMemory';
import AIEvaluator from '../components/AIEvaluator';

import { Activity, ChevronRight, X } from 'lucide-react';

const TestEngine = () => {
  const { testId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [testDatabase, setTestDatabase] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${baseUrl}/api/tests`)
      .then(res => res.json())
      .then(data => {
        setTestDatabase(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch tests:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  if (loading) return <div className="p-12 text-2xl font-medium text-slate-800">Loading module...</div>;

  const activeTest = testDatabase.find(t => t.id === testId);

  if (!activeTest) return <div className="p-12 text-2xl font-medium text-slate-800">Module not found.</div>;

  const question = activeTest.questions[currentIndex];
  const isLastQuestion = currentIndex === activeTest.questions.length - 1;

  const handleAnswer = (answerData) => {
    setAnswers({ ...answers, [question.id]: answerData });
  };

  const calculateScore = () => {
    let total = 0;
    let max = 0;

    activeTest.questions.forEach(q => {
      if (q.needsManualGrading) return;
      max += q.points;
      
      const rawUserAnswer = answers[q.id];
      let isCorrect = false;

      // 1. Handle the AI pre-graded object (Gemini) - UPDATED TO AI_INTERVIEW
      if (q.type === 'AI_INTERVIEW' && rawUserAnswer?.type === 'AI_GRADED') {
        total += rawUserAnswer.score;
        return; 
      }
      
      // 2. Handle Pattern Memory (Arrays converted to strings)
      else if (q.type === 'PATTERN_MEMORY') {
        const correctStr = q.targetPattern.sort().join(',');
        if ((rawUserAnswer || "").toString() === correctStr) isCorrect = true;
      } 
      
      // 3. Handle Standard Text Inputs
      else {
        const cleanUserAnswer = (rawUserAnswer || "").toString().toLowerCase().replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim();
        const cleanCorrectAnswer = q.correctAnswer.toLowerCase().replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim();
        
        if (cleanUserAnswer === "") return;
        
        if (q.type === 'VISUAL_NAMING' && cleanUserAnswer.includes(cleanCorrectAnswer)) {
          isCorrect = true;
        } else if (cleanUserAnswer === cleanCorrectAnswer) {
          isCorrect = true;
        }
      }

      if (isCorrect) total += q.points;
      else total += (q.penalty || 0); 
    });

    setFinalScore(Math.max(0, total));
    setMaxScore(max);
    return { calculatedScore: Math.max(0, total), calculatedMax: max };
  };

  const handleNext = async () => {
    window.speechSynthesis.cancel(); 
    if (isLastQuestion) {
      const { calculatedScore, calculatedMax } = calculateScore();
      setIsFinished(true);

      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await fetch(`${baseUrl}/api/tests/results`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            testId,
            finalScore: calculatedScore,
            maxScore: calculatedMax,
            answers
          })
        });
      } catch (err) {
        console.error('Failed to save score:', err);
      }
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // --- DYNAMIC COMPONENT RENDERER ---
  const renderQuestionComponent = () => {
    switch (question.type) {
      case 'VISUAL_NAMING': 
      case 'MATH_LOGIC': 
        return <VisualNaming question={question} onAnswer={handleAnswer} />;
      case 'AUDIO_DICTATION': 
        return <AudioDictation question={question} onAnswer={handleAnswer} />;
      case 'DRAWING': 
        return <DrawingCanvas question={question} onAnswer={handleAnswer} />;
      case 'STROOP_TEST': 
        return <StroopTask question={question} onAnswer={handleAnswer} />;
      case 'DIGIT_SPAN': 
        return <DigitSpan question={question} onAnswer={handleAnswer} />;
      case 'PATTERN_MEMORY': 
        return <PatternMemory question={question} onAnswer={handleAnswer} />;
      case 'AI_INTERVIEW': // <--- FIXED THIS EXACT MISMATCH
        return <AIEvaluator question={question} onAnswer={handleAnswer} />;
      default: 
        return <p className="text-gray-400">Unknown module type</p>;
    }
  };

  // --- RESULTS SCREEN ---
  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 animate-fade-in bg-jb-dark font-sans text-slate-800">
        <div className="bg-jb-card backdrop-blur-xl border border-jb-border p-12 w-full max-w-2xl rounded-3xl text-center shadow-2xl relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-500/10 text-teal-600 mb-6">
            <Activity size={40} />
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight text-slate-900">Evaluation Complete</h1>
          <p className="text-slate-500 mb-10">Data processed and auto-graded successfully.</p>
          
          <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-8 mb-10">
            <div className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-2">Final Auto-Score</div>
            <div className="text-7xl font-black bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent mb-4">
              {finalScore} <span className="text-3xl text-slate-400">/ {maxScore}</span>
            </div>
            <p className="font-bold text-slate-500">
              *Note: Drawing exercises require manual review and are not included in this score.
            </p>
          </div>

          <Link to="/" className="inline-flex items-center gap-2 bg-jb-accent hover:bg-jb-accent-hover text-white px-8 py-4 rounded-xl font-medium transition-colors shadow-[0_8px_20px_rgba(13,148,136,0.2)]">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // --- TEST SCREEN ---
  return (
    <div className="min-h-screen bg-jb-dark text-slate-800 p-4 md:p-8 flex flex-col items-center justify-center font-sans relative z-10">
      <div className="w-full max-w-4xl bg-jb-card backdrop-blur-xl border border-jb-border rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] overflow-hidden animate-fade-in flex flex-col min-h-[70vh]">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-jb-border bg-white/50">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-400 hover:text-slate-700 transition-colors p-2 hover:bg-slate-100 rounded-lg">
              <X size={24} />
            </Link>
            <div className="h-6 w-px bg-slate-200"></div>
            <span className="text-slate-600 font-medium tracking-wide">{activeTest.title}</span>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-sm font-medium text-jb-accent">
            Step {currentIndex + 1} of {activeTest.questions.length}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-medium text-slate-800 mb-12 text-center tracking-tight leading-tight">
            {question.instruction}
          </h2>
          <div className="w-full max-w-2xl mx-auto flex justify-center">
            {renderQuestionComponent()}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="px-8 py-6 border-t border-jb-border bg-white/50 flex justify-end">
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 bg-slate-800 text-white hover:bg-slate-700 px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            {isLastQuestion ? 'Submit Data' : 'Continue'} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestEngine;