import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, ArrowRight, BrainCircuit, Mail, Lock } from 'lucide-react';
import NeuralBackground from '../components/NeuralBackground';
import { login } from '../api/auth';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/'); // Redirect to dashboard or landing page
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 font-sans selection:bg-jb-accent selection:text-white overflow-hidden text-slate-800">
      <NeuralBackground />
      
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <BrainCircuit className="text-jb-accent group-hover:scale-110 transition-transform" size={32} />
            <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
              Smriti
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Log in to access your cognitive dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-jb-card/80 backdrop-blur-xl border border-jb-border rounded-3xl p-8 shadow-[0_8px_30px_rgba(13,148,136,0.1)] relative overflow-hidden group">
          {/* Subtle top glow line */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-jb-accent to-transparent"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-jb-accent transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-jb-border rounded-xl focus:ring-2 focus:ring-jb-accent focus:border-transparent outline-none transition-all placeholder-slate-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-jb-accent transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-jb-border rounded-xl focus:ring-2 focus:ring-jb-accent focus:border-transparent outline-none transition-all placeholder-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Secure Login <LogIn size={20} />
                </>
              )}
            </button>

          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-jb-accent font-semibold hover:underline flex items-center justify-center gap-1 inline-flex">
                Create one <ArrowRight size={14} />
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
