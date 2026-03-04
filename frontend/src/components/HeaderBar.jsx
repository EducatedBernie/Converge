import { useState } from 'react';

const SPEEDS = [1, 5, 10, 25, 50];

export default function HeaderBar({ sim, isMock }) {
  const [speed, setSpeed] = useState(5);

  const handleSpeed = (s) => {
    setSpeed(s);
    sim.setSpeed(s);
  };

  const startLabel = isMock
    ? sim.status === 'completed' ? 'Replay' : 'Launch Demo'
    : 'Start';

  return (
    <header className="flex items-center gap-4 px-4 py-2 bg-white border-b border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
          <span className="text-white text-xs font-bold">C</span>
        </div>
        <div>
          <span className="text-sm font-bold text-gray-900 tracking-tight">Converge:</span>
          <span className="text-[10px] text-gray-400 ml-1 tracking-widest uppercase">
            Adaptive Onboarding Optimizer
          </span>
        </div>
      </div>

      {/* Start / Pause / Stop */}
      <div className="flex gap-1.5">
        {sim.status === 'idle' || sim.status === 'completed' ? (
          <button
            onClick={() => sim.start()}
            className="px-4 py-1 bg-gray-900 hover:bg-gray-800 rounded text-xs font-semibold text-white transition-colors"
          >
            {startLabel}
          </button>
        ) : sim.status === 'starting' ? (
          <button
            disabled
            className="px-4 py-1 bg-gray-200 rounded text-xs font-semibold text-gray-500 cursor-wait"
          >
            Loading...
          </button>
        ) : sim.status === 'running' ? (
          <button
            onClick={() => sim.pause()}
            className="px-4 py-1 bg-gray-900 hover:bg-gray-800 rounded text-xs font-semibold text-white transition-colors"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={() => sim.resume()}
            className="px-4 py-1 bg-gray-900 hover:bg-gray-800 rounded text-xs font-semibold text-white transition-colors"
          >
            Resume
          </button>
        )}
        {(sim.status === 'running' || sim.status === 'paused') && (
          <button
            onClick={() => sim.stop()}
            className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-50 rounded text-xs font-semibold text-gray-600 transition-colors"
          >
            Stop
          </button>
        )}
      </div>

      {/* User count */}
      <div className="text-xs text-gray-500">
        Users: <span className="text-gray-900 font-mono font-semibold">{sim.userCount}</span>
        <span className="text-gray-300 mx-1">/</span>
        <span className="text-gray-400 font-mono">500</span>
      </div>

      {/* Speed */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-gray-400 mr-1">Speed:</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => handleSpeed(s)}
            className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
              speed === s
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

    </header>
  );
}
