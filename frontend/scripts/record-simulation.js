#!/usr/bin/env node
/**
 * Record a simulation run with a specific population mix.
 * Usage:
 *   node scripts/record-simulation.js --scenario impatient
 *   node scripts/record-simulation.js --scenario skeptical
 *   node scripts/record-simulation.js                        # records all scenarios
 */

const BASE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://localhost:8000';

const SCENARIOS = {
  impatient: {
    label: 'Impatient Users',
    description: '70% impatient, 15% casual, 15% goal-oriented — fast-moving users who want urgency and simplicity',
    mix: { impatient: 0.70, casual: 0.15, goal_oriented: 0.15, skeptical: 0.0, anxious: 0.0 },
  },
  skeptical: {
    label: 'Skeptical & Anxious Users',
    description: '50% skeptical, 35% anxious, 15% goal-oriented — cautious users who need proof and reassurance',
    mix: { skeptical: 0.50, anxious: 0.35, goal_oriented: 0.15, impatient: 0.0, casual: 0.0 },
  },
};

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

async function recordScenario(name, scenario) {
  console.log(`\n--- Recording: ${scenario.label} ---`);
  console.log(`Mix: ${JSON.stringify(scenario.mix)}`);

  const variants = await fetchJSON('/api/data/variants');
  const personas = await fetchJSON('/api/data/personas');

  console.log('Starting simulation (500 users)...');
  const { run_id } = await postJSON('/api/simulation/start', {
    total_users: 500,
    population_mix: scenario.mix,
  });

  console.log(`Run ID: ${run_id}`);

  await fetch(`${BASE}/api/simulation/${run_id}/speed`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ speed: 50 }),
  });

  const sseUrl = `${BASE}/api/simulation/${run_id}/stream`;
  const events = [];
  let userCount = 0;

  await new Promise((resolve, reject) => {
    fetch(sseUrl).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              events.push(data);

              if (data.type === 'user_event') {
                userCount = data.user_number;
                if (userCount % 100 === 0) console.log(`  ${userCount} users...`);
              }
              if (data.type === 'sim_ended') {
                resolve();
                return;
              }
            } catch (e) {}
          }
        }
      }
      resolve();
    }).catch(reject);
  });

  const recording = {
    recorded_at: new Date().toISOString(),
    scenario: name,
    label: scenario.label,
    description: scenario.description,
    population_mix: scenario.mix,
    total_users: userCount,
    variants,
    personas,
    events,
  };

  const fs = await import('fs');
  const path = await import('path');
  const outPath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    '..', 'public', 'mock', `${name}.json`
  );

  fs.writeFileSync(outPath, JSON.stringify(recording));
  const sizeKB = (Buffer.byteLength(JSON.stringify(recording)) / 1024).toFixed(1);
  console.log(`Saved: ${outPath} (${sizeKB} KB, ${events.length} events, ${userCount} users)`);
}

async function main() {
  console.log(`Recording from ${BASE}...`);

  const targetScenario = process.argv.includes('--scenario')
    ? process.argv[process.argv.indexOf('--scenario') + 1]
    : null;

  const toRecord = targetScenario
    ? { [targetScenario]: SCENARIOS[targetScenario] }
    : SCENARIOS;

  for (const [name, scenario] of Object.entries(toRecord)) {
    await recordScenario(name, scenario);
  }

  console.log('\nDone!');
}

main().catch((err) => {
  console.error('Recording failed:', err);
  process.exit(1);
});
