#!/usr/bin/env node
/**
 * Record a full simulation run from the backend into a single JSON file.
 * Usage: node scripts/record-simulation.js [--base http://localhost:8000]
 *
 * Requires the backend to be running. Captures:
 *  - /api/data/variants
 *  - /api/data/personas
 *  - Full SSE stream from a 500-user simulation run
 */

const BASE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://localhost:8000';

async function fetchJSON(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
  return res.json();
}

async function postJSON(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
  return res.json();
}

async function main() {
  console.log(`Recording simulation from ${BASE}...`);

  // 1. Fetch metadata
  console.log('Fetching variants...');
  const variants = await fetchJSON('/api/data/variants');

  console.log('Fetching personas...');
  const personas = await fetchJSON('/api/data/personas');

  // 2. Start simulation (max speed for fast recording)
  console.log('Starting simulation (500 users)...');
  const { run_id } = await postJSON('/api/simulation/start', {
    total_users: 500,
    population_mix: {
      impatient: 0.2,
      skeptical: 0.2,
      casual: 0.2,
      goal_oriented: 0.2,
      anxious: 0.2,
    },
  });

  console.log(`Run ID: ${run_id}`);

  // Set to max speed
  await fetch(`${BASE}/api/simulation/${run_id}/speed`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ speed: 50 }),
  });

  // 3. Capture the SSE stream
  const sseUrl = `${BASE}/api/simulation/${run_id}/stream`;
  console.log(`Connecting to SSE: ${sseUrl}`);

  const events = [];
  let userCount = 0;

  await new Promise((resolve, reject) => {
    // Use fetch to read the SSE stream as text
    fetch(sseUrl).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep incomplete line

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              events.push(data);

              if (data.type === 'user_event') {
                userCount = data.user_number;
                if (userCount % 50 === 0) {
                  console.log(`  Captured ${userCount} users...`);
                }
              }
              if (data.type === 'sim_ended') {
                console.log(`Simulation ended: ${data.total_users} users`);
                resolve();
                return;
              }
            } catch (e) {
              // skip parse errors on non-JSON lines
            }
          }
        }
      }
      resolve();
    }).catch(reject);
  });

  // 4. Write recording
  const recording = {
    recorded_at: new Date().toISOString(),
    total_users: userCount,
    variants,
    personas,
    events,
  };

  const fs = await import('fs');
  const path = await import('path');
  const outPath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    '..',
    'public',
    'mock',
    'simulation-recording.json'
  );

  fs.writeFileSync(outPath, JSON.stringify(recording));

  const sizeKB = (Buffer.byteLength(JSON.stringify(recording)) / 1024).toFixed(1);
  console.log(`\nRecording saved to: ${outPath}`);
  console.log(`Size: ${sizeKB} KB`);
  console.log(`Events: ${events.length}`);
  console.log(`Users: ${userCount}`);
}

main().catch((err) => {
  console.error('Recording failed:', err);
  process.exit(1);
});
