import { useState, useEffect, useCallback, useRef } from 'react';

const STEPS = [
  {
    target: 'controls',
    title: 'Controls',
    description:
      'Start/pause the simulation and adjust replay speed. In demo mode, click "Launch Demo" to begin.',
    position: 'below',
  },
  {
    target: 'population',
    title: 'User Population',
    description:
      'These are the 5 persona types entering the funnel. The mix determines who the bandit is optimizing for.',
    position: 'right',
  },
  {
    target: 'allocation',
    title: 'Traffic Allocation',
    description:
      'The multi-armed bandit routes traffic to variants. Watch the bars shift as it learns which copy converts best.',
    position: 'below',
  },
  {
    target: 'reasoning',
    title: 'AI Reasoning',
    description:
      'Claude analyzes conversion patterns, forms hypotheses, and generates new variants to test.',
    position: 'below',
  },
  {
    target: 'funnel',
    title: 'Funnel Flow',
    description:
      'Each dot is a user moving through the 4-step onboarding funnel. Green = converted, red = dropped off.',
    position: 'right',
  },
  {
    target: 'hypothesis',
    title: 'Hypothesis Log',
    description:
      'A running log of what the AI analyst has observed and recommended.',
    position: 'left',
  },
  {
    target: 'results',
    title: 'Results',
    description:
      'Tracks which AI-generated hypotheses were confirmed or rejected by real conversion data.',
    position: 'left',
  },
];

export default function GuidedTour({ onFinish }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [rect, setRect] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const overlayRef = useRef(null);

  const step = STEPS[currentStep];

  const measure = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (el) {
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    }
  }, [step]);

  // Measure on step change and on resize
  useEffect(() => {
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const goTo = (nextIndex) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentStep(nextIndex);
      setTransitioning(false);
    }, 150);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      goTo(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) goTo(currentStep - 1);
  };

  if (!rect) return null;

  // Calculate tooltip position
  const pad = 12;
  const tooltipWidth = 300;
  let tooltipStyle = {};

  if (step.position === 'below') {
    tooltipStyle = {
      top: rect.top + rect.height + pad,
      left: rect.left + rect.width / 2 - tooltipWidth / 2,
      width: tooltipWidth,
    };
  } else if (step.position === 'right') {
    tooltipStyle = {
      top: rect.top,
      left: rect.left + rect.width + pad,
      width: tooltipWidth,
    };
  } else if (step.position === 'left') {
    tooltipStyle = {
      top: rect.top,
      left: rect.left - tooltipWidth - pad,
      width: tooltipWidth,
    };
  }

  // Clamp tooltip within viewport
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (tooltipStyle.left < 8) tooltipStyle.left = 8;
  if (tooltipStyle.left + tooltipWidth > vw - 8)
    tooltipStyle.left = vw - tooltipWidth - 8;
  if (tooltipStyle.top + 200 > vh) tooltipStyle.top = vh - 220;

  const isLast = currentStep === STEPS.length - 1;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100]">
      {/* Dark overlay with cutout via clip-path */}
      <div
        className="absolute inset-0 transition-all duration-300 ease-in-out"
        style={{
          background: 'rgba(0, 0, 0, 0.65)',
          clipPath: `polygon(
            0% 0%, 0% 100%, ${rect.left}px 100%, ${rect.left}px ${rect.top}px,
            ${rect.left + rect.width}px ${rect.top}px, ${rect.left + rect.width}px ${rect.top + rect.height}px,
            ${rect.left}px ${rect.top + rect.height}px, ${rect.left}px 100%,
            100% 100%, 100% 0%
          )`,
        }}
      />

      {/* Border highlight around target */}
      <div
        className="absolute rounded-lg border-2 border-purple-400/60 pointer-events-none transition-all duration-300 ease-in-out"
        style={{
          top: rect.top - 3,
          left: rect.left - 3,
          width: rect.width + 6,
          height: rect.height + 6,
        }}
      />

      {/* Tooltip card */}
      <div
        className="absolute transition-all duration-300 ease-in-out"
        style={{
          ...tooltipStyle,
          opacity: transitioning ? 0 : 1,
        }}
      >
        <div className="bg-[#0f1629] border border-[#1e2a4a] rounded-lg shadow-2xl shadow-black/50 overflow-hidden">
          {/* Purple accent bar */}
          <div className="h-1 bg-gradient-to-r from-purple-500 to-blue-500" />

          <div className="p-4">
            {/* Step counter */}
            <div className="text-[10px] text-slate-500 tracking-widest uppercase mb-1">
              {currentStep + 1} of {STEPS.length}
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-white mb-2">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {step.description}
            </p>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={onFinish}
                className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
              >
                Skip Guide
              </button>

              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="px-3 py-1 text-[11px] rounded bg-[#1a2340] text-slate-400 hover:bg-[#1e2a4a] hover:text-slate-200 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="px-3 py-1 text-[11px] rounded bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
                >
                  {isLast ? 'Start Watching' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click-through blocker — prevent interaction with dashboard */}
      <div
        className="absolute inset-0"
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  );
}
