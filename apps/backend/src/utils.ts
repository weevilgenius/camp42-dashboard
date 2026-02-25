
/**
 * Wraps an async function with an in-memory cache.
 * @param fetchFn The function that fetches the data.
 * @param ttl Time to live in milliseconds.
 */
export function withCache<T, Args extends unknown[]>(
  fetchFn: (...args: Args) => Promise<T>,
  ttl: number = 1 * 60 * 1000 // 1 minute default
) {
  let cache: { data: T; expiresAt: number } | null = null;

  return async (...args: Args): Promise<T> => {
    const now = Date.now();

    // return cached data if it exists and hasn't expired
    if (cache && now < cache.expiresAt) {
      return cache.data;
    }

    // otherwise, fetch fresh data and update the cache
    const data = await fetchFn(...args);
    cache = { data, expiresAt: now + ttl };

    return data;
  };
}
