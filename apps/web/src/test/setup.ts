import '@testing-library/jest-dom/vitest';

/**
 * Tests run as if the user asked for reduced motion, so the journal book changes pages instantly
 * and tests can press its buttons several times in a row. Animation tests opt in with
 * `allowMotion()` from `test/motion.ts`.
 */
window.matchMedia = ((query: string) => ({
  matches: query.includes('prefers-reduced-motion'),
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})) as typeof window.matchMedia;
