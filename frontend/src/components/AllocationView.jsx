import { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { fetchJSON } from '../utils/api';
import { labelVariants } from '../utils/variants';

export default function AllocationView({ banditStates, selectedStep, variants: variantsProp }) {
  const [variants, setVariants] = useState([]);
  const [mode, setMode] = useState('allocation');

  useEffect(() => {
    if (variantsProp?.length) {
      setVariants(variantsProp);
    } else {
      fetchJSON('/data/variants').then(setVariants).catch(() => {});
    }
  }, [variantsProp]);

  const data = useMemo(() => {
    const labeled = labelVariants(variants, selectedStep);

    const totalExposures = labeled.reduce((sum, v) => {
      const bs = banditStates.find((s) => s.variant_id === v.id);
      return sum + (bs ? bs.exposures : 0);
    }, 0);

    return labeled.map((v) => {
      const bs = banditStates.find((s) => s.variant_id === v.id);
      const exposures = bs ? bs.exposures : 0;
      const rate = bs ? bs.rate : 0;
      const allocation = totalExposures > 0 ? (exposures / totalExposures) * 100 : 50;

      return {
        label: v.label,
        color: v.color,
        headline: v.content?.headline || '',
        cta: v.content?.cta || '',
        allocation: Math.round(allocation * 10) / 10,
        rate: Math.round(rate * 1000) / 10,
        exposures,
        conversions: bs ? bs.conversions : 0,
        isGenerated: v.isGenerated,
      };
    });
  }, [banditStates, selectedStep, variants]);

  const chartKey = mode === 'allocation' ? 'allocation' : 'rate';

  return (
    <div>
      {/* Toggle */}
      <div className="flex items-center gap-1 mb-3">
        <button
          onClick={() => setMode('allocation')}
          className={`px-2.5 py-0.5 text-[10px] rounded transition-colors ${
            mode === 'allocation' ? 'bg-blue-600 text-white' : 'bg-[#1a2340] text-slate-500'
          }`}
        >
          Traffic Shape
        </button>
        <button
          onClick={() => setMode('conversion')}
          className={`px-2.5 py-0.5 text-[10px] rounded transition-colors ${
            mode === 'conversion' ? 'bg-blue-600 text-white' : 'bg-[#1a2340] text-slate-500'
          }`}
        >
          Conversion
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={Math.max(100, data.length * 48)}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
          <XAxis
            type="number"
            domain={[0, mode === 'allocation' ? 100 : 'auto']}
            tick={{ fill: '#475569', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
            width={24}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ background: '#0f1629', border: '1px solid #1e2a4a', borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: '#e2e8f0' }}
            formatter={(value) => [`${value}%`, mode === 'allocation' ? 'Allocation' : 'Conv. Rate']}
          />
          <Bar dataKey={chartKey} radius={[0, 6, 6, 0]} barSize={24}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Variant detail cards */}
      <div className="mt-3 space-y-2">
        {data.map((d) => (
          <div
            key={d.label}
            className="flex items-start gap-2.5 p-2 rounded-lg bg-[#0a0e1a] border border-[#1e2a4a]"
          >
            {/* Letter badge */}
            <span
              className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 mt-0.5"
              style={{ backgroundColor: d.color }}
            >
              {d.label}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-200 font-medium leading-tight truncate">
                {d.headline}
              </p>
              <p className="text-[9px] text-slate-500 mt-0.5">
                CTA: "{d.cta}"
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 flex-shrink-0 text-[10px]">
              <div className="text-center">
                <div className="text-slate-500">{d.exposures}</div>
                <div className="text-[8px] text-slate-600">shown</div>
              </div>
              <div className="text-center">
                <div className="text-emerald-400 font-mono font-semibold">{d.rate}%</div>
                <div className="text-[8px] text-slate-600">conv</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-mono">{d.allocation}%</div>
                <div className="text-[8px] text-slate-600">traffic</div>
              </div>
              {d.isGenerated && (
                <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[9px] font-semibold animate-pulse">
                  AI
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
