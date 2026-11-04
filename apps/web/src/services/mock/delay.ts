/** Resolves with `value` after `ms` to exercise loading states. A copy is returned so callers can't mutate mock data. */
export async function respond<T>(value: T, ms: number): Promise<T> {
  if (ms > 0) await new Promise((resolve) => setTimeout(resolve, ms));
  return structuredClone(value);
}
