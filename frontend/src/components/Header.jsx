import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, LogOut, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-jb-border bg-jb-dark/70 backdrop-blur-xl">
      {/* Subtle gradient line at very top */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-jb-accent/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="inline-flex items-center gap-2 group">
          <BrainCircuit className="text-jb-accent group-hover:scale-110 transition-transform duration-300" size={28} />
          <span className="text-2xl font-black tracking-tighter text-white">
            <span className="bg-gradient-to-r from-jb-accent to-purple-500 bg-clip-text text-transparent">
              Smriti
            </span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3">
          
          {/* ===== THEME TOGGLE ===== */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative w-14 h-7 rounded-full border border-jb-border bg-jb-card/80 backdrop-blur-md flex items-center transition-all duration-300 hover:border-jb-accent/60 hover:shadow-[0_0_12px_rgba(14,165,233,0.25)] overflow-hidden"
          >
            {/* Track fill — slides with theme */}
            <span
              className={`absolute inset-0 rounded-full transition-all duration-500 ${
                isDark
                  ? 'bg-gradient-to-r from-indigo-900/60 to-violet-900/60'
                  : 'bg-gradient-to-r from-sky-300/50 to-amber-200/50'
              }`}
            />
            {/* Icons */}
            <span className="absolute left-1.5 text-yellow-300 transition-all duration-300" style={{ opacity: isDark ? 0 : 1, transform: isDark ? 'scale(0.5)' : 'scale(1)' }}>
              <Sun size={14} />
            </span>
            <span className="absolute right-1.5 text-indigo-300 transition-all duration-300" style={{ opacity: isDark ? 1 : 0, transform: isDark ? 'scale(1)' : 'scale(0.5)' }}>
              <Moon size={14} />
            </span>
            {/* Knob */}
            <span
              className={`relative z-10 w-5 h-5 rounded-full shadow-md transition-all duration-400 flex items-center justify-center text-xs font-bold ${
                isDark
                  ? 'translate-x-7 bg-indigo-500 text-white shadow-[0_0_8px_rgba(99,102,241,0.6)]'
                  : 'translate-x-1 bg-amber-400 text-white shadow-[0_0_8px_rgba(251,191,36,0.6)]'
              }`}
            />
          </button>

          {user ? (
            <div className="flex items-center gap-4 bg-jb-card/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-jb-border shadow-sm">
              <div className="flex items-center gap-2 text-slate-200">
                <div className="bg-jb-accent/20 p-1.5 rounded-lg">
                  <User size={16} className="text-jb-accent" />
                </div>
                <span className="font-medium text-sm tracking-wide">{user.name}</span>
              </div>
              <div className="w-[1px] h-5 bg-slate-700" />
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 transition-colors px-2 py-1 rounded-lg text-sm font-medium flex items-center gap-1.5"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="px-4 py-2 text-slate-300 font-medium hover:text-white transition-colors">Log In</Link>
              <Link
                to="/signup"
                className="px-6 py-2.5 bg-jb-accent hover:bg-jb-accent-hover text-white rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
