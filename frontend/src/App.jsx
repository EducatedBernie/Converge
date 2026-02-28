import { useState } from 'react';
import useSimulation from './hooks/useSimulation';
import useMockSimulation from './hooks/useMockSimulation';
import HeaderBar from './components/HeaderBar';
import StatusBar from './components/StatusBar';
import PopulationMixer from './components/PopulationMixer';
import FunnelView from './components/FunnelView';
import PopulationTimeline from './components/PopulationTimeline';
import AllocationView from './components/AllocationView';
import AIReasoning from './components/AIReasoning';
import VariantPreview from './components/VariantPreview';
import HypothesisLog from './components/HypothesisLog';
import ConfirmedRejectedChart from './components/ConfirmedRejectedChart';
import ChatPanel from './components/ChatPanel';
import LandingPage from './components/LandingPage';

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true';

export default function App() {
  const liveSim = useSimulation();
  const mockSim = useMockSimulation();
  const sim = IS_MOCK ? mockSim : liveSim;

  const [view, setView] = useState(IS_MOCK ? 'landing' : 'dashboard');
  const [selectedStep, setSelectedStep] = useState(1);

  if (view === 'landing') {
    return <LandingPage onLaunch={() => setView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-200 flex flex-col">
      {/* Back to landing in mock mode */}
      {IS_MOCK && (
        <button
          onClick={() => setView('landing')}
          className="absolute top-2 right-4 z-50 text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
        >
          Back to overview
        </button>
      )}

      {/* Top header bar */}
      <HeaderBar
        sim={sim}
        selectedStep={selectedStep}
        onSelectStep={setSelectedStep}
        isMock={IS_MOCK}
      />

      {/* Status bar */}
      <StatusBar sim={sim} />

      {/* 3-column dashboard */}
      <div className="flex-1 grid grid-cols-[280px_1fr_320px] gap-3 p-3 min-h-0">
        {/* LEFT COLUMN — Users & Input */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
          <Panel title="POPULATION MIXER">
            <PopulationMixer sim={sim} isMock={IS_MOCK} />
          </Panel>
          <Panel title="ACTIVE FUNNEL FLOW">
            <FunnelView events={sim.events} />
          </Panel>
          <Panel title="POPULATION COMPOSITION OVER TIME">
            <PopulationTimeline events={sim.events} />
          </Panel>
        </div>

        {/* CENTER COLUMN — AI Optimization Loop */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
          <Panel title={`AI OPTIMIZATION LOOP — STEP ${selectedStep}: ${stepName(selectedStep)}`}>
            <AllocationView
              banditStates={sim.banditStates}
              selectedStep={selectedStep}
            />
          </Panel>
          <Panel title="AI REASONING" badge="Powered by Claude">
            <AIReasoning sim={sim} selectedStep={selectedStep} />
          </Panel>
          <Panel title="LINKED VARIANT PREVIEW">
            <VariantPreview selectedStep={selectedStep} />
          </Panel>
        </div>

        {/* RIGHT COLUMN — History & Results */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
          <Panel title="HYPOTHESIS LOG">
            <HypothesisLog sim={sim} />
          </Panel>
          <Panel title="CONFIRMED VS. REJECTED HYPOTHESES">
            <ConfirmedRejectedChart sim={sim} />
          </Panel>
          <div className="mt-auto">
            <Panel title="CHAT WITH CLAUDE AGENT">
              <ChatPanel isMock={IS_MOCK} />
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

function stepName(n) {
  return { 1: 'WELCOME', 2: 'USE CASE', 3: 'FIRST TASK', 4: 'CONVERSION' }[n] || '';
}

function Panel({ title, badge, children }) {
  return (
    <div className="bg-[#0f1629] rounded-lg border border-[#1e2a4a] p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
          {title}
        </h2>
        {badge && (
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300 font-medium">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
