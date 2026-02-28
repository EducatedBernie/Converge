import { useState } from 'react';

const STEPS = [
  { n: 1, label: 'Welcome' },
  { n: 2, label: 'Use Case' },
  { n: 3, label: 'First Task' },
  { n: 4, label: 'Conversion' },
];
const SPEEDS = [1, 5, 10, 25, 50];

export default function HeaderBar({ sim, selectedStep, onSelectStep, isMock }) {
  const [speed, setSpeed] = useState(5);

  const handleSpeed = (s) => {
    setSpeed(s);
    sim.setSpeed(s);
  };

  const startLabel = isMock
    ? sim.status === 'completed' ? 'Replay' : 'Launch Demo'
    : 'Start';

  return (
    <header className="flex items-center gap-4 px-4 py-2 bg-[#0c1022] border-b border-[#1e2a4a]">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">C</span>
        </div>
        <div>
          <span className="text-sm font-bold text-white tracking-tight">Converge:</span>
          <span className="text-[10px] text-slate-400 ml-1 tracking-widest uppercase">
            Adaptive Onboarding Optimizer
          </span>
        </div>
      </div>

      {/* Start / Pause / Stop */}
      <div className="flex gap-1.5">
        {sim.status === 'idle' || sim.status === 'completed' ? (
          <button
            onClick={() => sim.start()}
            className="px-4 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-semibold transition-colors"
          >
            {startLabel}
          </button>
        ) : sim.status === 'starting' ? (
          <button
            disabled
            className="px-4 py-1 bg-blue-600/50 rounded text-xs font-semibold text-blue-200 animate-pulse cursor-wait"
          >
            Loading...
          </button>
        ) : sim.status === 'running' ? (
          <button
            onClick={() => sim.pause()}
            className="px-4 py-1 bg-amber-600 hover:bg-amber-500 rounded text-xs font-semibold transition-colors"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={() => sim.resume()}
            className="px-4 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-semibold transition-colors"
          >
            Resume
          </button>
        )}
        {(sim.status === 'running' || sim.status === 'paused') && (
          <button
            onClick={() => sim.stop()}
            className="px-3 py-1 bg-red-600/80 hover:bg-red-500 rounded text-xs font-semibold transition-colors"
          >
            Stop
          </button>
        )}
      </div>

      {/* User count */}
      <div className="text-xs text-slate-400">
        Users: <span className="text-white font-mono font-semibold">{sim.userCount}</span>
        <span className="text-slate-600 mx-1">/</span>
        <span className="text-slate-500 font-mono">500</span>
      </div>

      {/* Speed */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-slate-500 mr-1">Speed:</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => handleSpeed(s)}
            className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
              speed === s
                ? 'bg-blue-600 text-white'
                : 'bg-[#1a2340] text-slate-500 hover:bg-[#1e2a4a] hover:text-slate-300'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Step tabs — pushed right */}
      <div className="flex items-center gap-1 ml-auto">
        {STEPS.map(({ n, label }) => (
          <button
            key={n}
            onClick={() => onSelectStep(n)}
            className={`px-3 py-1 text-[11px] rounded transition-colors ${
              selectedStep === n
                ? 'bg-blue-600 text-white'
                : 'bg-[#1a2340] text-slate-500 hover:bg-[#1e2a4a] hover:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
