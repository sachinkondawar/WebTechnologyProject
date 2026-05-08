import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, Users, FileText, CheckCircle, Search, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { getAllUsersResults, getCurrentAdmin, adminLogout } from '../api/adminApi';
import NeuralBackground from '../components/NeuralBackground';

// --- Smart Data Renderer for Admin Dashboard ---
const RenderAnswerValue = ({ value }) => {
  if (value === null || value === undefined) {
    return <span className="text-slate-500 italic">N/A</span>;
  }

  // Handle Arrays
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-slate-500 italic">Empty List</span>;
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((item, idx) => (
          <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-jb-accent/10 text-jb-accent border border-jb-accent/20">
            {typeof item === 'object' ? JSON.stringify(item) : String(item)}
          </span>
        ))}
      </div>
    );
  }

  // Handle Objects
  if (typeof value === 'object') {
    if (Object.keys(value).length === 0) return <span className="text-slate-500 italic">Empty Object</span>;
    return (
      <div className="mt-3 bg-black/20 p-3 rounded-lg border border-jb-border space-y-2">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 border-b border-jb-border/50 last:border-0 pb-2 last:pb-0">
            <span className="text-xs text-slate-400 capitalize whitespace-nowrap pt-0.5">{k.replace(/_/g, ' ')}</span>
            <div className="text-sm text-white font-medium sm:text-right break-all">
              <RenderAnswerValue value={v} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Handle Long Strings (e.g., transcripts)
  if (typeof value === 'string' && value.length > 80) {
    return (
      <div className="mt-2 p-4 bg-black/40 rounded-lg border border-jb-border/50 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
        {value}
      </div>
    );
  }

  // Default (Numbers, Booleans, Short Strings)
  return <span className="text-base text-white font-bold break-all">{String(value)}</span>;
};
// ------------------------------------------------


const AdminDashboardPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  
  const admin = getCurrentAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin || !admin.token) {
      navigate('/login');
      return;
    }

    const fetchResults = async () => {
      try {
        const data = await getAllUsersResults(admin.token);
        setResults(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [admin, navigate]);

  const handleLogout = () => {
    adminLogout();
    navigate('/login');
  };

  const toggleRow = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  const filteredResults = results.filter(result => {
    const searchLower = searchQuery.toLowerCase();
    const userName = result.userId?.name?.toLowerCase() || '';
    const userEmail = result.userId?.email?.toLowerCase() || '';
    const testId = result.testId?.toLowerCase() || '';
    return userName.includes(searchLower) || userEmail.includes(searchLower) || testId.includes(searchLower);
  });

  const totalUsers = new Set(results.map(r => r.userId?._id)).size;
  const totalTests = results.length;
  const avgScore = results.length > 0 
    ? Math.round(results.reduce((acc, r) => acc + (r.finalScore / r.maxScore) * 100, 0) / results.length) 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-jb-dark flex items-center justify-center">
        <NeuralBackground />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-jb-accent/30 border-t-jb-accent rounded-full animate-spin"></div>
          <p className="mt-4 text-jb-accent font-medium animate-pulse">Loading Admin Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-jb-dark text-slate-200 font-sans selection:bg-jb-accent selection:text-white">
      <NeuralBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-jb-card/80 backdrop-blur-md border-b border-jb-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-jb-accent/10 rounded-lg ring-1 ring-jb-accent/30">
              <Shield className="h-6 w-6 text-jb-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">Cognitive Platform Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white">{admin?.name}</p>
              <p className="text-xs text-jb-accent">System Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-jb-accent hover:bg-jb-accent/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-jb-card backdrop-blur-xl border border-jb-border rounded-2xl p-6 flex items-center gap-4 shadow-[0_8px_30px_rgba(13,148,136,0.1)]">
            <div className="p-4 bg-jb-accent/10 rounded-xl">
              <Users className="h-8 w-8 text-jb-accent" />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium tracking-wide uppercase">Total Users</p>
              <p className="text-3xl font-black text-white">{totalUsers}</p>
            </div>
          </div>
          <div className="bg-jb-card backdrop-blur-xl border border-jb-border rounded-2xl p-6 flex items-center gap-4 shadow-[0_8px_30px_rgba(13,148,136,0.1)]">
            <div className="p-4 bg-purple-500/10 rounded-xl">
              <FileText className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium tracking-wide uppercase">Test Sessions</p>
              <p className="text-3xl font-black text-white">{totalTests}</p>
            </div>
          </div>
          <div className="bg-jb-card backdrop-blur-xl border border-jb-border rounded-2xl p-6 flex items-center gap-4 shadow-[0_8px_30px_rgba(13,148,136,0.1)]">
            <div className="p-4 bg-emerald-500/10 rounded-xl">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium tracking-wide uppercase">Avg Score</p>
              <p className="text-3xl font-black text-white">{avgScore}%</p>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-jb-card backdrop-blur-xl border border-jb-border rounded-2xl shadow-[0_8px_30px_rgba(13,148,136,0.1)] overflow-hidden">
          
          <div className="p-6 border-b border-jb-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-jb-accent" /> User Test Results
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, email, or test..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 pl-10 pr-4 py-2 bg-black/40 border border-jb-border rounded-lg text-sm text-white focus:ring-2 focus:ring-jb-accent/50 focus:border-jb-accent outline-none transition-all placeholder-slate-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">User Details</th>
                  <th className="px-6 py-4 font-medium">Test ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Score</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-jb-border">
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      No results found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((result) => (
                    <React.Fragment key={result._id}>
                      <tr className="hover:bg-jb-accent/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">{result.userId?.name || 'Unknown User'}</span>
                            <span className="text-xs text-slate-400">{result.userId?.email || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/40 text-jb-accent border border-jb-border capitalize">
                            {result.testId?.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {new Date(result.createdAt).toLocaleDateString()} {new Date(result.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${
                                (result.finalScore / result.maxScore) >= 0.8 ? 'text-emerald-400' : 
                                (result.finalScore / result.maxScore) >= 0.5 ? 'text-yellow-400' : 'text-rose-400'
                              }`}>
                              {result.finalScore} / {result.maxScore}
                            </span>
                            <span className="text-xs text-slate-500">
                              ({Math.round((result.finalScore / result.maxScore) * 100)}%)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => toggleRow(result._id)}
                            className="inline-flex items-center justify-center p-2 rounded-lg bg-black/40 text-slate-300 hover:text-white hover:bg-jb-accent border border-jb-border transition-all"
                          >
                            {expandedRow === result._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded Details Row */}
                      {expandedRow === result._id && (
                        <tr className="bg-black/20 border-b border-jb-border">
                          <td colSpan="5" className="px-6 py-8">
                            <div className="bg-black/40 rounded-2xl p-6 border border-jb-border shadow-inner">
                              <h4 className="text-base font-bold text-jb-accent mb-6 flex items-center gap-2 border-b border-jb-border/50 pb-4">
                                <FileText size={18} /> Detailed Test Metrics
                              </h4>
                              
                              {result.answers && Object.keys(result.answers).length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {Object.entries(result.answers).map(([key, value]) => {
                                    // Make complex/large data span full width
                                    const isComplex = typeof value === 'object' || (typeof value === 'string' && value.length > 80);
                                    
                                    return (
                                      <div 
                                        key={key} 
                                        className={`bg-jb-card p-5 rounded-xl border border-jb-border shadow-sm transition-all hover:border-jb-accent/30 ${
                                          isComplex ? 'md:col-span-2 lg:col-span-3' : ''
                                        }`}
                                      >
                                        <p className="text-xs text-jb-accent font-bold tracking-wider uppercase mb-1">
                                          {key.replace(/_/g, ' ')}
                                        </p>
                                        <RenderAnswerValue value={value} />
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <p className="text-sm text-slate-500 italic">No granular answer data was captured during this session.</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>
    </div>
  );
};

export default AdminDashboardPage;
