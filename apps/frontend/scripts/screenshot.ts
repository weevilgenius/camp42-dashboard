import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import process from 'node:process';
import { chromium, devices } from '@playwright/test';
import { createServer } from 'vite';

const { values } = parseArgs({
  args: process.argv.slice(2).filter((argument) => argument !== '--'),
  options: {
    path: { type: 'string', default: '/' },
    out: { type: 'string', default: 'screenshots/screenshot.png' },
    url: { type: 'string' },
    theme: { type: 'string', default: 'light' },
    device: { type: 'string' },
    width: { type: 'string', default: '1280' },
    height: { type: 'string', default: '800' },
    'full-page': { type: 'boolean', default: false },
    wait: { type: 'string' },
    delay: { type: 'string' },
    'login-email': { type: 'string' },
    'login-password': { type: 'string' },
  },
});

const defaultUrl = 'http://localhost:5173';
const browserDevice = values.device ? devices[values.device] : undefined;
if (values.device && !browserDevice) {
  throw new Error(`Unknown Playwright device: ${values.device}`);
}

const serverRunning = async (url: string) => {
  try {
    await fetch(url, { signal: AbortSignal.timeout(600) });
    return true;
  } catch {
    return false;
  }
};

const baseUrl = values.url ?? defaultUrl;
let server: Awaited<ReturnType<typeof createServer>> | undefined;
if (!values.url && !(await serverRunning(baseUrl))) {
  server = await createServer({ server: { port: 5173 } });
  await server.listen();
}

const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    colorScheme: values.theme === 'dark' ? 'dark' : 'light',
    ...browserDevice,
    ...(browserDevice ? {} : { viewport: { width: Number(values.width), height: Number(values.height) } }),
  });
  const page = await context.newPage();

  await page.goto(new URL(values.path, baseUrl).toString(), { waitUntil: 'networkidle' });

  if (values['login-email'] || values['login-password']) {
    if (!values['login-email'] || !values['login-password']) {
      throw new Error('Login requires both --login-email and --login-password.');
    }
    for (const [index, value] of [values['login-email'], values['login-password']].entries()) {
      await page.locator('wa-input').nth(index).locator('input').fill(value);
    }
    await page.locator('wa-button[type="submit"]').click();
    await page.locator('h1').waitFor({ state: 'visible' });
  }

  if (values.wait) await page.locator(values.wait).waitFor({ state: 'visible' });
  if (values.delay) await page.waitForTimeout(Number(values.delay));

  const output = resolve(values.out);
  await mkdir(dirname(output), { recursive: true });
  await page.screenshot({ path: output, fullPage: values['full-page'] });
  console.log(`Captured ${page.url()} -> ${output}`);
} finally {
  await browser.close();
  await server?.close();
}
