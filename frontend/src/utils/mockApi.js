let _recording = null;
let _loadingPromise = null;

export async function loadRecording() {
  if (_recording) return _recording;
  if (_loadingPromise) return _loadingPromise;

  _loadingPromise = fetch('/mock/simulation-recording.json')
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
