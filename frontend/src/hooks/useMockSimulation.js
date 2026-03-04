import { useState, useRef, useCallback } from 'react';
import { loadRecording } from '../utils/mockApi';

// AI-generated Variant C for each step — blends best of A and B
const GENERATED_VARIANTS = [
  { id: 101, step_id: 1, generation: 1, content: { headline: 'Join 10,000 teams — get started in 30 seconds', subtext: 'No setup, no commitment. See why fast-moving teams love us.', cta: 'Try it free' }, features: { urgency: 0.7, detail: 0.3, social_proof: 0.7, simplicity: 0.8, reassurance: 0.5 }, is_active: true },
  { id: 102, step_id: 2, generation: 1, content: { headline: "Tell us your goal — we'll handle the rest", subtext: 'Personalized setup based on what 10,000+ teams found most useful.', cta: 'Personalize now' }, features: { urgency: 0.5, detail: 0.5, social_proof: 0.6, simplicity: 0.7, reassurance: 0.5 }, is_active: true },
  { id: 103, step_id: 3, generation: 1, content: { headline: 'Your first win in 10 seconds — teams love this part', subtext: 'One click to create your first item. 94% of users finish this step.', cta: "Let's go" }, features: { urgency: 0.6, detail: 0.3, social_proof: 0.6, simplicity: 0.8, reassurance: 0.6 }, is_active: true },
  { id: 104, step_id: 4, generation: 1, content: { headline: 'Go Pro — risk-free for 30 days', subtext: "50% off this week. 30-day money-back guarantee. Teams who upgrade convert 3x faster.", cta: 'Start free trial' }, features: { urgency: 0.7, detail: 0.3, social_proof: 0.7, simplicity: 0.6, reassurance: 0.8 }, is_active: true },
];

const VARIANT_C_THRESHOLD = 150;

export default function useMockSimulation() {
  const [status, setStatus] = useState('idle');
  const [userCount, setUserCount] = useState(0);
  const [events, setEvents] = useState([]);
  const [banditStates, setBanditStates] = useState([]);
  const [scenario, setScenario] = useState('impatient');
  const [variants, setVariants] = useState([]);

  const timerRef = useRef(null);
  const indexRef = useRef(0);
  const eventsRef = useRef(null);
  const speedRef = useRef(5);
  const variantCInjected = useRef(false);

  const playNext = useCallback(() => {
    const recording = eventsRef.current;
    if (!recording) return;

    const allEvents = recording.events;
    let i = indexRef.current;

    if (i >= allEvents.length) {
      setStatus('completed');
      return;
    }

    // Process all events for the current user_number batch
    const currentUser = allEvents[i]?.user_number;
    while (i < allEvents.length) {
      const evt = allEvents[i];

      if (evt.type === 'sim_ended') {
        setStatus('completed');
        indexRef.current = allEvents.length;
        return;
      }

      if (evt.type === 'status' || evt.type === 'matrix_ready' || evt.type === 'sim_started') {
        i++;
        continue;
      }

      // If we've moved to a new user, stop this batch
      if (evt.user_number !== currentUser && evt.type === 'user_event') {
        break;
      }

      if (evt.type === 'user_event') {
        setEvents((prev) => [...prev.slice(-499), evt]);
        setUserCount(evt.user_number);
      }

      if (evt.type === 'bandit_snapshot') {
        // Inject Variant C into variants list at threshold
        if (evt.user_number >= VARIANT_C_THRESHOLD && !variantCInjected.current) {
          variantCInjected.current = true;
          setVariants((prev) => [...prev, ...GENERATED_VARIANTS]);
        }

        // Add fake Variant C bandit states after injection
        if (variantCInjected.current) {
          const usersAfterC = evt.user_number - VARIANT_C_THRESHOLD;
          const cStates = GENERATED_VARIANTS.map((v) => {
            const exposures = Math.min(Math.round(usersAfterC * 0.3), usersAfterC);
            const rate = 0.28 + Math.min(usersAfterC / 2000, 0.12); // starts strong, improves
            const conversions = Math.round(exposures * rate);
            return { variant_id: v.id, exposures, conversions, rate, alpha: conversions + 1, beta: exposures - conversions + 1 };
          });
          setBanditStates([...evt.states, ...cStates]);
        } else {
          setBanditStates(evt.states);
        }
        setUserCount(evt.user_number);
      }

      i++;
    }

    indexRef.current = i;

    // Schedule next batch
    const delay = 1000 / speedRef.current;
    timerRef.current = setTimeout(playNext, delay);
  }, []);

  const start = useCallback(async (selectedScenario) => {
    // Reset state
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setEvents([]);
    setBanditStates([]);
    setUserCount(0);
    indexRef.current = 0;
    variantCInjected.current = false;
    setStatus('starting');

    const sc = selectedScenario || scenario;
    setScenario(sc);
    const recording = await loadRecording(sc);
    eventsRef.current = recording;
    setVariants(recording.variants || []);

    setStatus('running');
    playNext();
  }, [playNext, scenario]);

  const pause = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setStatus('paused');
  }, []);

  const resume = useCallback(() => {
    setStatus('running');
    playNext();
  }, [playNext]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setStatus('completed');
  }, []);

  const setSpeed = useCallback((speed) => {
    speedRef.current = speed;
  }, []);

  const setPopulationMix = useCallback(() => {}, []);

  return {
    runId: 'mock',
    status,
    userCount,
    events,
    banditStates,
    start,
    pause,
    resume,
    stop,
    setSpeed,
    setPopulationMix,
    scenario,
    variants,
  };
}
