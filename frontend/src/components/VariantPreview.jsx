import { useState, useEffect, useRef } from 'react';
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
  C: '/variant-c.png',
};

export default function VariantPreview({ selectedStep, variants: variantsProp }) {
  const [variants, setVariants] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [newIds, setNewIds] = useState(new Set());
  const knownIds = useRef(new Set());

  useEffect(() => {
    if (variantsProp?.length) {
      setVariants(variantsProp);

      // Detect newly added variants
      const incoming = new Set(variantsProp.map((v) => v.id));
      const fresh = [];
      for (const id of incoming) {
        if (!knownIds.current.has(id)) fresh.push(id);
      }
      knownIds.current = incoming;

      if (fresh.length && knownIds.current.size > fresh.length) {
        // Only flag as "new" if there were already known variants (not initial load)
        setNewIds(new Set(fresh));
        const timer = setTimeout(() => setNewIds(new Set()), 6000);
        return () => clearTimeout(timer);
      }
    } else {
      fetchJSON('/data/variants').then(setVariants).catch(() => {});
    }
  }, [variantsProp]);

  const labeled = labelVariants(variants, selectedStep);

  if (!labeled.length) {
    return <div className="text-[10px] text-gray-400 text-center py-3">Loading variants...</div>;
  }

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex gap-3">
      {labeled.map((v) => {
        const isExpanded = expanded[v.id];
        const hasImage = !!VARIANT_IMAGES[v.label];
        const isNew = newIds.has(v.id);

        return (
          <div
            key={v.id}
            className={`flex-1 rounded-lg border bg-white p-3 relative overflow-hidden transition-all duration-500 ${
              isNew ? 'border-amber-400 shadow-md shadow-amber-100' : 'border-gray-200'
            }`}
            style={isNew ? { animation: 'fadeSlideIn 0.5s ease-out' } : {}}
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
              {isNew && (
                <span className="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  NEW — Just generated
                </span>
              )}
            </div>

            {/* Content mockup — tiny preview, click to expand */}
            {hasImage ? (
              <div
                className="relative rounded border border-gray-200 mb-2 cursor-pointer group"
                onClick={() => toggle(v.id)}
              >
                {isExpanded ? (
                  <img
                    src={VARIANT_IMAGES[v.label]}
                    alt={`Variant ${v.label} onboarding screen`}
                    className="w-full rounded"
                  />
                ) : (
                  <>
                    <div className="h-10 overflow-hidden rounded">
                      <img
                        src={VARIANT_IMAGES[v.label]}
                        alt={`Variant ${v.label} onboarding screen`}
                        className="w-full object-cover object-top"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b" />
                  </>
                )}
                <div className="text-center py-0.5 text-[9px] text-gray-400 group-hover:text-gray-600 transition-colors">
                  {isExpanded ? 'Collapse' : 'Expand preview'}
                </div>
              </div>
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
        );
      })}
    </div>
  );
}
