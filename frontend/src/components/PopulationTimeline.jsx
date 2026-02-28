import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const PERSONAS = [
  { key: 'impatient', color: '#8b5cf6' },
  { key: 'skeptical', color: '#3b82f6' },
  { key: 'casual', color: '#06b6d4' },
  { key: 'goal_oriented', color: '#10b981' },
  { key: 'anxious', color: '#f59e0b' },
];

export default function PopulationTimeline({ events }) {
  const data = useMemo(() => {
    // Bucket events into groups of 10 users
    const buckets = [];
    const counts = {};

    for (const e of events) {
      if (e.step !== 1) continue; // only count at step 1 entry
      const bucket = Math.floor((e.user_number - 1) / 10);
      if (!counts[bucket]) counts[bucket] = { impatient: 0, skeptical: 0, casual: 0, goal_oriented: 0, anxious: 0 };
      counts[bucket][e.persona] = (counts[bucket][e.persona] || 0) + 1;
    }

    const keys = Object.keys(counts).map(Number).sort((a, b) => a - b);
    for (const k of keys) {
      const c = counts[k];
      const total = Object.values(c).reduce((a, b) => a + b, 0) || 1;
      buckets.push({
        x: k * 10,
        ...Object.fromEntries(PERSONAS.map((p) => [p.key, ((c[p.key] || 0) / total) * 100])),
      });
    }
    return buckets;
  }, [events]);

  if (data.length < 2) {
    return <div className="text-[10px] text-slate-600 text-center py-4">Awaiting data...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={80}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <XAxis dataKey="x" tick={false} axisLine={false} />
        <YAxis tick={false} axisLine={false} domain={[0, 100]} />
        {PERSONAS.map((p) => (
          <Area
            key={p.key}
            type="monotone"
            dataKey={p.key}
            stackId="1"
            stroke={p.color}
            fill={p.color}
            fillOpacity={0.6}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
