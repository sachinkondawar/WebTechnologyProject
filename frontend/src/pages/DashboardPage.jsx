import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BarChart2, TrendingUp, Brain, Trophy, Target, Activity, ArrowRight, Calendar } from 'lucide-react';
import NeuralBackground from '../components/NeuralBackground';

// ─── Module metadata ───────────────────────────────────────────────────────────
const MODULE_META = {
  'mindcheck-full':        { label: 'General Cognitive',     color: '#0ea5e9', domains: { Memory: 0.3, Language: 0.4, Attention: 0.3 } },
  'executive-us-standard': { label: 'Executive Function',    color: '#a855f7', domains: { Executive: 0.5, Attention: 0.3, Memory: 0.2 } },
  'spatial-dynamics':      { label: 'Spatial & Reaction',    color: '#10b981', domains: { Spatial: 0.7, Memory: 0.3 } },
  'ai-semantic':           { label: 'AI Clinical Interview', color: '#06b6d4', domains: { Language: 0.5, Executive: 0.3, Memory: 0.2 } },
};
const DOMAINS = ['Memory', 'Attention', 'Language', 'Executive', 'Spatial'];
const scorePct = (s, m) => (m > 0 ? Math.round((s / m) * 100) : 0);

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color, delay = '0s' }) => (
  <div
    className="bg-jb-card backdrop-blur-xl border border-jb-border rounded-2xl p-5 flex items-start gap-4 hover:border-jb-accent/40 hover:-translate-y-1 transition-all duration-300 animate-fade-in"
    style={{ animationDelay: delay }}
  >
    <div className="p-3 rounded-xl flex-shrink-0" style={{ background: `${color}22` }}>
      <Icon size={20} style={{ color }} />
    </div>
    <div className="min-w-0">
      <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-white truncate">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Line / Area Chart (pure SVG) ──────────────────────────────────────────────
const LineChart = ({ data }) => {
  const W = 560, H = 185, PL = 44, PR = 16, PT = 16, PB = 32;
  const iW = W - PL - PR, iH = H - PT - PB;
  const yTicks = [0, 25, 50, 75, 100];

  if (data.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-44 gap-3 text-slate-500">
        <TrendingUp size={32} className="opacity-30" />
        <p className="text-sm">Complete 2+ tests to see your trend</p>
      </div>
    );
  }

  const toX = (i) => PL + (i / (data.length - 1)) * iW;
  const toY = (v) => PT + iH - (v / 100) * iH;
  const pts = data.map((d, i) => ({ x: toX(i), y: toY(d.pct), ...d }));
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${(H - PB).toFixed(1)} L${PL},${(H - PB).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" overflow="visible">
      <defs>
        <linearGradient id="lgArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="lgLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <filter id="ptGlow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Grid */}
      {yTicks.map(t => (
        <g key={t}>
          <line x1={PL} y1={toY(t)} x2={W - PR} y2={toY(t)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3,4" />
          <text x={PL - 6} y={toY(t) + 4} textAnchor="end" fill="#475569" fontSize="10">{t}%</text>
        </g>
      ))}

      {/* Area */}
      <path d={areaPath} fill="url(#lgArea)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="url(#lgLine)" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ strokeDasharray: 3000, strokeDashoffset: 3000, animation: 'dashDraw 1.6s ease-out forwards' }}
      />

      {/* Points */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="7" fill="#0ea5e9" fillOpacity="0.15" />
          <circle cx={p.x} cy={p.y} r="3.5" fill="#0ea5e9" filter="url(#ptGlow)" />
          <text x={p.x} y={p.y - 11} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">{p.pct}%</text>
          <text x={p.x} y={H - 4} textAnchor="middle" fill="#334155" fontSize="9">#{i + 1}</text>
          <title>{p.label} · {p.pct}% · {p.date}</title>
        </g>
      ))}
    </svg>
  );
};

// ─── Horizontal Bar Chart (pure SVG-ish, CSS animated) ────────────────────────
const BarChart = ({ data }) => {
  if (!data.length) return <p className="text-slate-500 text-sm text-center py-8">No module data yet.</p>;
  return (
    <div className="space-y-5 pt-2">
      {data.map((item, i) => (
        <div key={item.testId} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <span className="text-sm font-medium text-slate-200">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">{item.attempts} run{item.attempts !== 1 ? 's' : ''}</span>
              <span className="text-sm font-black" style={{ color: item.color }}>{item.bestPct}%</span>
            </div>
          </div>
          <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full rounded-full"
              style={{
                width: `${item.bestPct}%`,
                background: `linear-gradient(90deg, ${item.color}88, ${item.color})`,
                boxShadow: `0 0 10px ${item.color}55`,
                animation: `barGrow 1s ${i * 0.15}s cubic-bezier(0.4,0,0.2,1) both`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Radar / Spider Chart (pure SVG) ──────────────────────────────────────────
const RadarChart = ({ scores }) => {
  const CX = 150, CY = 150, R = 100;
  const n = DOMAINS.length;
  const step = (2 * Math.PI) / n;
  const start = -Math.PI / 2;
  const pt = (idx, r) => ({
    x: CX + r * Math.cos(start + idx * step),
    y: CY + r * Math.sin(start + idx * step),
  });
  const rings = [0.25, 0.5, 0.75, 1];
  const dataPts = DOMAINS.map((d, i) => pt(i, ((scores[d] || 0) / 100) * R));
  const dataD = dataPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z';
  const hasData = DOMAINS.some(d => (scores[d] || 0) > 0);

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[260px] mx-auto">
      <defs>
        <linearGradient id="rdrGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.55" />
        </linearGradient>
        <filter id="rdrGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Rings */}
      {rings.map((r, ri) => {
        const p = DOMAINS.map((_, i) => pt(i, r * R));
        const d = p.map((q, i) => `${i === 0 ? 'M' : 'L'}${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ') + 'Z';
        return <path key={ri} d={d} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />;
      })}

      {/* Axes */}
      {DOMAINS.map((_, i) => {
        const ax = pt(i, R);
        return <line key={i} x1={CX} y1={CY} x2={ax.x.toFixed(1)} y2={ax.y.toFixed(1)} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />;
      })}

      {/* Data polygon */}
      {hasData && (
        <path d={dataD} fill="url(#rdrGrad)" stroke="#a855f7" strokeWidth="2"
          filter="url(#rdrGlow)"
          style={{ animation: 'fadeIn 0.9s ease-out forwards' }}
        />
      )}

      {/* Data dots */}
      {hasData && dataPts.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="4" fill="#0ea5e9" filter="url(#rdrGlow)" />
      ))}

      {/* Labels */}
      {DOMAINS.map((d, i) => {
        const lp = pt(i, R + 24);
        return (
          <text key={d} x={lp.x.toFixed(1)} y={lp.y.toFixed(1)}
            textAnchor="middle" dominantBaseline="middle"
            fill={scores[d] > 0 ? '#94a3b8' : '#334155'} fontSize="11" fontWeight="600">
            {d}
          </text>
        );
      })}

      {/* Centre score label */}
      {hasData && (
        <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle"
          fill="#e2e8f0" fontSize="13" fontWeight="800">
          {Math.round(DOMAINS.reduce((s, d) => s + (scores[d] || 0), 0) / DOMAINS.length)}%
        </text>
      )}
    </svg>
  );
};

// ─── Score Badge ───────────────────────────────────────────────────────────────
const ScoreBadge = ({ pct }) => {
  const color = pct >= 80 ? '#10b981' : pct >= 55 ? '#0ea5e9' : pct >= 30 ? '#f59e0b' : '#ef4444';
  return (
    <span className="px-2.5 py-1 rounded-lg text-xs font-black" style={{ background: `${color}22`, color }}>
      {pct}%
    </span>
  );
};

// ─── CSS Keyframes injected once ───────────────────────────────────────────────
const DashStyle = () => (
  <style>{`
    @keyframes dashDraw { to { stroke-dashoffset: 0; } }
    @keyframes barGrow  { from { width: 0; } }
    @keyframes fadeIn   { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  `}</style>
);

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  useEffect(() => {
    let base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    base = base.replace(/\/+$/, ''); // Remove any trailing slashes

    fetch(`${base}/api/tests/results`, {
      headers: { 'Authorization': `Bearer ${user?.token}` }
    })
      .then(async r => {
        if (!r.ok) {
          const text = await r.text();
          console.error("Failed to fetch results. Status:", r.status, text);
          throw new Error('Network response was not ok');
        }
        return r.json();
      })
      .then(d => { setResults(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(err => { console.error("Error fetching dashboard data:", err); setLoading(false); });
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-jb-accent/30 border-t-jb-accent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading your analytics…</p>
        </div>
      </div>
    );
  }

  // ── Computed analytics ────────────────────────────────────────────────────
  const validResults = results.filter(r => r.maxScore > 0);
  const allPcts = validResults.map(r => scorePct(r.finalScore, r.maxScore));
  const avgPct = allPcts.length ? Math.round(allPcts.reduce((a, b) => a + b, 0) / allPcts.length) : 0;
  const highestPct = allPcts.length ? Math.max(...allPcts) : 0;

  const moduleCounts = results.reduce((acc, r) => { acc[r.testId] = (acc[r.testId] || 0) + 1; return acc; }, {});
  const favModuleId = Object.keys(moduleCounts).sort((a, b) => moduleCounts[b] - moduleCounts[a])[0];
  const favLabel = favModuleId ? (MODULE_META[favModuleId]?.label ?? favModuleId) : '—';

  // Line chart: chronological (oldest first)
  const lineData = [...validResults].reverse().map(r => ({
    pct: scorePct(r.finalScore, r.maxScore),
    label: MODULE_META[r.testId]?.label ?? r.testId,
    date: new Date(r.createdAt).toLocaleDateString(),
  }));

  // Bar chart: best per module
  const moduleGroups = results.reduce((acc, r) => { (acc[r.testId] = acc[r.testId] || []).push(r); return acc; }, {});
  const barData = Object.keys(moduleGroups).map(id => {
    const best = moduleGroups[id].reduce((b, r) => {
      const p = scorePct(r.finalScore, r.maxScore);
      return p > b.pct ? { pct: p, score: r.finalScore, max: r.maxScore } : b;
    }, { pct: 0, score: 0, max: 0 });
    return { testId: id, label: MODULE_META[id]?.label ?? id, color: MODULE_META[id]?.color ?? '#0ea5e9', bestPct: best.pct, bestScore: best.score, bestMax: best.max, attempts: moduleGroups[id].length };
  }).sort((a, b) => b.bestPct - a.bestPct);

  // Radar: domain scores
  const domainScores = Object.fromEntries(DOMAINS.map(d => {
    const contribs = Object.keys(moduleGroups).flatMap(id => {
      const meta = MODULE_META[id];
      if (!meta?.domains[d]) return [];
      const bestPct = Math.max(...moduleGroups[id].map(r => scorePct(r.finalScore, r.maxScore)));
      return [{ pct: bestPct, w: meta.domains[d] }];
    });
    if (!contribs.length) return [d, 0];
    const tw = contribs.reduce((s, c) => s + c.w, 0);
    return [d, Math.round(contribs.reduce((s, c) => s + c.pct * c.w, 0) / tw)];
  }));

  const recent = results.slice(0, 8);

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!results.length) {
    return (
      <div className="relative min-h-screen p-8 font-sans overflow-hidden">
        <DashStyle />
        <NeuralBackground />
        <div className="relative z-10 max-w-xl mx-auto pt-28 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-jb-accent/10 border border-jb-accent/20 mb-8">
            <BarChart2 size={40} className="text-jb-accent" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">No Results Yet</h1>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Complete your first cognitive assessment and your personal analytics dashboard will come alive.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-jb-accent hover:bg-jb-accent-hover text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:-translate-y-0.5">
            Start a Module <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  // ── Full Dashboard ────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen p-6 md:p-10 font-sans overflow-hidden text-slate-200">
      <DashStyle />
      <NeuralBackground />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ── Page Header ── */}
        <div className="mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-jb-card border border-jb-border mb-4 text-xs text-slate-400 tracking-wide">
            <Activity size={12} className="text-jb-accent" /> Analytics Dashboard
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-jb-accent via-cyan-400 to-purple-500 bg-clip-text text-transparent">{user?.name?.split(' ')[0] ?? 'User'}</span>
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Here's a full picture of your cognitive performance.</p>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Brain}    label="Tests Taken"    value={results.length}       sub="all time"                  color="#0ea5e9" delay="0s" />
          <StatCard icon={Trophy}   label="Highest Score"  value={`${highestPct}%`}     sub="personal best"             color="#a855f7" delay="0.08s" />
          <StatCard icon={Target}   label="Avg Score"      value={`${avgPct}%`}         sub="across all attempts"       color="#10b981" delay="0.16s" />
          <StatCard icon={BarChart2} label="Top Module"    value={favLabel}             sub={`${moduleCounts[favModuleId] || 0} runs`} color="#f59e0b" delay="0.24s" />
        </div>

        {/* ── Main Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Line Chart — 2/3 width */}
          <div className="lg:col-span-2 bg-jb-card backdrop-blur-xl border border-jb-border rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-jb-accent" />
              <h2 className="text-base font-semibold text-white">Performance Over Time</h2>
              <span className="ml-auto text-xs text-slate-500">{lineData.length} attempt{lineData.length !== 1 ? 's' : ''}</span>
            </div>
            <LineChart data={lineData} />
          </div>

          {/* Radar Chart — 1/3 width */}
          <div className="bg-jb-card backdrop-blur-xl border border-jb-border rounded-2xl p-6 flex flex-col animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 mb-4">
              <Brain size={18} className="text-purple-400" />
              <h2 className="text-base font-semibold text-white">Cognitive Profile</h2>
            </div>
            <div className="flex-grow flex items-center justify-center">
              <RadarChart scores={domainScores} />
            </div>
            {/* Domain legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 border-t border-jb-border pt-4">
              {DOMAINS.map(d => (
                <div key={d} className="flex justify-between text-xs">
                  <span className="text-slate-400">{d}</span>
                  <span className="font-bold text-slate-200">{domainScores[d]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Row: Bar Chart + Recent Attempts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Bar Chart */}
          <div className="bg-jb-card backdrop-blur-xl border border-jb-border rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 size={18} className="text-emerald-400" />
              <h2 className="text-base font-semibold text-white">Best Score Per Module</h2>
            </div>
            <BarChart data={barData} />
          </div>

          {/* Recent Attempts */}
          <div className="bg-jb-card backdrop-blur-xl border border-jb-border rounded-2xl p-6 flex flex-col animate-fade-in" style={{ animationDelay: '0.38s' }}>
            <div className="flex items-center gap-2 mb-5">
              <Calendar size={18} className="text-cyan-400" />
              <h2 className="text-base font-semibold text-white">Recent Attempts</h2>
              <span className="ml-auto text-xs text-slate-500">Last {recent.length}</span>
            </div>
            <div className="space-y-2 flex-grow overflow-y-auto pr-1" style={{ maxHeight: 360 }}>
              {recent.map((r, i) => {
                const p = scorePct(r.finalScore, r.maxScore);
                const meta = MODULE_META[r.testId];
                const dt = new Date(r.createdAt);
                return (
                  <div key={r._id} className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 hover:border-jb-accent/30 transition-colors group animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                    {/* Color dot */}
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta?.color ?? '#0ea5e9' }} />
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{meta?.label ?? r.testId}</p>
                      <p className="text-xs text-slate-500">
                        {dt.toLocaleDateString()} · {dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <ScoreBadge pct={p} />
                      <span className="text-xs text-slate-500">{r.finalScore}/{r.maxScore}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 mt-2 border-t border-jb-border">
              <Link to="/" className="text-sm text-jb-accent hover:text-white transition-colors flex items-center gap-1.5 font-medium">
                Take another module <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
