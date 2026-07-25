import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderComponent } from './helpers/MithrilTestHarness.js';
import type { MountedComponent } from './helpers/MithrilTestHarness.js';

const fetchPresenceMock = vi.hoisted(() => vi.fn());

vi.mock('../src/services/presence.js', () => ({
  fetchPresence: fetchPresenceMock,
}));

const { PresenceDashboard } = await import('../src/components/PresenceDashboard.js');

describe('PresenceDashboard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let view: MountedComponent<any>;

  afterEach(() => {
    view?.unmount();
    fetchPresenceMock.mockReset();
  });

  it('loads and displays presence', async () => {
    fetchPresenceMock.mockResolvedValue({ Cathie: 0, Barry: 3 * 60 * 60 });

    view = renderComponent(PresenceDashboard);

    await vi.waitFor(() => {
      expect(view.root.querySelector('.present')?.textContent).toBe('Cathie');
      expect(view.root.textContent).toContain('Barry 3 hours ago');
    });
  });

  it('shows an error when presence cannot load', async () => {
    fetchPresenceMock.mockRejectedValue(new Error('boom'));

    view = renderComponent(PresenceDashboard);

    await vi.waitFor(() => {
      expect(view.root.querySelector('.error')?.textContent).toBe('boom');
    });
  });
});
