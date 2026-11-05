/**
 * Makes `prefers-reduced-motion` read as "no preference" for the current test, so animated
 * components render their motion layers. Pair with `vi.unstubAllGlobals()` in `afterEach`.
 */
export function allowMotion() {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}
