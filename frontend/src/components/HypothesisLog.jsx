import { useMemo } from 'react';

const STATUS_STYLES = {
  validated: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Confirmed' },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Rejected' },
  pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Testing' },
};

// Placeholder hypotheses derived from live bandit data.
// Layer 2 replaces these with real Claude-generated hypotheses.
export default function HypothesisLog({ sim }) {
  const hypotheses = useMemo(() => {
    if (sim.userCount < 20) return [];

    const items = [];
    const states = sim.banditStates;
    if (!states.length) return [];

    // Step 1: Welcome — A vs B
    const sA = states.find((s) => s.variant_id === 1);
    const sB = states.find((s) => s.variant_id === 2);

    if (sA && sB && sA.exposures > 5 && sB.exposures > 5) {
      const winner = sA.rate > sB.rate ? sA : sB;
      const loser = winner === sA ? sB : sA;
      const winnerLetter = winner === sA ? 'A' : 'B';
      const winnerStyle = winner === sA ? 'urgency + simplicity' : 'social proof + detail';

      items.push({
        id: 'h1',
        text: `Welcome: Variant ${winnerLetter} leads`,
        detail: `${winnerStyle} copy at ${(winner.rate * 100).toFixed(1)}% vs ${(loser.rate * 100).toFixed(1)}%`,
        confidence: Math.min(0.95, 0.5 + (winner.exposures / 500)),
        status: winner.exposures > 100 ? 'validated' : 'pending',
        step: 1,
      });
    }

    if (sim.userCount > 50) {
      items.push({
        id: 'h2',
        text: 'Skeptical needs detail-heavy copy',
        detail: 'Skeptical personas convert 2-3x higher on Variant B across steps 1 & 2',
        confidence: 0.72,
        status: sim.userCount > 200 ? 'validated' : 'pending',
        step: 2,
      });
    }

    if (sim.userCount > 100) {
      items.push({
        id: 'h3',
        text: 'First Task: urgency CTA for impatient',
        detail: 'Impatient segment responds to "Try it — 10 seconds" but effect may not hold at scale',
        confidence: 0.58,
        status: sim.userCount > 300 ? 'rejected' : 'pending',
        step: 3,
      });
    }

    if (sim.userCount > 150) {
      items.push({
        id: 'h4',
        text: 'Conversion: guarantee copy lifts anxious',
        detail: 'Variant B ("money-back guarantee") predicted to outperform urgency CTA for anxious users',
        confidence: 0.81,
        status: sim.userCount > 350 ? 'validated' : 'pending',
        step: 4,
      });
    }

    if (sim.userCount > 250) {
      items.push({
        id: 'h5',
        text: 'Cross-step: social proof saturation',
        detail: 'Adding social proof to every step may reduce novelty — diminishing returns observed',
        confidence: 0.44,
        status: sim.userCount > 400 ? 'rejected' : 'pending',
        step: null,
      });
    }

    return items;
  }, [sim.userCount, sim.banditStates]);

  if (!hypotheses.length) {
    return (
      <div className="text-[10px] text-slate-600 text-center py-6">
        Hypotheses appear as data accumulates...
      </div>
    );
  }

  return (
    <div className="space-y-1 max-h-[260px] overflow-y-auto pr-1">
      {hypotheses.map((h) => {
        const style = STATUS_STYLES[h.status];
        return (
          <div
            key={h.id}
            className="p-2 rounded-lg bg-[#0a0e1a] border border-[#1e2a4a] hover:border-[#2a3a5a] transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${style.bg} ${style.text}`}>
                {style.label}
              </span>
              <span className="text-[11px] text-slate-200 font-medium flex-1 truncate">
                {h.text}
              </span>
              {/* Confidence bar */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="w-12 h-1.5 bg-[#1a2340] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${h.confidence * 100}%`,
                      backgroundColor: h.confidence > 0.7 ? '#10b981' : h.confidence > 0.5 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 font-mono w-7 text-right">
                  {(h.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 leading-snug pl-0.5">{h.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
