import { describe, it, expect, afterEach } from 'vitest';
import { BatteryType } from '@camp42/shared';
import type { BatteryState } from '@camp42/shared';
import { BatteryCard } from '../src/components/BatteryCard.js';
import { renderComponent } from './helpers/MithrilTestHarness.js';
import type { MountedComponent } from './helpers/MithrilTestHarness.js';

describe('BatteryCard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let view: MountedComponent<any>;

  afterEach(() => {
    view?.unmount();
  });

  const onlineBattery: BatteryState = {
    type: BatteryType.Delta_2_Max,
    name: 'Hank',
    sn: 'SN001',
    online: true,
    state: {
      charge_pct: 78,
      dc_on: true,
      dc_watts: 12,
      ac_on: true,
      ac_watts: 45,
      total_input: 210,
      total_output: 57,
    },
  };

  const offlineBattery: BatteryState = {
    ...onlineBattery,
    name: 'Bertha',
    online: false,
    state: {
      charge_pct: -1,
      dc_on: false,
      dc_watts: -1,
      ac_on: false,
      ac_watts: -1,
      total_input: -1,
      total_output: -1,
    },
  };

  it('renders the battery name', () => {
    view = renderComponent(BatteryCard, { attrs: { battery: onlineBattery } });

    const name = view.root.querySelector('.name');
    expect(name?.textContent).toBe('Hank');
  });

  it('renders the battery type', () => {
    view = renderComponent(BatteryCard, { attrs: { battery: onlineBattery } });

    const type = view.root.querySelector('.type');
    expect(type?.textContent).toBe('DELTA 2 Max');
  });

  it('shows "Online" badge when battery is online', () => {
    view = renderComponent(BatteryCard, { attrs: { battery: onlineBattery } });

    const badge = view.root.querySelector('wa-badge');
    expect(badge?.textContent).toContain('Online');
  });

  it('shows "Offline" badge when battery is offline', () => {
    view = renderComponent(BatteryCard, { attrs: { battery: offlineBattery } });

    const badge = view.root.querySelector('wa-badge');
    expect(badge?.textContent).toContain('Offline');
  });

  it('adds the .offline class when battery is offline', () => {
    view = renderComponent(BatteryCard, { attrs: { battery: offlineBattery } });

    const card = view.root.querySelector('.battery-card');
    expect(card?.classList.contains('offline')).toBe(true);
  });

  it('does not add the .offline class when battery is online', () => {
    view = renderComponent(BatteryCard, { attrs: { battery: onlineBattery } });

    const card = view.root.querySelector('.battery-card');
    expect(card?.classList.contains('offline')).toBe(false);
  });

  it('renders input and output wattage stats', () => {
    view = renderComponent(BatteryCard, { attrs: { battery: onlineBattery } });

    const stats = view.root.querySelectorAll('.stat');
    const texts = Array.from(stats).map((s) => s.textContent);
    expect(texts.some((t) => t?.includes('210 W'))).toBe(true);
    expect(texts.some((t) => t?.includes('57 W'))).toBe(true);
  });

  it('renders AC and DC panel wattage', () => {
    view = renderComponent(BatteryCard, { attrs: { battery: onlineBattery } });

    const panels = view.root.querySelectorAll('.panel');
    const texts = Array.from(panels).map((p) => p.textContent);
    expect(texts.some((t) => t?.includes('45 W'))).toBe(true);
    expect(texts.some((t) => t?.includes('12 W'))).toBe(true);
  });

  it('includes a BatteryGauge with the correct charge level', () => {
    view = renderComponent(BatteryCard, { attrs: { battery: onlineBattery } });

    // BatteryGauge renders a [role="meter"] with aria-valuenow
    const meter = view.root.querySelector('[role="meter"]');
    expect(meter?.getAttribute('aria-valuenow')).toBe('78');
  });
});
