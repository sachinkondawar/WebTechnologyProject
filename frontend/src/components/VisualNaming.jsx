import React from 'react';

const VisualNaming = ({ question, onAnswer }) => {
  return (
    <div className="flex flex-col items-center animate-fade-in w-full">
      {/* Sleek Image Container */}
      {question.assetUrl && (
        <div className="bg-white/80 border border-slate-200 p-4 rounded-2xl mb-10 backdrop-blur-sm shadow-xl">
          <img 
            src={question.assetUrl} 
            alt="Assessment item" 
            className="w-full max-w-md h-64 object-cover rounded-xl shadow-sm" 
          />
        </div>
      )}

      {/* New Premium Input Field */}
      <input 
        type="text" 
        placeholder="Type your answer here..."
        onChange={(e) => onAnswer(e.target.value)}
        className="bg-white border border-slate-200 rounded-xl px-6 py-4 text-slate-800 text-2xl uppercase tracking-wider focus:outline-none focus:border-jb-accent focus:ring-1 focus:ring-jb-accent shadow-sm transition-all w-full max-w-xl placeholder:text-slate-400 placeholder:normal-case placeholder:tracking-normal"
      />
    </div>
  );
};

export default VisualNaming;