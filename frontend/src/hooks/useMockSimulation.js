import { useState, useRef, useCallback } from 'react';
import { loadRecording } from '../utils/mockApi';

export default function useMockSimulation() {
  const [status, setStatus] = useState('idle');
  const [userCount, setUserCount] = useState(0);
  const [events, setEvents] = useState([]);
  const [banditStates, setBanditStates] = useState([]);

  const timerRef = useRef(null);
  const indexRef = useRef(0);
  const eventsRef = useRef(null);
  const speedRef = useRef(5);

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
        setBanditStates(evt.states);
        setUserCount(evt.user_number);
      }

      i++;
    }

    indexRef.current = i;

    // Schedule next batch
    const delay = 1000 / speedRef.current;
    timerRef.current = setTimeout(playNext, delay);
  }, []);

  const start = useCallback(async () => {
    // Reset state
    setEvents([]);
    setBanditStates([]);
    setUserCount(0);
    indexRef.current = 0;
    setStatus('starting');

    const recording = await loadRecording();
    eventsRef.current = recording;

    setStatus('running');
    playNext();
  }, [playNext]);

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

  const setPopulationMix = useCallback(() => {
    // No-op in mock mode
  }, []);

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
  };
}
