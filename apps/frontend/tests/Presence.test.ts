import { afterEach, describe, expect, it } from 'vitest';
import { Presence } from '../src/components/Presence.js';
import type { PresenceAttrs } from '../src/components/Presence.js';
import { renderComponent } from './helpers/MithrilTestHarness.js';
import type { MountedComponent } from './helpers/MithrilTestHarness.js';

describe('Presence', () => {
  let view: MountedComponent<PresenceAttrs>;

  afterEach(() => {
    view?.unmount();
  });

  it('shows people at camp and recently seen people in recency order', () => {
    view = renderComponent(Presence, {
      attrs: {
        presence: {
          Barry: 3 * 60 * 60,
          Cathie: 0,
          Drew: 20 * 60,
          Alex: 30,
        },
      },
    });

    expect(view.root.querySelector('h2')?.textContent).toBe('At Camp');
    expect(view.root.querySelector('.present')?.textContent).toBe('Cathie, Alex');
    expect(view.root.querySelector('h3')?.textContent).toBe('Seen Recently');
    expect(Array.from(view.root.querySelectorAll('.recent li')).map((row) => row.textContent)).toEqual([
      'Drew 20 minutes ago',
      'Barry 3 hours ago',
    ]);
  });

  it('uses the specified thresholds and omits stale people', () => {
    view = renderComponent(Presence, {
      attrs: {
        presence: {
          Here: 14 * 60 + 59,
          Minutes: 15 * 60,
          Hour: 60 * 60,
          Stale: 24 * 60 * 60,
        },
      },
    });

    expect(view.root.textContent).toContain('Here');
    expect(view.root.textContent).toContain('Minutes 15 minutes ago');
    expect(view.root.textContent).toContain('Hour 1 hour ago');
    expect(view.root.textContent).not.toContain('Stale');
  });

  it('shows Nobody and the Seen Recently header when only recent people exist', () => {
    view = renderComponent(Presence, {
      attrs: {
        presence: {
          Angela: 16 * 60,
          Ed: 3 * 60 * 60,
        },
      },
    });

    expect(view.root.querySelector('.empty')?.textContent).toBe('Nobody');
    expect(view.root.querySelector('h3')?.textContent).toBe('Seen Recently');
    expect(Array.from(view.root.querySelectorAll('.recent li')).map((row) => row.textContent)).toEqual([
      'Angela 16 minutes ago',
      'Ed 3 hours ago',
    ]);
  });

  it('shows the empty state when nobody is recent', () => {
    view = renderComponent(Presence);

    expect(view.root.querySelector('.empty')?.textContent).toBe('Nobody');
    expect(view.root.querySelector('h3')).toBeNull();
    expect(view.root.querySelector('.recent')).toBeNull();
  });
});
