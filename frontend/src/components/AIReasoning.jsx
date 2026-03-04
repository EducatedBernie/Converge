export default function AIReasoning({ sim, selectedStep }) {
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
    if (sim.userCount < 130) return 'Observed trend: Persona segments respond differently to copy tone. ' +
      'High-urgency personas convert best on short, action-oriented copy (Variant A). ' +
      'Detail-seeking personas (Skeptical, Goal-Oriented) favor Variant B with social proof. ' +
      'Forming hypothesis: a blend of urgency + social proof could outperform both.';
    if (sim.userCount < 150) return 'Hypothesis formed. Recommending Generator produce Variant C: ' +
      'urgency-driven headline (from A) + social proof subtext (from B) + reassurance CTA for anxious users.';
    return 'Hypothesis delivered to Generator. Variant C is now live and collecting data. ' +
      'Monitoring early conversion signal against A and B.';
  };

  const getGeneratorInsight = () => {
    if (sim.userCount < 130) return 'Idle — awaiting analyst hypothesis.';
    if (sim.userCount < 150) return 'Hypothesis received from Analyst. Generating Variant C that blends: ' +
      'urgency headline (from A\'s signal) + social proof subtext (from B\'s strength with skeptical users) + ' +
      'reassurance CTA for anxious segment.';
    return 'Variant C generated and deployed to bandit pool. Copy: "Join 10,000 teams — get started in 30 seconds." ' +
      'Now competing against A and B across all 4 funnel steps.';
  };

  const agents = [
    { name: 'Bandit', dotColor: sim.userCount > 0 ? 'bg-green-500' : 'bg-gray-300', text: getBanditInsight() },
    { name: 'Analyst', dotColor: sim.userCount > 50 ? 'bg-blue-500' : 'bg-gray-300', text: getAnalystInsight() },
    { name: 'Generator', dotColor: sim.userCount > 100 ? 'bg-purple-500' : 'bg-gray-300', text: getGeneratorInsight() },
  ];

  return (
    <div className="space-y-2.5">
      {agents.map((a) => (
        <div key={a.name}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`w-1.5 h-1.5 rounded-full ${a.dotColor}`} />
            <span className="text-[10px] font-semibold text-gray-900">{a.name}</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed pl-3">
            {a.text}
          </p>
        </div>
      ))}
    </div>
  );
}
