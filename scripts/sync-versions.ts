/**
 * @file sync-versions.ts
 * Synchronizes version numbers across all workspace sub-packages (apps/frontend,
 * apps/backend, shared, mocks) to match the root package.json version.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const rootPkgPath = path.join(rootDir, 'package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8')) as { version?: string };
const targetVersion = rootPkg.version;

if (!targetVersion) {
  console.error('Error: No version specified in root package.json');
  process.exit(1);
}

console.log(`Syncing sub-projects to target version: ${targetVersion}`);

function findPackageJsonFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPackageJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name === 'package.json' && fullPath !== rootPkgPath) {
      results.push(fullPath);
    }
  }

  return results;
}

const packageJsonFiles = findPackageJsonFiles(rootDir);
let updatedCount = 0;

for (const pkgPath of packageJsonFiles) {
  const relativePath = path.relative(rootDir, pkgPath);
  const content = fs.readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(content) as { name?: string; version?: string };

  if (pkg.version !== targetVersion) {
    console.log(`  Updating ${pkg.name ?? relativePath}: ${pkg.version ?? 'none'} -> ${targetVersion}`);
    pkg.version = targetVersion;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    updatedCount++;
  } else {
    console.log(`  ${pkg.name ?? relativePath}: already at ${targetVersion}`);
  }
}

console.log(`Synchronization complete. Updated ${updatedCount} package(s).`);
