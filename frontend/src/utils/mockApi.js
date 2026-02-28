let _recording = null;
let _loadingPromise = null;

export const SCENARIOS = {
  impatient: {
    label: 'Impatient Users',
    description: 'Fast-moving users who want urgency and simplicity',
    file: '/mock/impatient.json',
  },
  skeptical: {
    label: 'Skeptical & Anxious Users',
    description: 'Cautious users who need proof and reassurance',
    file: '/mock/skeptical.json',
  },
};

export async function loadRecording(scenario = 'impatient') {
  const file = SCENARIOS[scenario]?.file || SCENARIOS.impatient.file;

  // Reset if switching scenarios
  _recording = null;
  _loadingPromise = null;

  _loadingPromise = fetch(file)
    .then((res) => res.json())
    .then((data) => {
      _recording = data;
      _loadingPromise = null;
      return data;
    });

  return _loadingPromise;
}

export function getRecording() {
  return _recording;
}

export function mockFetch(path) {
  if (!_recording) return null;

  if (path.startsWith('/data/variants')) {
    return Promise.resolve(_recording.variants);
  }
  if (path.startsWith('/data/personas')) {
    return Promise.resolve(_recording.personas);
  }

  return null;
}
