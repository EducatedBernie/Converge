import { useState } from 'react';

const PERSONAS = [
  { key: 'impatient', label: 'Impatient', color: '#8b5cf6' },
  { key: 'skeptical', label: 'Skeptical', color: '#3b82f6' },
  { key: 'casual', label: 'Casual', color: '#06b6d4' },
  { key: 'goal_oriented', label: 'Goal-Oriented', color: '#10b981' },
  { key: 'anxious', label: 'Anxious', color: '#f59e0b' },
];

function Ring({ pct, color, size = 48 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e2a4a" strokeWidth={4} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-300"
      />
    </svg>
  );
}

export default function PopulationMixer({ sim, isMock }) {
  const [mix, setMix] = useState(
    Object.fromEntries(PERSONAS.map((p) => [p.key, 20]))
  );

  const handleChange = (key, value) => {
    if (isMock) return;
    const newMix = { ...mix, [key]: Number(value) };
    setMix(newMix);
    const total = Object.values(newMix).reduce((a, b) => a + b, 0);
    if (total > 0) {
      const normalized = Object.fromEntries(
        Object.entries(newMix).map(([k, v]) => [k, v / total])
      );
      sim.setPopulationMix(normalized);
    }
  };

  return (
    <div>
      {/* Ring row */}
      <div className="flex justify-between mb-3">
        {PERSONAS.map((p) => (
          <div key={p.key} className="flex flex-col items-center">
            <div className="relative">
              <Ring pct={mix[p.key]} color={p.color} size={44} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                {mix[p.key]}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Sliders */}
      <div className={`space-y-1.5 ${isMock ? 'opacity-50 pointer-events-none' : ''}`}>
        {PERSONAS.map((p) => (
          <div key={p.key} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-[10px] text-slate-400 w-20 truncate">{p.label}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={mix[p.key]}
              onChange={(e) => handleChange(p.key, e.target.value)}
              className="flex-1 h-1 accent-blue-500 cursor-pointer"
              style={{ accentColor: p.color }}
            />
            <span className="text-[10px] text-slate-500 font-mono w-7 text-right">{mix[p.key]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
