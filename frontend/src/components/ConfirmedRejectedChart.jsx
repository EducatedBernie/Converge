import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function ConfirmedRejectedChart({ sim }) {
  const data = useMemo(() => {
    // Build a simulated confirmed/rejected curve based on user count
    const points = [];
    const maxUsers = Math.max(sim.userCount, 10);

    for (let u = 0; u <= maxUsers; u += Math.max(10, Math.floor(maxUsers / 20))) {
      // Confirmed hypotheses grow faster
      const confirmed = u > 50 ? Math.floor(Math.log2(u / 50 + 1) * 2.5) : 0;
      const rejected = u > 100 ? Math.floor(Math.log2(u / 100 + 1) * 1.5) : 0;
      points.push({ users: u, confirmed, rejected });
    }

    return points;
  }, [sim.userCount]);

  if (sim.userCount < 30) {
    return <div className="text-[10px] text-slate-600 text-center py-4">Awaiting hypotheses...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
        <XAxis
          dataKey="users"
          tick={{ fill: '#475569', fontSize: 8 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#475569', fontSize: 8 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ background: '#0f1629', border: '1px solid #1e2a4a', borderRadius: 6, fontSize: 10 }}
          labelFormatter={(v) => `${v} users`}
        />
        <Line
          type="monotone"
          dataKey="confirmed"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
          name="Confirmed"
        />
        <Line
          type="monotone"
          dataKey="rejected"
          stroke="#ef4444"
          strokeWidth={2}
          dot={false}
          name="Rejected"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
