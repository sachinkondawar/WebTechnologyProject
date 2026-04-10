import React, { useState, useEffect } from 'react';

const PatternMemory = ({ question, onAnswer }) => {
  const [phase, setPhase] = useState('memorize'); // 'memorize' or 'recall'
  const [selected, setSelected] = useState([]);

  // Auto-hide the pattern after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('recall');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const toggleTile = (index) => {
    if (phase === 'memorize') return; // Can't click while memorizing
    
    let newSelection;
    if (selected.includes(index)) {
      newSelection = selected.filter(i => i !== index);
    } else {
      newSelection = [...selected, index];
    }
    setSelected(newSelection);
    // Send the sorted array of numbers as a comma-separated string back to the engine
    onAnswer(newSelection.sort().join(',')); 
  };

  return (
    <div className="flex flex-col items-center animate-fade-in w-full">
      <div className="mb-8 text-center h-8">
        {phase === 'memorize' ? (
          <span className="text-jb-accent font-bold tracking-widest uppercase animate-pulse">Memorize Pattern...</span>
        ) : (
          <span className="text-slate-500 font-bold tracking-widest uppercase">Recall Pattern</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 bg-white/50 p-4 rounded-2xl border border-slate-200 shadow-xl">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
          const isTarget = phase === 'memorize' && question.targetPattern.includes(index);
          const isSelected = selected.includes(index);

          return (
            <div 
              key={index}
              onClick={() => toggleTile(index)}
              className={`w-24 h-24 rounded-xl cursor-pointer transition-all duration-300 ${
                isTarget 
                  ? 'bg-jb-accent shadow-[0_5px_15px_rgba(13,148,136,0.4)]' 
                  : isSelected
                    ? 'bg-jb-accent/80 border-2 border-jb-accent/50 shadow-inner'
                    : 'bg-slate-100 hover:bg-slate-200 border border-slate-200'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PatternMemory;