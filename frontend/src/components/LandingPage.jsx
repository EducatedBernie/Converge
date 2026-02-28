import { useState } from 'react';

const AGENTS = [
  {
    title: 'Bandit',
    subtitle: 'Traffic Allocator',
    description:
      'Thompson Sampling dynamically routes users to the best-performing variant at each funnel step, balancing exploration with exploitation in real time.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 16l4-8 4 4 5-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Analyst',
    subtitle: 'Pattern Detector',
    description:
      'Claude observes conversion patterns across persona segments, identifies which copy elements resonate, and formulates hypotheses about what to test next.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
        <path d="M12 2v10l7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Generator',
    subtitle: 'Variant Creator',
    description:
      'Based on analyst insights, Claude generates new onboarding copy variants designed to outperform the current best — then the bandit tests them live.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="3" width="18" height="18" rx="3" />
      </svg>
    ),
  },
];

const SCENARIOS = [
  {
    key: 'impatient',
    label: 'Impatient Users',
    description: '70% impatient, 15% casual, 15% goal-oriented',
    detail: 'Fast-moving users who skip explanations. The bandit should converge on short, urgency-driven copy.',
    color: 'from-orange-500 to-red-500',
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
  },
  {
    key: 'skeptical',
    label: 'Skeptical & Anxious',
    description: '50% skeptical, 35% anxious, 15% goal-oriented',
    detail: 'Cautious users who need proof. The bandit should favor social proof and reassurance-heavy copy.',
    color: 'from-blue-500 to-cyan-500',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
  },
];

const FLOW_STEPS = [
  { label: 'Users', sub: 'enter funnel' },
  { label: 'Bandit', sub: 'routes traffic' },
  { label: 'Analyst', sub: 'finds patterns' },
  { label: 'Generator', sub: 'writes variants' },
  { label: 'New variant', sub: 'enters pool' },
];

const TECH = ['React', 'FastAPI', 'Claude API', 'Thompson Sampling', 'D3', 'Tailwind CSS', 'SSE Streaming', 'SQLite'];

export default function LandingPage({ onLaunch }) {
  const [selected, setSelected] = useState('impatient');

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-200">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#1e2a4a]/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <span className="text-base font-bold text-white tracking-tight">Converge</span>
        </div>
        <a
          href="https://github.com/EducatedBernie/Converge"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          GitHub
        </a>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center px-6 pt-24 pb-16">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
          What if your onboarding funnel could{' '}
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            rewrite itself?
          </span>
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
          Converge is an AI-powered simulation that combines multi-armed bandits with Claude to
          continuously optimize onboarding copy. It allocates traffic, detects conversion patterns,
          and generates new variants — all in a live feedback loop.
        </p>
      </section>

      {/* Scenario picker */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-4 text-center">
          Choose a user population
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {SCENARIOS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSelected(s.key)}
              className={`text-left p-4 rounded-xl border transition-all ${
                selected === s.key
                  ? `${s.border} ${s.bg}`
                  : 'border-[#1e2a4a] bg-[#0f1629] hover:border-[#2e3a5a]'
              }`}
            >
              <div className={`text-sm font-semibold ${selected === s.key ? s.text : 'text-white'}`}>
                {s.label}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">{s.description}</div>
              <div className="text-[11px] text-slate-400 mt-2 leading-relaxed">{s.detail}</div>
            </button>
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={() => onLaunch(selected)}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
          >
            Launch Demo
          </button>
          <p className="mt-3 text-xs text-slate-600">Pre-recorded 500-user simulation — no backend needed</p>
          <p className="mt-1.5 text-[11px] text-slate-600 max-w-md mx-auto">
            This replays a captured run. The live system uses FastAPI with real-time SSE,
            Claude API calls, and SQLite.
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-[#0f1629] rounded-xl border border-[#1e2a4a] p-8">
          <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-4">The Problem</h2>
          <p className="text-slate-300 leading-relaxed">
            Growth teams are bottlenecked by experiment velocity. Traditional A/B testing requires manual
            hypothesis generation, slow iteration cycles, and statistical expertise. Most teams run 2-3
            experiments per quarter on their onboarding funnel — far too few to find what actually converts.
          </p>
        </div>
      </section>

      {/* The System — 3-card */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-8 text-center">
          The System
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {AGENTS.map((agent) => (
            <div
              key={agent.title}
              className="bg-[#0f1629] rounded-xl border border-[#1e2a4a] p-6 hover:border-purple-500/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                {agent.icon}
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{agent.title}</h3>
              <p className="text-[11px] text-purple-400 mb-3">{agent.subtitle}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{agent.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works — flow diagram */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-8 text-center">
          How It Works
        </h2>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {FLOW_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="bg-[#0f1629] border border-[#1e2a4a] rounded-lg px-4 py-3 text-center min-w-[100px]">
                <div className="text-xs font-semibold text-white">{step.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{step.sub}</div>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <svg width="20" height="12" viewBox="0 0 20 12" className="text-purple-500/50 flex-shrink-0">
                  <path d="M0 6h16M12 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-500 mt-4">
          The loop repeats every ~50 users, with the analyst and generator refining variants based on live data.
        </p>
      </section>

      {/* Tech Stack */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-6 text-center">
          Tech Stack
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {TECH.map((t) => (
            <span
              key={t}
              className="px-3 py-1.5 bg-[#0f1629] border border-[#1e2a4a] rounded-full text-xs text-slate-400"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-3xl mx-auto text-center px-6 pt-8 pb-24">
        <button
          onClick={() => onLaunch(selected)}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
        >
          Launch Demo
        </button>
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-600">
          <a
            href="https://github.com/EducatedBernie/Converge"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-400 transition-colors"
          >
            View on GitHub
          </a>
          <span>|</span>
          <span>Built by Bernie</span>
        </div>
      </section>
    </div>
  );
}
