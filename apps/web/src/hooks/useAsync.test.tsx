import { renderHook, waitFor } from '@testing-library/react';
import { useAsync } from './useAsync';

describe('useAsync', () => {
  it('goes from loading to success', async () => {
    const load = () => Promise.resolve(42);
    const { result } = renderHook(() => useAsync(load));
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current).toEqual({ status: 'success', data: 42 }));
  });

  it('reports errors', async () => {
    const load = () => Promise.reject(new Error('boom'));
    const { result } = renderHook(() => useAsync(load));
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.status === 'error' && result.current.error.message).toBe('boom');
  });

  it('reloads and shows loading when the loader changes', async () => {
    const a = () => Promise.resolve('a');
    const b = () => Promise.resolve('b');
    const { result, rerender } = renderHook(({ load }) => useAsync(load), {
      initialProps: { load: a },
    });
    await waitFor(() => expect(result.current).toEqual({ status: 'success', data: 'a' }));
    rerender({ load: b });
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current).toEqual({ status: 'success', data: 'b' }));
  });
});
