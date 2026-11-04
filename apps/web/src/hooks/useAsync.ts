import { useEffect, useState } from 'react';

export type AsyncState<T> =
  { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: Error };

type Settled<T> =
  | { source: () => Promise<T>; status: 'success'; data: T }
  | { source: () => Promise<T>; status: 'error'; error: Error };

/**
 * Runs `load` and tracks its state. `load` must be referentially stable
 * (module-level function or `useCallback`); a new function triggers a new load.
 */
export function useAsync<T>(load: () => Promise<T>): AsyncState<T> {
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    let cancelled = false;
    load().then(
      (data) => {
        if (!cancelled) setSettled({ source: load, status: 'success', data });
      },
      (error: unknown) => {
        if (!cancelled) {
          const err = error instanceof Error ? error : new Error(String(error));
          setSettled({ source: load, status: 'error', error: err });
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [load]);

  if (!settled || settled.source !== load) return { status: 'loading' };
  return settled.status === 'success'
    ? { status: 'success', data: settled.data }
    : { status: 'error', error: settled.error };
}
