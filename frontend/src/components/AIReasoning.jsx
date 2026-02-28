import { useState } from 'react';

const TABS = ['Bandit', 'Analyst', 'Generator'];

export default function AIReasoning({ sim, selectedStep }) {
  const [activeTab, setActiveTab] = useState('Bandit');

  const getBanditInsight = () => {
    if (!sim.banditStates.length) return 'Waiting for simulation data...';

    const vAId = selectedStep * 2 - 1;
    const vBId = selectedStep * 2;
    const sA = sim.banditStates.find((s) => s.variant_id === vAId);
    const sB = sim.banditStates.find((s) => s.variant_id === vBId);

    if (!sA && !sB) return 'No data for this step yet.';
    if (!sA?.exposures && !sB?.exposures) return 'Collecting initial samples...';

    const best = (sA?.rate || 0) >= (sB?.rate || 0) ? sA : sB;
    const worst = best === sA ? sB : sA;
    const bestLetter = best === sA ? 'A' : 'B';
    const worstLetter = bestLetter === 'A' ? 'B' : 'A';

    const bestRate = (best.rate * 100).toFixed(1);
    const worstRate = ((worst?.rate || 0) * 100).toFixed(1);
    const trafficPct = ((best.exposures / (best.exposures + (worst?.exposures || 1))) * 100).toFixed(0);

    return `Variant ${bestLetter} leads at ${bestRate}% conversion (${best.exposures} shown). ` +
      `Variant ${worstLetter} at ${worstRate}%. Thompson Sampling is routing ${trafficPct}% of traffic to the leader.`;
  };

  const getAnalystInsight = () => {
    if (sim.userCount < 30) return 'Waiting for sufficient data to begin analysis (~30 users needed)...';
    if (sim.userCount < 80) return 'Early signal: Identifying persona-variant affinity patterns. Need more data to form a hypothesis.';
    return 'Observed trend: Persona segments are responding differently to copy tone. ' +
      'High-urgency personas convert best on short, action-oriented copy (Variant A). ' +
      'Detail-seeking personas (Skeptical, Goal-Oriented) favor Variant B with social proof and feature specifics. ' +
      'Recommending new variant that blends urgency headline with social proof subtext.';
  };

  const getGeneratorInsight = () => {
    if (sim.userCount < 100) return 'Generator idle — awaiting analyst hypothesis.';
    return 'Hypothesis received. Generating Variant C that combines: ' +
      'short urgency headline (from A\'s winning signal) + social proof subtext (from B\'s strength with skeptical users) + ' +
      'reassurance CTA for anxious segment. Variant will enter the bandit pool and compete against A and B.';
  };

  const content = {
    Bandit: getBanditInsight(),
    Analyst: getAnalystInsight(),
    Generator: getGeneratorInsight(),
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          const dotColor = tab === 'Bandit'
            ? (sim.userCount > 0 ? 'bg-emerald-400' : 'bg-slate-600')
            : tab === 'Analyst'
            ? (sim.userCount > 50 ? 'bg-blue-400' : 'bg-slate-600')
            : (sim.userCount > 100 ? 'bg-purple-400' : 'bg-slate-600');

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1 text-[10px] rounded transition-colors ${
                isActive
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
                  : 'bg-[#1a2340] text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
              {tab}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <p className="text-[11px] text-slate-400 leading-relaxed">
        {content[activeTab]}
      </p>
    </div>
  );
}
