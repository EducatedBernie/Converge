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
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Title */}
        <h1 className="text-xl font-bold mb-2">What if your onboarding funnel could rewrite itself — and generate new copy to test?</h1>
        <p className="text-sm text-gray-500 mb-6">
          Converge watches how different users respond to different onboarding copy,
          figures out what works for whom, and writes new variations to test — automatically, in real time.
        </p>

        {/* Variant illustration */}
        <img
          src="/variants.png"
          alt="Two onboarding copy variants being tested — urgency vs social proof"
          className="w-full max-w-md mx-auto mb-6 rounded border border-gray-200"
        />

        {/* How it works */}
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">How it works</h2>
        <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1 mb-6">
          <li><strong>Route traffic.</strong> The system sends each user to whichever version of the copy is performing best, while still testing alternatives.</li>
          <li><strong>Spot patterns.</strong> An AI analyst watches conversion data and notices which types of users respond to which style of copy.</li>
          <li><strong>Write new copy.</strong> Based on those patterns, AI generates new variations designed to outperform the current best.</li>
          <li><strong>Repeat.</strong> New copy enters the pool, gets tested on real users, and the cycle continues — converging on what works.</li>
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
        <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-400">
          Built by Bernie
        </div>
      </div>
    </div>
  );
}
