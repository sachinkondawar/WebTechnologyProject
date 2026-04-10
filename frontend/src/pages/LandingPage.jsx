import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BrainCircuit, ArrowRight, Sparkles, LogOut, User } from 'lucide-react';
import NeuralBackground from '../components/NeuralBackground'; 

const LandingPage = () => {
  const [testDatabase, setTestDatabase] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Immediately initialize user from local storage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return; 
    }

    fetch('http://localhost:5000/api/tests')
      .then(res => res.json())
      .then(data => {
        setTestDatabase(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch tests:', err);
        setLoading(false);
      });
  }, [user]);

  // Protect the route
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div className="min-h-screen bg-jb-dark flex items-center justify-center text-slate-800">Loading modules...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="relative min-h-screen p-8 md:p-16 font-sans selection:bg-jb-accent selection:text-white overflow-hidden text-slate-800">
      
      {/* --- THE LIVING BACKGROUND --- */}
      <NeuralBackground /> 
      
      {/* Wrap everything in a z-10 relative div so it sits on top of the canvas */}
      <div className="relative z-10">
        
        {/* Navigation Bar */}
        <nav className="max-w-6xl mx-auto mb-16 flex justify-end items-center gap-4 animate-fade-in">
          {user ? (
            <div className="flex items-center gap-4 bg-jb-card/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-jb-border shadow-[0_8px_30px_rgba(13,148,136,0.08)]">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="bg-jb-accent/10 p-1.5 rounded-lg">
                  <User size={18} className="text-jb-accent" />
                </div>
                <span className="font-semibold text-sm tracking-wide">{user.name}</span>
              </div>
              <div className="w-[1px] h-6 bg-slate-200"></div>
              <button 
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-500 transition-colors px-2 py-1 rounded-lg text-sm font-medium flex items-center gap-1.5"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-5 py-2 text-slate-600 font-semibold hover:text-slate-900 transition-colors">Log In</Link>
              <Link to="/signup" className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Get Started
              </Link>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jb-card border border-jb-border mb-8 backdrop-blur-md shadow-sm">
            <Sparkles size={16} className="text-jb-accent" />
            <span className="text-sm font-medium tracking-wide text-slate-600">Next-Gen Cognitive Assessment</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 drop-shadow-sm text-slate-900">
            <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
              Smriti
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl font-light leading-relaxed drop-shadow-sm">
            A dynamic, clinical-grade cognitive evaluation platform. Experience seamless assessments with real-time AI grading.
          </p>
        </div>

        {/* Tests Grid */}
        <div className="max-w-6xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-semibold mb-8 text-slate-800 flex items-center gap-3 drop-shadow-sm">
            <BrainCircuit className="text-jb-accent" /> Available Modules
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testDatabase.map((test) => (
              <div key={test.id} className="group relative flex flex-col h-full bg-jb-card backdrop-blur-xl border border-jb-border rounded-2xl p-8 hover:border-jb-accent/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(13,148,136,0.15)] shadow-sm">
                
                {/* Subtle top glow line */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-jb-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>

                <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">{test.title}</h3>
                <p className="text-slate-500 mb-8 flex-grow leading-relaxed">{test.description}</p>
                
                <Link 
                  to={`/test/${test.id}`}
                  className="inline-flex items-center justify-between w-full bg-slate-100 hover:bg-jb-accent text-slate-700 hover:text-white px-6 py-4 rounded-xl font-medium transition-colors duration-300 group-hover:shadow-[0_8px_20px_rgba(13,148,136,0.2)]"
                >
                  Launch Module <ArrowRight size={20} />
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;