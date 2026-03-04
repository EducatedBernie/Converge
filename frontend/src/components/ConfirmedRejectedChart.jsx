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
    return <div className="text-[10px] text-gray-400 text-center py-4">Awaiting hypotheses...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
        <XAxis
          dataKey="users"
          tick={{ fill: '#9ca3af', fontSize: 8 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#9ca3af', fontSize: 8 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 10 }}
          labelFormatter={(v) => `${v} users`}
        />
        <Line
          type="monotone"
          dataKey="confirmed"
          stroke="#16a34a"
          strokeWidth={2}
          dot={false}
          name="Confirmed"
        />
        <Line
          type="monotone"
          dataKey="rejected"
          stroke="#dc2626"
          strokeWidth={2}
          dot={false}
          name="Rejected"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
