export default function StatusBar({ sim }) {
  const isActive = sim.status === 'running';
  const isPaused = sim.status === 'paused';

  const isStarting = sim.status === 'starting';

  let message = 'Idle — click Start to begin simulation.';
  if (isStarting) message = 'Generating conversion matrix via Claude...';
  if (isActive) message = `Loop running (${sim.userCount} users processed). Bandit optimizing.`;
  if (isPaused) message = 'Simulation paused.';
  if (sim.status === 'completed') message = `Simulation complete — ${sim.userCount} users processed.`;

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0b0f1e] border-b border-[#1e2a4a]">
      <span
        className={`w-2 h-2 rounded-full ${
          isStarting ? 'bg-blue-400 animate-pulse' : isActive ? 'bg-emerald-400 animate-pulse' : isPaused ? 'bg-amber-400' : 'bg-slate-600'
        }`}
      />
      <span className={`text-[11px] font-medium ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
        {isStarting ? 'LOADING' : isActive ? 'ACTIVE' : isPaused ? 'PAUSED' : sim.status === 'completed' ? 'DONE' : 'IDLE'}
      </span>
      <span className="text-[11px] text-slate-500">{message}</span>
    </div>
  );
}
