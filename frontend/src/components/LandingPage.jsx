import { useState } from 'react';

const SCENARIOS = [
  {
    key: 'impatient',
    label: 'Impatient Users',
    mix: '70% impatient, 15% casual, 15% goal-oriented',
  },
  {
    key: 'skeptical',
    label: 'Skeptical & Anxious',
    mix: '50% skeptical, 35% anxious, 15% goal-oriented',
  },
];

const TECH = ['React', 'FastAPI', 'Claude API', 'Thompson Sampling', 'D3', 'Tailwind CSS', 'SSE Streaming', 'SQLite'];

export default function LandingPage({ onLaunch }) {
  const [selected, setSelected] = useState('impatient');

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">C</span>
          </div>
          <span className="text-sm font-bold text-gray-900">Converge</span>
        </div>
        <a
          href="https://github.com/EducatedBernie/Converge"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-600 underline"
        >
          GitHub
        </a>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Title */}
        <h1 className="text-xl font-bold mb-2">Converge</h1>
        <p className="text-sm text-gray-500 mb-6">
          Adaptive onboarding copy optimization using multi-armed bandits and Claude.
          A three-agent loop allocates traffic via Thompson Sampling, detects conversion
          patterns across persona segments, and generates new copy variants — continuously,
          in a live feedback loop.
        </p>

        {/* How it works */}
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">How it works</h2>
        <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1 mb-6">
          <li><strong>Bandit</strong> (Thompson Sampling) routes users to the best-performing variant at each funnel step.</li>
          <li><strong>Analyst</strong> (Claude) observes conversion data, identifies persona–copy affinity patterns, forms hypotheses.</li>
          <li><strong>Generator</strong> (Claude) creates new copy variants based on analyst insights; they enter the bandit pool.</li>
          <li>Loop repeats every ~50 users. The system converges on optimal copy per persona segment.</li>
        </ol>

        {/* Scenario picker */}
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Demo</h2>
        <p className="text-sm text-gray-500 mb-3">
          Pre-recorded 500-user simulation. Select a population mix and launch.
        </p>
        <div className="flex gap-2 mb-4">
          {SCENARIOS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSelected(s.key)}
              className={`text-left px-3 py-2 rounded border text-sm transition-colors ${
                selected === s.key
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">{s.label}</div>
              <div className="text-[11px] text-gray-400">{s.mix}</div>
            </button>
          ))}
        </div>
        <button
          onClick={() => onLaunch(selected)}
          className="px-5 py-2 bg-gray-900 hover:bg-gray-800 rounded text-sm font-medium text-white transition-colors"
        >
          Launch Demo
        </button>
        <span className="text-[11px] text-gray-400 ml-3">No backend needed — replays a captured run.</span>

        {/* Tech */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Stack</h2>
          <div className="flex flex-wrap gap-1.5">
            {TECH.map((t) => (
              <span key={t} className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-500">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-3 text-xs text-gray-400">
          <a
            href="https://github.com/EducatedBernie/Converge"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 underline"
          >
            Source
          </a>
          <span>·</span>
          <span>Built by Bernie</span>
        </div>
      </div>
    </div>
  );
}
