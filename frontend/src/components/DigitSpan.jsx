import React, { useState } from 'react';
import { Ear, Square } from 'lucide-react';

const DigitSpan = ({ question, onAnswer }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(question.spokenText);
      // Extremely slow rate so the user can hear the sequence clearly
      utterance.rate = 0.5; 
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center animate-fade-in w-full">
      <button 
        onClick={toggleAudio}
        className={`${
          isPlaying 
            ? 'bg-jb-accent text-white shadow-[0_5px_15px_rgba(13,148,136,0.4)] border-transparent' 
            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 hover:text-slate-700'
        } border p-10 rounded-full mb-10 transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-2`}
      >
        {isPlaying ? <Square size={48} /> : <Ear size={48} />}
        <span className="text-xs font-bold uppercase tracking-widest">{isPlaying ? "Playing..." : "Listen"}</span>
      </button>

      <input 
        type="number" 
        placeholder="Type sequence backwards (e.g. 987)..."
        onChange={(e) => onAnswer(e.target.value)}
        className="bg-white border border-slate-200 rounded-xl px-6 py-4 text-slate-800 text-2xl tracking-widest focus:outline-none focus:border-jb-accent focus:ring-1 focus:ring-jb-accent shadow-sm transition-all w-full max-w-xl text-center placeholder:text-slate-400 placeholder:text-base placeholder:tracking-normal"
      />
    </div>
  );
};

export default DigitSpan;