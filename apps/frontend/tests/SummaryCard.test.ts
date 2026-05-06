import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderComponent } from './helpers/MithrilTestHarness.js';
import type { MountedComponent } from './helpers/MithrilTestHarness.js';

const fetchAIStatusMock = vi.hoisted(() => vi.fn());

vi.mock('../src/services/campStatus.js', () => ({
  fetchAIStatus: fetchAIStatusMock,
}));

// Suppress WebAwesome custom element registration so happy-dom's missing
// ElementInternals API doesn't crash the test (matches App.test.ts pattern).
vi.mock('@awesome.me/webawesome/dist/components/button/button.js', () => ({}));
vi.mock('@awesome.me/webawesome/dist/components/icon/icon.js', () => ({}));
vi.mock('@awesome.me/webawesome/dist/components/skeleton/skeleton.js', () => ({}));

const { SummaryCard } = await import('../src/components/SummaryCard.js');

describe('SummaryCard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let view: MountedComponent<any>;

  afterEach(() => {
    view?.unmount();
    fetchAIStatusMock.mockReset();
  });

  it('shows skeleton placeholders while loading', () => {
    let resolve: ((value: { message: string }) => void) | undefined;
    fetchAIStatusMock.mockImplementation(
      () => new Promise((r) => { resolve = r; }),
    );

    view = renderComponent(SummaryCard);

    const skeletons = view.root.querySelectorAll('wa-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);

    // Cleanup the pending promise so it doesn't leak
    resolve?.({ message: '' });
  });

  it('renders the AI message on success', async () => {
    const haiku = 'Solar panels hum\nBatteries near full again\nPitch the tent today';
    fetchAIStatusMock.mockResolvedValue({ message: haiku });

    view = renderComponent(SummaryCard);
    await vi.waitFor(() => {
      const message = view.root.querySelector('.message');
      expect(message?.textContent).toBe(haiku);
    });
  });

  it('renders an error and Retry button when fetch fails', async () => {
    fetchAIStatusMock.mockRejectedValue(new Error('boom'));

    view = renderComponent(SummaryCard);
    await vi.waitFor(() => {
      const error = view.root.querySelector('.error');
      expect(error?.textContent).toContain('boom');
    });

    const buttons = view.root.querySelectorAll('wa-button');
    const labels = Array.from(buttons).map((b) => b.textContent ?? '');
    expect(labels.some((t) => t.includes('Retry'))).toBe(true);
  });
});
