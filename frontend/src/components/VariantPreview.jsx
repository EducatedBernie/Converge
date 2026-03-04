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

const VARIANT_IMAGES = {
  A: '/variant-a.png',
  B: '/variant-b.png',
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
    return <div className="text-[10px] text-gray-400 text-center py-3">Loading variants...</div>;
  }

  return (
    <div className="flex gap-3">
      {labeled.map((v) => (
        <div
          key={v.id}
          className="flex-1 rounded-lg border border-gray-200 bg-white p-3 relative overflow-hidden"
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
            <span className="text-[10px] text-gray-400 font-medium">
              {v.isGenerated ? 'AI Generated' : 'Seed Variant'}
            </span>
          </div>

          {/* Content mockup */}
          {VARIANT_IMAGES[v.label] ? (
            <img
              src={VARIANT_IMAGES[v.label]}
              alt={`Variant ${v.label} onboarding screen`}
              className="rounded border border-gray-200 mb-2 w-full"
            />
          ) : (
            <div className="rounded bg-gray-50 border border-gray-200 p-2.5 mb-2">
              <p className="text-[11px] text-gray-800 font-semibold leading-tight">
                {v.content?.headline}
              </p>
              <p className="text-[9px] text-gray-500 leading-snug mt-1">
                {v.content?.subtext}
              </p>
              <button
                className="mt-2 px-3 py-1 rounded text-[9px] font-semibold text-white"
                style={{ backgroundColor: v.color }}
              >
                {v.content?.cta}
              </button>
            </div>
          )}

          {/* Feature bars */}
          <div className="space-y-1">
            {Object.entries(v.features || {}).map(([k, val]) => (
              <div key={k} className="flex items-center gap-1.5">
                <span className="text-[8px] text-gray-400 w-14 truncate">
                  {FEATURE_LABELS[k] || k}
                </span>
                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${val * 100}%`, backgroundColor: v.color, opacity: 0.7 }}
                  />
                </div>
                <span className="text-[8px] text-gray-400 w-5 text-right font-mono">
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
