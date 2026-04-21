import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, LogOut, User, Sun, Moon, BarChart2, Globe, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'es', label: 'Español (Spanish)' },
  { code: 'fr', label: 'Français (French)' },
  { code: 'zh-CN', label: '中文 (Chinese)' },
];

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { isDark, toggleTheme } = useTheme();
  
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    // Set the Google Translate cookie to trigger automatic translation
    document.cookie = `googtrans=/en/${langCode}; path=/`;
    document.cookie = `googtrans=/en/${langCode}; domain=.${window.location.hostname}; path=/`;
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-jb-border bg-jb-dark/70 backdrop-blur-xl">
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

          {/* Hidden Google Translate Target */}
          <div id="google_translate_element" className="hidden"></div>

          {/* ===== CUSTOM LANGUAGE DROPDOWN ===== */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-jb-border bg-jb-card/80 hover:border-jb-accent/60 text-slate-300 hover:text-white transition-all duration-300 text-sm font-medium"
            >
              <Globe size={16} className="text-cyan-400" />
              <ChevronDown size={14} className={`transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-jb-dark/95 backdrop-blur-xl border border-jb-border rounded-xl shadow-2xl z-50 animate-fade-in origin-top-right">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-jb-accent/20 transition-colors flex items-center gap-2"
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== DASHBOARD LINK ===== */}
          {user && (
            <Link
              to="/dashboard"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-jb-card/60 border border-jb-border hover:border-jb-accent/50 text-slate-300 hover:text-white transition-all duration-300 text-sm font-medium"
            >
              <BarChart2 size={16} className="text-jb-accent" />
              Dashboard
            </Link>
          )}

          {/* ===== THEME TOGGLE ===== */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-jb-border bg-jb-card/80 hover:bg-jb-accent/10 hover:border-jb-accent/40 text-slate-300 transition-all duration-300 group"
          >
            {isDark ? (
              <Sun size={18} className="text-yellow-300 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <Moon size={18} className="text-indigo-500 group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-300" />
            )}
          </button>

          {/* ===== USER PROFILE ===== */}
          {user ? (
            <div className="flex items-center gap-3 bg-jb-card/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-jb-border shadow-sm ml-1">
              <div className="flex items-center gap-2 text-slate-200">
                <div className="bg-jb-accent/20 p-1 rounded-lg">
                  <User size={14} className="text-jb-accent" />
                </div>
                <span className="font-medium text-sm tracking-wide hidden md:block">{user.name.split(' ')[0]}</span>
              </div>
              <div className="w-[1px] h-4 bg-slate-700 hidden md:block" />
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded-lg text-sm font-medium flex items-center"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-2">
              <Link to="/login" className="px-3 py-1.5 text-sm text-slate-300 font-medium hover:text-white transition-colors">Log In</Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 text-sm bg-jb-accent hover:bg-jb-accent-hover text-white rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] hover:-translate-y-0.5"
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
