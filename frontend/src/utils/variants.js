// Maps variant data into step-relative labels (A, B, C...)
// and provides consistent colors per label.

const LETTERS = 'ABCDEFGHIJKLMNOP';

export const VARIANT_COLORS = {
  A: '#3b82f6',
  B: '#8b5cf6',
  C: '#f59e0b',
  D: '#10b981',
  E: '#ef4444',
  F: '#ec4899',
};

export function labelVariants(variants, selectedStep) {
  // Filter to selected step, sort by id (seed variants first)
  const stepVariants = variants
    .filter((v) => v.step_id === selectedStep)
    .sort((a, b) => a.id - b.id);

  return stepVariants.map((v, i) => ({
    ...v,
    label: LETTERS[i] || `V${v.id}`,
    color: VARIANT_COLORS[LETTERS[i]] || '#64748b',
    isGenerated: v.generation > 0,
  }));
}
