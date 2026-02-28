import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withCache } from '../src/utils.js';

describe('withCache', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns fresh data on the first call', async () => {
    const fetchFn = vi.fn().mockResolvedValue('fresh');
    const cached = withCache(fetchFn, 1000);

    const result = await cached();

    expect(result).toBe('fresh');
    expect(fetchFn).toHaveBeenCalledOnce();
  });

  it('returns cached data within the TTL window', async () => {
    const fetchFn = vi.fn().mockResolvedValue('data');
    const cached = withCache(fetchFn, 5000);

    await cached();
    const result = await cached();

    expect(result).toBe('data');
    // only called once because the second call hit the cache
    expect(fetchFn).toHaveBeenCalledOnce();
  });

  it('fetches fresh data after the TTL expires', async () => {
    vi.useFakeTimers();

    const fetchFn = vi.fn()
      .mockResolvedValueOnce('old')
      .mockResolvedValueOnce('new');

    const cached = withCache(fetchFn, 1000);

    expect(await cached()).toBe('old');

    // advance past the 1 s TTL
    vi.advanceTimersByTime(1001);

    expect(await cached()).toBe('new');
    expect(fetchFn).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it('passes arguments through to the underlying fetch function', async () => {
    const fetchFn = vi.fn().mockResolvedValue(42);
    const cached = withCache(fetchFn, 5000);

    await cached('a', 'b', 'c');

    expect(fetchFn).toHaveBeenCalledWith('a', 'b', 'c');
  });

  it('uses the default TTL of 1 minute when none is specified', async () => {
    vi.useFakeTimers();

    const fetchFn = vi.fn()
      .mockResolvedValueOnce('first')
      .mockResolvedValueOnce('second');

    // no TTL argument -- should default to 60 000 ms
    const cached = withCache(fetchFn);

    expect(await cached()).toBe('first');

    // 59 seconds -- still within the default TTL
    vi.advanceTimersByTime(59_000);
    expect(await cached()).toBe('first');
    expect(fetchFn).toHaveBeenCalledOnce();

    // 2 more seconds -- now past the 60 s TTL
    vi.advanceTimersByTime(2_000);
    expect(await cached()).toBe('second');
    expect(fetchFn).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it('propagates errors from the fetch function', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('network failure'));
    const cached = withCache(fetchFn, 5000);

    await expect(cached()).rejects.toThrow('network failure');
  });

  it('does not cache a failed fetch', async () => {
    const fetchFn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('recovered');

    const cached = withCache(fetchFn, 5000);

    await expect(cached()).rejects.toThrow('fail');
    // the failed result should not be cached, so a retry should call fetchFn again
    expect(await cached()).toBe('recovered');
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });
});
