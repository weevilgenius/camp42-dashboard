import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderComponent } from './helpers/MithrilTestHarness.js';
import type { MountedComponent } from './helpers/MithrilTestHarness.js';

const fetchPresenceMock = vi.hoisted(() => vi.fn());

vi.mock('../src/services/presence.js', () => ({
  fetchPresence: fetchPresenceMock,
}));

vi.mock('@awesome.me/webawesome/dist/components/button/button.js', () => ({}));
vi.mock('@awesome.me/webawesome/dist/components/icon/icon.js', () => ({}));

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
      expect(view.root.querySelector('.error p')?.textContent).toBe('boom');
    });
  });

  it('refreshes presence when refresh button is clicked', async () => {
    fetchPresenceMock.mockResolvedValue({ Cathie: 0 });

    view = renderComponent(PresenceDashboard);

    await vi.waitFor(() => {
      expect(view.root.querySelector('.present')?.textContent).toBe('Cathie');
    });

    fetchPresenceMock.mockResolvedValue({ Barry: 0 });
    const refreshButton = view.root.querySelector('.header wa-button');
    refreshButton?.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(view.root.querySelector('.present')?.textContent).toBe('Barry');
    });
  });

  it('retries loading presence when retry button is clicked', async () => {
    fetchPresenceMock.mockRejectedValueOnce(new Error('boom'));

    view = renderComponent(PresenceDashboard);

    await vi.waitFor(() => {
      expect(view.root.querySelector('.error p')?.textContent).toBe('boom');
    });

    fetchPresenceMock.mockResolvedValue({ Cathie: 0 });
    const retryButton = view.root.querySelector('.error wa-button');
    retryButton?.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(view.root.querySelector('.present')?.textContent).toBe('Cathie');
    });
  });
});
