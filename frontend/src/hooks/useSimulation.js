import { useState, useRef, useCallback } from 'react';
import { post, patch, connectSSE } from '../utils/api';

export default function useSimulation() {
  const [runId, setRunId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | starting | running | paused | completed
  const [userCount, setUserCount] = useState(0);
  const [events, setEvents] = useState([]);
  const [banditStates, setBanditStates] = useState([]);
  const [variants] = useState([]);
  const sourceRef = useRef(null);

  const handleMessage = useCallback((data) => {
    switch (data.type) {
      case 'status':
        // e.g. "Generating conversion matrix via Claude..."
        setStatus('starting');
        break;
      case 'sim_started':
        setStatus('running');
        break;
      case 'user_event':
        setEvents((prev) => [...prev.slice(-499), data]);
        setUserCount(data.user_number);
        break;
      case 'bandit_snapshot':
        setBanditStates(data.states);
        setUserCount(data.user_number);
        break;
      case 'sim_ended':
        setStatus('completed');
        if (sourceRef.current) sourceRef.current.close();
        break;
    }
  }, []);

  const start = useCallback(async (config = {}) => {
    // Close any existing connection
    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }

    setEvents([]);
    setBanditStates([]);
    setUserCount(0);
    setStatus('starting');

    try {
      const { run_id } = await post('/simulation/start', {
        total_users: 500,
        population_mix: {
          impatient: 0.2,
          skeptical: 0.2,
          casual: 0.2,
          goal_oriented: 0.2,
          anxious: 0.2,
        },
        ...config,
      });

      setRunId(run_id);
      sourceRef.current = connectSSE(run_id, handleMessage);
    } catch (err) {
      console.error('[sim] start failed:', err);
      setStatus('idle');
    }
  }, [handleMessage]);

  const pause = useCallback(async () => {
    if (!runId) return;
    await post(`/simulation/${runId}/pause`);
    setStatus('paused');
  }, [runId]);

  const resume = useCallback(async () => {
    if (!runId) return;
    await post(`/simulation/${runId}/resume`);
    setStatus('running');
  }, [runId]);

  const stop = useCallback(async () => {
    if (!runId) return;
    await post(`/simulation/${runId}/stop`);
    setStatus('completed');
    if (sourceRef.current) sourceRef.current.close();
  }, [runId]);

  const setSpeed = useCallback(async (speed) => {
    if (!runId) return;
    await patch(`/simulation/${runId}/speed`, { speed });
  }, [runId]);

  const setPopulationMix = useCallback(async (mix) => {
    if (!runId) return;
    await patch(`/simulation/${runId}/population`, { population_mix: mix });
  }, [runId]);

  return {
    runId,
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
    variants,
  };
}
