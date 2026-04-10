import React, { useRef, useState, useEffect } from 'react';
import { Eraser } from 'lucide-react';

const DrawingCanvas = ({ question, onAnswer }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Set white background for the canvas context so the drawn image is visible when exported
    ctx.fillStyle = '#ffffff'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#222222'; // Draw in black for light mode
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    onAnswer(canvasRef.current.toDataURL());
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onAnswer(null);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-10 animate-fade-in w-full">
      
      {/* Sleek Reference Image */}
      <div className="bg-white/80 border border-slate-200 p-6 rounded-2xl backdrop-blur-sm flex flex-col items-center shadow-xl">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6">Reference</h3>
        <img src={question.assetUrl} alt="Reference" className="w-56 h-56 object-contain opacity-80" />
      </div>

      {/* Light Mode Canvas */}
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={350}
          height={350}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="bg-white border border-slate-200 rounded-2xl shadow-xl cursor-crosshair touch-none group-hover:border-slate-300 transition-colors"
        />
        
        {/* Sleek Floating Eraser Button */}
        <button 
          onClick={clearCanvas}
          className="absolute -top-4 -right-4 bg-red-50 text-red-500 border border-red-200 p-3 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-md"
          title="Clear Canvas"
        >
          <Eraser size={20} />
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;