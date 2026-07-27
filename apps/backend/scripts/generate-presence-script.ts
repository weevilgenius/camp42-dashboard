/**
 * Generates the MikroTik RouterOS presence detection script
 * (`doc/presence-detection.script`) from RTDB `/presence-devices` on a
 * locally running Firebase database emulator.
 *
 * Prerequisites: database emulator on port 9000 with presence-devices data
 * (e.g. `pnpm run serve` in apps/backend, which imports emulator_data).
 *
 * Usage: pnpm run generate:presence-script
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { flattenPresenceDevices } from '../src/presenceDevices.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docDir = join(__dirname, '../doc');

/** Default emulator REST URL for /presence-devices (see firebase.json + export name). */
const DEFAULT_URL =
  'http://127.0.0.1:9000/presence-devices.json?ns=camp42-dashboard-default-rtdb';

const url = process.env.PRESENCE_DEVICES_URL ?? DEFAULT_URL;

let raw: unknown;
try {
  const response = await fetch(url);
  if (!response.ok) {
    console.error(
      `Failed to fetch presence-devices from emulator (${response.status} ${response.statusText}).\n`
      + `URL: ${url}\n`
      + 'Start the database emulator first (e.g. `pnpm run serve` in apps/backend).'
    );
    process.exit(1);
  }
  raw = await response.json();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    `Could not reach the database emulator at ${url}\n`
    + `${message}\n`
    + 'Start the database emulator first (e.g. `pnpm run serve` in apps/backend).'
  );
  process.exit(1);
}

const devices = flattenPresenceDevices(raw);
if (devices.length === 0) {
  console.error(
    'No devices found at /presence-devices on the emulator.\n'
    + 'Seed presence-devices (person → MAC → label) before generating the script.'
  );
  process.exit(1);
}

const macLines = devices.map((d) => {
  const commentStr = d.device ? ` # ${d.name} (${d.device})` : ` # ${d.name}`;
  return `:set trackedMacs ($trackedMacs, "${d.mac}");${commentStr}`;
}).join('\n');

const templatePath = join(docDir, 'presence-detection.script.template');
const outputPath = join(docDir, 'presence-detection.script');

const templateContent = readFileSync(templatePath, 'utf8');
const regex = /# Define the specific MAC addresses to track[\s\S]*?(?=:local activeTracked)/;
const replacement =
  `# Define the specific MAC addresses to track (generated from RTDB /presence-devices)\n`
  + `:local trackedMacs [:toarray ""]\n`
  + `${macLines}\n\n`;

if (!regex.test(templateContent)) {
  console.error(`Could not find tracked-MAC block in ${templatePath}`);
  process.exit(1);
}

const updatedContent = templateContent.replace(regex, replacement);
writeFileSync(outputPath, updatedContent, 'utf8');
console.log(`Wrote ${outputPath} (${devices.length} device(s))`);
