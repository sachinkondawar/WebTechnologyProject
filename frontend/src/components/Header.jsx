import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, LogOut, User } from 'lucide-react';

const Header = () => {
  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-jb-border bg-jb-dark/70 backdrop-blur-xl">
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
        <nav className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 bg-jb-card/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-jb-border shadow-sm">
              <div className="flex items-center gap-2 text-slate-200">
                <div className="bg-jb-accent/20 p-1.5 rounded-lg">
                  <User size={16} className="text-jb-accent" />
                </div>
                <span className="font-medium text-sm tracking-wide">{user.name}</span>
              </div>
              <div className="w-[1px] h-5 bg-slate-700"></div>
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
              <Link to="/signup" className="px-6 py-2.5 bg-jb-accent hover:bg-jb-accent-hover text-white rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] hover:-translate-y-0.5">
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
