import React, { useEffect, useRef } from 'react';

const NeuralBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Track mouse position
    let mouse = { x: null, y: null, radius: 150 };

    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    // Keep canvas full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle (Neuron) Class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Size of the node
        this.speedX = Math.random() * 1 - 0.5; // Movement speed
        this.speedY = Math.random() * 1 - 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(13, 148, 136, 0.4)'; // jb-accent color (Teal)
        ctx.fill();
      }
    }

    // Initialize Neurons (Adjust number based on screen size so it doesn't lag)
    const init = () => {
      particles = [];
      let numberOfParticles = (canvas.height * canvas.width) / 12000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    // Draw Synapses (Lines between nodes and mouse)
    const connect = () => {
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
            + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
          
          // Connect Node to Node
          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            opacityValue = 1 - (distance / 20000);
            ctx.strokeStyle = `rgba(20, 184, 166, ${opacityValue * 0.5})`; // Teal gradient lines
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }

        // Connect Node to Mouse
        if (mouse.x && mouse.y) {
          let mouseDistance = ((particles[a].x - mouse.x) * (particles[a].x - mouse.x))
            + ((particles[a].y - mouse.y) * (particles[a].y - mouse.y));
          
          if (mouseDistance < 25000) {
            let mouseOpacity = 1 - (mouseDistance / 25000);
            ctx.strokeStyle = `rgba(13, 148, 136, ${mouseOpacity * 0.6})`; // Teal mouse connection
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    };

    // Main Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default NeuralBackground;