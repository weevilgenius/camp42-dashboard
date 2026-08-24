import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockOnce = vi.fn();
const mockRef = vi.fn(() => ({ once: mockOnce }));

vi.mock('firebase-admin/database', () => ({
  getDatabase: () => ({ ref: mockRef }),
}));

const { getPresence } = await import('../src/getPresence.js');

describe('getPresence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns presence timestamps as seconds ago for signed-in users', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-23T12:00:00Z'));
    mockOnce.mockResolvedValue({
      val: () => ({ Alice: Date.now() - 2_500, Bob: Date.now() + 1_000, ignored: 'invalid' }),
    });

    await expect(getPresence.run({ auth: { uid: 'user' } } as never))
      .resolves.toEqual({ Alice: 2, Bob: 0 });

    expect(mockRef).toHaveBeenCalledWith('presence');
    vi.useRealTimers();
  });

  it('requires a signed-in user', async () => {
    await expect(getPresence.run({ auth: undefined } as never))
      .rejects.toMatchObject({ code: 'unauthenticated' });
  });
});
