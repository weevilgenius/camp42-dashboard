import { beforeEach, describe, expect, it, vi } from 'vitest';

const firebaseMocks = vi.hoisted(() => {
  const functions = {};
  const getPresence = vi.fn();

  return {
    functions,
    getPresence,
    httpsCallable: vi.fn(() => getPresence),
  };
});

vi.mock('firebase/functions', () => ({ httpsCallable: firebaseMocks.httpsCallable }));
vi.mock('../src/firebase.js', () => ({ functions: firebaseMocks.functions }));

const { fetchPresence } = await import('../src/services/presence.js');

describe('fetchPresence', () => {
  beforeEach(() => {
    firebaseMocks.getPresence.mockReset();
  });

  it('calls getPresence and returns its data', async () => {
    const presence = { Alice: 0, Bob: 120 };
    firebaseMocks.getPresence.mockResolvedValue({ data: presence });

    await expect(fetchPresence()).resolves.toEqual(presence);

    expect(firebaseMocks.httpsCallable).toHaveBeenCalledWith(firebaseMocks.functions, 'getPresence');
    expect(firebaseMocks.getPresence).toHaveBeenCalledWith();
  });
});
