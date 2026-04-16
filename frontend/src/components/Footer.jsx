import React from 'react';
import { Github, Twitter, Linkedin, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative border-t border-jb-border bg-jb-dark/70 backdrop-blur-xl pt-16 pb-8 overflow-hidden z-10 w-full">
      {/* Top subtle glow line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-jb-accent/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <BrainCircuit className="text-jb-accent" size={24} />
              <span className="text-xl font-black tracking-tighter text-white">
                Smriti
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm text-sm">
              A state-of-the-art cognitive evaluation platform integrating premium assessments with real-time AI analytics.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold tracking-wide text-sm uppercase">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-jb-accent transition-colors">Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-jb-accent transition-colors">Login</Link></li>
              <li><Link to="/signup" className="hover:text-jb-accent transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold tracking-wide text-sm uppercase">Connect</h4>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-jb-card border border-jb-border rounded-lg text-slate-400 hover:text-white hover:border-jb-accent transition-all hover:-translate-y-1">
                <Github size={18} />
              </a>
              <a href="#" className="p-2 bg-jb-card border border-jb-border rounded-lg text-slate-400 hover:text-white hover:border-jb-accent transition-all hover:-translate-y-1">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-jb-card border border-jb-border rounded-lg text-slate-400 hover:text-white hover:border-jb-accent transition-all hover:-translate-y-1">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-jb-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Smriti Cognitive Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
