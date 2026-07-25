/**
 * Vitest setup file for the frontend test suite.
 *
 * Suppresses known noisy warnings from Web Awesome and Lit that are harmless in
 * a happy-dom test environment:
 *
 * 1. "Element internals are not supported" -- happy-dom does not implement the
 *    ElementInternals API.  Web Awesome's base class catches the missing API
 *    and logs this error, but all subsequent code guards with optional chaining
 *    so components render correctly without it.
 *
 * 2. "Lit is in dev mode" -- Lit's development build emits a one-time warning
 *    recommending the production build.  Irrelevant in tests.
 *
 * 3. "scheduled an update...after an update completed" -- Lit lifecycle warning
 *    triggered by wa-card during initial render in happy-dom.  The component
 *    still renders correctly; the warning is about sub-optimal scheduling that
 *    only matters in production.
 */

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

/** Patterns that are safe to swallow in tests. */
const SUPPRESSED = [
  /Element internals are not supported/,
  /Lit is in dev mode/,
  /scheduled an update .* after an update completed/,
];

const isSuppressed = (args: unknown[]): boolean =>
  args.some((arg) => typeof arg === 'string' && SUPPRESSED.some((re) => re.test(arg)));

console.error = (...args: unknown[]) => {
  if (!isSuppressed(args)) originalConsoleError(...args);
};

console.warn = (...args: unknown[]) => {
  if (!isSuppressed(args)) originalConsoleWarn(...args);
};


