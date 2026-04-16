import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRight, BrainCircuit, Mail, Lock, User } from 'lucide-react';
import NeuralBackground from '../components/NeuralBackground';
import { signup } from '../api/auth';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
      await signup(formData);
      navigate('/'); // Redirect to dashboard or landing page
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 font-sans selection:bg-jb-accent selection:text-white overflow-hidden text-slate-800">
      <NeuralBackground />
      
      <div className="relative z-10 w-full max-w-md animate-fade-in py-8">
        
        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white drop-shadow-sm">Create Account</h2>
          <p className="text-slate-400 mt-2">Join the next-gen cognitive platform</p>
        </div>

        {/* Card */}
        <div className="bg-jb-card/80 backdrop-blur-xl border border-jb-border rounded-3xl p-8 shadow-[0_8px_30px_rgba(13,148,136,0.1)] relative overflow-hidden group">
          {/* Subtle top glow line */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-jb-accent to-transparent"></div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="p-4 bg-red-900/30 text-red-300 border border-red-500/30 rounded-xl text-sm text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-slate-300 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500 group-focus-within:text-jb-accent transition-colors" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-black/20 text-white border border-jb-border rounded-xl focus:ring-2 focus:ring-jb-accent focus:border-transparent outline-none transition-all placeholder-slate-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-jb-accent transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-black/20 text-white border border-jb-border rounded-xl focus:ring-2 focus:ring-jb-accent focus:border-transparent outline-none transition-all placeholder-slate-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-jb-accent transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-black/20 text-white border border-jb-border rounded-xl focus:ring-2 focus:ring-jb-accent focus:border-transparent outline-none transition-all placeholder-slate-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-jb-accent hover:bg-jb-accent-hover text-white py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account <UserPlus size={20} />
                </>
              )}
            </button>

          </form>

          <div className="mt-8 text-center pt-6 border-t border-jb-border/50">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-jb-accent font-semibold hover:text-white transition-colors flex items-center justify-center gap-1 inline-flex">
                Log in here <ArrowRight size={14} />
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignupPage;
