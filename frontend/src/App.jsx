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
import GuidedTour from './components/GuidedTour';

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true';

export default function App() {
  const liveSim = useSimulation();
  const mockSim = useMockSimulation();
  const sim = IS_MOCK ? mockSim : liveSim;

  const [view, setView] = useState(IS_MOCK ? 'landing' : 'dashboard');
  const [selectedStep, setSelectedStep] = useState(1);
  const [showTour, setShowTour] = useState(false);

  const handleLaunch = (scenario) => {
    if (IS_MOCK) sim.start(scenario);
    setView('dashboard');
    if (IS_MOCK) setShowTour(true);
  };

  const handleTourFinish = () => {
    setShowTour(false);
  };

  if (view === 'landing') {
    return <LandingPage onLaunch={handleLaunch} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Back to landing in mock mode */}
      {IS_MOCK && (
        <button
          onClick={() => setView('landing')}
          className="absolute top-2 right-4 z-50 text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
        >
          Back to overview
        </button>
      )}

      {/* Demo disclaimer banner */}
      {IS_MOCK && (
        <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-gray-50 border-b border-gray-200 text-[11px] text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          Pre-recorded demo — replaying 500 {sim.scenario === 'skeptical' ? 'skeptical & anxious' : 'impatient'} users through the live dashboard UI.
        </div>
      )}

      {/* Top header bar */}
      <div data-tour="controls">
        <HeaderBar
          sim={sim}
          isMock={IS_MOCK}
        />
      </div>

      {/* Status bar */}
      <StatusBar sim={sim} />

      {/* 3-column dashboard */}
      <div className="flex-1 grid grid-cols-[280px_1fr_320px] gap-3 p-3 min-h-0">
        {/* LEFT COLUMN — Users & Input */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
          <Panel title="POPULATION MIXER" tourId="population" badge={IS_MOCK ? "Pre-recorded" : undefined}>
            <PopulationMixer sim={sim} isMock={IS_MOCK} />
          </Panel>
          <Panel title="ACTIVE FUNNEL FLOW" tourId="funnel">
            <FunnelView events={sim.events} />
          </Panel>
          <Panel title="POPULATION COMPOSITION OVER TIME">
            <PopulationTimeline events={sim.events} />
          </Panel>
        </div>

        {/* CENTER COLUMN — AI Optimization Loop */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
          {/* Funnel step tabs */}
          <div className="flex items-stretch border border-gray-200 rounded-lg overflow-hidden" data-tour="allocation">
            {[
              { n: 1, label: 'Welcome' },
              { n: 2, label: 'Use Case' },
              { n: 3, label: 'First Task' },
              { n: 4, label: 'Conversion' },
            ].map(({ n, label }, i) => (
              <button
                key={n}
                onClick={() => setSelectedStep(n)}
                className={`flex-1 py-2 text-xs font-semibold tracking-wide transition-colors ${
                  selectedStep === n
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                } ${i > 0 ? 'border-l border-gray-200' : ''}`}
              >
                <span className="text-[10px] font-normal text-gray-400 mr-1">Step {n}</span>
                {label}
              </button>
            ))}
          </div>

          <Panel title="AI OPTIMIZATION LOOP">
            <AllocationView
              banditStates={sim.banditStates}
              selectedStep={selectedStep}
              variants={sim.variants}
            />
          </Panel>
          <Panel title="AI REASONING" badge="Powered by Claude" tourId="reasoning">
            <AIReasoning sim={sim} selectedStep={selectedStep} />
          </Panel>
          <Panel title="COPY VARIANTS">
            <VariantPreview selectedStep={selectedStep} variants={sim.variants} />
          </Panel>
        </div>

        {/* RIGHT COLUMN — History & Results */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
          <Panel title="HYPOTHESIS LOG" tourId="hypothesis">
            <HypothesisLog sim={sim} />
          </Panel>
          <Panel title="CONFIRMED VS. REJECTED HYPOTHESES" tourId="results">
            <ConfirmedRejectedChart sim={sim} />
          </Panel>
          <div className="mt-auto">
            <Panel title="CHAT WITH CLAUDE AGENT">
              <ChatPanel isMock={IS_MOCK} />
            </Panel>
          </div>
        </div>
      </div>

      {showTour && <GuidedTour onFinish={handleTourFinish} />}
    </div>
  );
}

function Panel({ title, badge, tourId, children }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3" {...(tourId ? { 'data-tour': tourId } : {})}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
          {title}
        </h2>
        {badge && (
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
