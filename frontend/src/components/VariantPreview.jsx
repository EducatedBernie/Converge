import { useState, useEffect } from 'react';
import { fetchJSON } from '../utils/api';
import { labelVariants } from '../utils/variants';

const FEATURE_LABELS = {
  urgency: 'Urgency',
  detail: 'Detail',
  social_proof: 'Social Proof',
  simplicity: 'Simplicity',
  reassurance: 'Reassurance',
};

export default function VariantPreview({ selectedStep, variants: variantsProp }) {
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (variantsProp?.length) {
      setVariants(variantsProp);
    } else {
      fetchJSON('/data/variants').then(setVariants).catch(() => {});
    }
  }, [variantsProp]);

  const labeled = labelVariants(variants, selectedStep);

  if (!labeled.length) {
    return <div className="text-[10px] text-slate-600 text-center py-3">Loading variants...</div>;
  }

  return (
    <div className="flex gap-3">
      {labeled.map((v) => (
        <div
          key={v.id}
          className="flex-1 rounded-lg border border-[#1e2a4a] bg-[#0a0e1a] p-3 relative overflow-hidden"
        >
          {/* Top color accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: v.color }} />

          {/* Header */}
          <div className="flex items-center gap-2 mb-2.5">
            <span
              className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold text-white"
              style={{ backgroundColor: v.color }}
            >
              {v.label}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {v.isGenerated ? 'AI Generated' : 'Seed Variant'}
            </span>
          </div>

          {/* Content mockup */}
          <div className="rounded bg-[#111827] border border-[#1e2a4a] p-2.5 mb-2">
            <p className="text-[11px] text-slate-200 font-semibold leading-tight">
              {v.content?.headline}
            </p>
            <p className="text-[9px] text-slate-400 leading-snug mt-1">
              {v.content?.subtext}
            </p>
            <button
              className="mt-2 px-3 py-1 rounded text-[9px] font-semibold text-white"
              style={{ backgroundColor: v.color }}
            >
              {v.content?.cta}
            </button>
          </div>

          {/* Feature bars */}
          <div className="space-y-1">
            {Object.entries(v.features || {}).map(([k, val]) => (
              <div key={k} className="flex items-center gap-1.5">
                <span className="text-[8px] text-slate-500 w-14 truncate">
                  {FEATURE_LABELS[k] || k}
                </span>
                <div className="flex-1 h-1 bg-[#1a2340] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${val * 100}%`, backgroundColor: v.color, opacity: 0.7 }}
                  />
                </div>
                <span className="text-[8px] text-slate-600 w-5 text-right font-mono">
                  {(val * 100).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
