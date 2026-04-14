import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Bot, User, Send, Loader2, CheckCircle2 } from 'lucide-react';

const AIEvaluator = ({ question, onAnswer }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Start the interview on mount
  useEffect(() => {
    processTurn(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processTurn = async (userText) => {
    setIsTyping(true);
    let currentHistory = [...messages];

    if (userText) {
      currentHistory.push({ role: 'user', text: userText });
      setMessages(currentHistory);
      setInput('');
    }

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      // Downgraded to 1.5-flash which has higher capacity and rarely hits 503s.
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      // Build the transcript for the AI to read
      let transcript = currentHistory.map(m => `${m.role === 'user' ? 'Patient' : 'Examiner'}: ${m.text}`).join('\n');
      if (!userText && currentHistory.length === 0) {
        transcript = "(The test is just starting. You must generate the first question.)";
      }

      // The dynamic system prompt
      const prompt = `
      You are an AI clinical neuropsychologist conducting a dynamic semantic reasoning test.
      Your goal is to test the patient's abstract reasoning and cognitive flexibility.
      The maximum score for this test is ${question.points}.

      Current Transcript:
      ${transcript}

      INSTRUCTIONS:
      1. If the transcript is just starting, ask a unique, highly abstract question (e.g., "How is a secret like a virus?" or "Explain the conceptual link between a shadow and a memory").
      2. If the patient has answered, evaluate it. If their answer is too short, shallow, or needs clarification, ask ONE follow-up question to push their logic further.
      3. Once you have enough information to confidently grade their abstract thought, conclude the test.
      4. YOU MUST RESPOND IN STRICT JSON FORMAT ONLY. No markdown formatting, no backticks, no conversational text outside the JSON.

      JSON SCHEMA:
      {
        "status": "continue" or "complete",
        "message": "Your conversational response or next question (leave empty if complete)",
        "score": <number 0 to ${question.points}, provide only if status is complete>,
        "feedback": "Clinical feedback explaining their score (provide only if status is complete)"
      }
      `;

      let result;
      let retries = 2;
      while (retries >= 0) {
        try {
          result = await model.generateContent(prompt);
          break;
        } catch (error) {
          if (retries === 0 || (!error.message.includes('503') && !error.message.includes('429'))) throw error;
          await new Promise(r => setTimeout(r, 2000));
          retries--;
        }
      }
      
      let text = result.response.text();
      
      // Strip out markdown formatting if Gemini accidentally includes it
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(text);

      if (parsedData.status === 'continue') {
        setMessages(prev => [...prev, { role: 'ai', text: parsedData.message }]);
      } else if (parsedData.status === 'complete') {
        setIsDone(true);
        onAnswer({
          type: 'AI_GRADED',
          score: parsedData.score,
          feedback: parsedData.feedback,
          userText: "Interview Completed." // Passed to the engine
        });
      }

    } catch (error) {
      console.error("AI Evaluation failed:", error);
      setMessages(prev => [
        ...prev, 
        { role: 'ai', text: `System error: ${error.message}. Key defined: ${!!import.meta.env.VITE_GEMINI_API_KEY}` }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (input.trim() && !isTyping && !isDone) {
      processTurn(input);
    }
  };

  return (
    <div className="flex flex-col items-center animate-fade-in w-full max-w-3xl mx-auto">
      
      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-6 text-teal-600 bg-teal-500/10 px-4 py-2 rounded-lg border border-teal-500/20 shadow-sm">
        <Bot size={18} />
        <span className="text-sm font-medium tracking-wide">Live Neuro-Interview Active</span>
      </div>

      {/* Chat Window */}
      <div className="bg-white/80 border border-slate-200 rounded-2xl w-full h-[400px] flex flex-col mb-6 overflow-hidden shadow-sm">
        
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0 border border-teal-200">
                  <Bot size={16} />
                </div>
              )}
              
              <div className={`px-5 py-3 rounded-2xl max-w-[80%] text-lg shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-jb-accent text-white rounded-tr-sm' 
                  : 'bg-slate-100 text-slate-700 border border-slate-200 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-jb-accent/10 flex items-center justify-center text-jb-accent flex-shrink-0 border border-jb-accent/30">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4 justify-start animate-pulse">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0 border border-teal-200">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-500 border border-slate-200 rounded-tl-sm shadow-sm">
                Analyzing syntax...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isTyping || isDone}
              placeholder={isDone ? "Interview Complete" : "Type your response..."}
              className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-4 text-slate-800 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 disabled:opacity-50 shadow-sm"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping || isDone}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 text-white rounded-lg transition-colors shadow-sm"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {isDone && (
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-200 animate-fade-in shadow-sm">
          <CheckCircle2 size={24} />
          <span className="font-semibold tracking-wide">Data Locked. AI Evaluation Received. Proceed to next step.</span>
        </div>
      )}
    </div>
  );
};

export default AIEvaluator;