import React, { useState } from 'react';
import { PlayCircle, Square } from 'lucide-react';

const AudioDictation = ({ question, onAnswer }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(question.spokenText);
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center animate-fade-in w-full">
      
      {/* Sleek Glowing Play Button */}
      <button 
        onClick={toggleAudio}
        className={`${
          isPlaying 
            ? 'bg-jb-accent text-white shadow-[0_5px_15px_rgba(13,148,136,0.4)] border-transparent' 
            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 hover:text-slate-700'
        } border p-8 rounded-full mb-10 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center`}
      >
        {isPlaying ? <Square size={64} /> : <PlayCircle size={64} />}
      </button>

      {/* New Premium Textarea Field */}
      <textarea 
        placeholder="Type exactly what you heard..."
        onChange={(e) => onAnswer(e.target.value)}
        className="bg-white border border-slate-200 rounded-xl px-6 py-4 text-slate-800 text-xl leading-relaxed h-40 focus:outline-none focus:border-jb-accent focus:ring-1 focus:ring-jb-accent shadow-sm transition-all w-full max-w-2xl placeholder:text-slate-400 resize-none"
      />
    </div>
  );
};

export default AudioDictation;