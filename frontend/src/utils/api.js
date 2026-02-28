import { mockFetch } from './mockApi';

const BASE = '/api';
const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true';

export async function fetchJSON(path, options = {}) {
  if (IS_MOCK) {
    const mockResult = mockFetch(path);
    if (mockResult) return mockResult;
  }

  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export function post(path, body) {
  return fetchJSON(path, { method: 'POST', body: JSON.stringify(body) });
}

export function patch(path, body) {
  return fetchJSON(path, { method: 'PATCH', body: JSON.stringify(body) });
}

export function connectSSE(runId, onMessage) {
  const url = `${BASE}/simulation/${runId}/stream`;
  const source = new EventSource(url);

  source.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      onMessage(data);
    } catch (err) {
      console.warn('[SSE] parse error:', err, e.data);
    }
  };

  source.onerror = (e) => {
    // EventSource fires onerror on reconnect attempts — only close if CLOSED
    console.warn('[SSE] error event, readyState:', source.readyState);
    if (source.readyState === EventSource.CLOSED) {
      source.close();
    }
  };

  return source;
}
