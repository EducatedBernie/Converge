import { useState } from 'react';

const STEPS = [1, 2, 3, 4];
const STEP_NAMES = { 1: 'Welcome', 2: 'Use Case', 3: 'First Task', 4: 'Conversion' };
const PERSONAS = ['impatient', 'skeptical', 'casual', 'goal_oriented', 'anxious'];
const SPEEDS = [1, 5, 10, 25, 50];

export default function ControlPanel({ sim, selectedStep, onSelectStep }) {
  const [speed, setSpeed] = useState(5);
  const [mix, setMix] = useState(
    Object.fromEntries(PERSONAS.map((p) => [p, 20]))
  );

  const handleSpeedChange = (s) => {
    setSpeed(s);
    sim.setSpeed(s);
  };

  const handleMixChange = (persona, value) => {
    const newMix = { ...mix, [persona]: Number(value) };
    setMix(newMix);
    // Normalize to fractions
    const total = Object.values(newMix).reduce((a, b) => a + b, 0);
    if (total > 0) {
      const normalized = Object.fromEntries(
        Object.entries(newMix).map(([k, v]) => [k, v / total])
      );
      sim.setPopulationMix(normalized);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex flex-wrap items-center gap-3">
        {/* Sim controls */}
        <div className="flex gap-2">
          {sim.status === 'idle' || sim.status === 'completed' ? (
            <button
              onClick={() => sim.start()}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded text-sm font-medium transition-colors"
            >
              Start
            </button>
          ) : sim.status === 'running' ? (
            <button
              onClick={() => sim.pause()}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 rounded text-sm font-medium transition-colors"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={() => sim.resume()}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded text-sm font-medium transition-colors"
            >
              Resume
            </button>
          )}
          {(sim.status === 'running' || sim.status === 'paused') && (
            <button
              onClick={() => sim.stop()}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-500 rounded text-sm font-medium transition-colors"
            >
              Stop
            </button>
          )}
        </div>

        {/* User count */}
        <div className="text-sm text-slate-400">
          Users: <span className="text-white font-mono">{sim.userCount}</span>
        </div>

        {/* Speed */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500 mr-1">Speed:</span>
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => handleSpeedChange(s)}
              className={`px-2 py-0.5 text-xs rounded transition-colors ${
                speed === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Step tabs */}
        <div className="flex items-center gap-1 ml-auto">
          {STEPS.map((s) => (
            <button
              key={s}
              onClick={() => onSelectStep(s)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                selectedStep === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {STEP_NAMES[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Population mix sliders */}
      <div className="mt-3 flex flex-wrap gap-4">
        {PERSONAS.map((p) => (
          <div key={p} className="flex items-center gap-2">
            <label className="text-xs text-slate-400 w-24 capitalize">
              {p.replace('_', ' ')}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={mix[p]}
              onChange={(e) => handleMixChange(p, e.target.value)}
              className="w-20 accent-blue-500"
            />
            <span className="text-xs text-slate-500 w-8 font-mono">{mix[p]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
