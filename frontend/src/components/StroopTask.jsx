import React from 'react';
import { AlertTriangle } from 'lucide-react';

const StroopTask = ({ question, onAnswer }) => {
  return (
    <div className="flex flex-col items-center animate-fade-in w-full">
      <div className="flex items-center gap-2 mb-6 text-yellow-500/80 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/20">
        <AlertTriangle size={18} />
        <span className="text-sm font-medium tracking-wide">Cognitive Interference Warning</span>
      </div>

      <div className="bg-white/80 border border-slate-200 p-12 rounded-2xl mb-10 backdrop-blur-sm shadow-xl w-full max-w-xl flex justify-center items-center h-48">
        <h1 
          className="text-7xl font-black tracking-widest uppercase drop-shadow-sm"
          style={{ color: question.hexColor }}
        >
          {question.wordText}
        </h1>
      </div>

      <input 
        type="text" 
        placeholder="Type the INK COLOR..."
        onChange={(e) => onAnswer(e.target.value)}
        className="bg-white border border-slate-200 rounded-xl px-6 py-4 text-slate-800 text-2xl uppercase tracking-wider focus:outline-none focus:border-jb-accent focus:ring-1 focus:ring-jb-accent shadow-sm transition-all w-full max-w-xl placeholder:text-slate-400 placeholder:normal-case placeholder:tracking-normal"
      />
    </div>
  );
};

export default StroopTask;