/**
 * Generates the MikroTik RouterOS presence detection script (presence-detection.production.script)
 * from the single source of truth device configuration (src/devices.config.ts).
 *
 * Workflow:
 * 1. Ensures src/devices.config.ts exists (copies src/devices.example.ts if missing).
 * 2. Reads device MAC addresses and names from src/devices.config.ts.
 * 3. Injects tracked MAC statements into doc/presence-detection.script template.
 * 4. Outputs gitignored doc/presence-detection.production.script for router deployment.
 */

import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '../src');
const docDir = join(__dirname, '../doc');

const configPath = join(srcDir, 'devices.config.ts');
const examplePath = join(srcDir, 'devices.example.ts');

// Ensure local config exists on fresh checkout
if (!existsSync(configPath)) {
  console.log('devices.config.ts not found. Creating from devices.example.ts...');
  copyFileSync(examplePath, configPath);
}

// Load device configuration
const { DEVICES } = await import('../src/devices.config.ts');

// Format RouterOS array assignment statements for each tracked MAC
const macLines = DEVICES.map((d) => {
  const commentStr = d.device ? ` # ${d.name} (${d.device})` : ` # ${d.name}`;
  return `:set trackedMacs ($trackedMacs, "${d.mac.trim().toUpperCase()}");${commentStr}`;
}).join('\n');

const templatePath = join(docDir, 'presence-detection.script.template');
const outputPath = join(docDir, 'presence-detection.script');

// Read template script and replace tracked MACs block
const templateContent = readFileSync(templatePath, 'utf8');
const regex = /# Define the specific MAC addresses to track[\s\S]*?(?=:local activeTracked)/;
const replacement = `# Define the specific MAC addresses to track (generated from devices.config.ts)\n:local trackedMacs [:toarray ""]\n${macLines}\n\n`;

const updatedContent = templateContent.replace(regex, replacement);

// Write out production router script
writeFileSync(outputPath, updatedContent, 'utf8');
//console.log(`Generated ${outputPath}`);
