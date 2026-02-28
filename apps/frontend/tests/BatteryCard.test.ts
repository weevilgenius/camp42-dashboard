import { describe, it, expect, afterEach } from 'vitest';
import m from 'mithril';
import { BatteryType } from '@camp42/shared';
import type { BatteryState } from '@camp42/shared';
import { BatteryCard } from '../src/components/BatteryCard.js';

describe('BatteryCard', () => {
  const root = document.createElement('div');
  document.body.appendChild(root);

  afterEach(() => {
    m.mount(root, null);
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
    m.mount(root, { view: () => m(BatteryCard, { battery: onlineBattery }) });
    m.redraw.sync();

    const name = root.querySelector('.name');
    expect(name?.textContent).toBe('Hank');
  });

  it('renders the battery type', () => {
    m.mount(root, { view: () => m(BatteryCard, { battery: onlineBattery }) });
    m.redraw.sync();

    const type = root.querySelector('.type');
    expect(type?.textContent).toBe('DELTA 2 Max');
  });

  it('shows "Online" badge when battery is online', () => {
    m.mount(root, { view: () => m(BatteryCard, { battery: onlineBattery }) });
    m.redraw.sync();

    const badge = root.querySelector('wa-badge');
    expect(badge?.textContent).toContain('Online');
  });

  it('shows "Offline" badge when battery is offline', () => {
    m.mount(root, { view: () => m(BatteryCard, { battery: offlineBattery }) });
    m.redraw.sync();

    const badge = root.querySelector('wa-badge');
    expect(badge?.textContent).toContain('Offline');
  });

  it('adds the .offline class when battery is offline', () => {
    m.mount(root, { view: () => m(BatteryCard, { battery: offlineBattery }) });
    m.redraw.sync();

    const card = root.querySelector('.battery-card');
    expect(card?.classList.contains('offline')).toBe(true);
  });

  it('does not add the .offline class when battery is online', () => {
    m.mount(root, { view: () => m(BatteryCard, { battery: onlineBattery }) });
    m.redraw.sync();

    const card = root.querySelector('.battery-card');
    expect(card?.classList.contains('offline')).toBe(false);
  });

  it('renders input and output wattage stats', () => {
    m.mount(root, { view: () => m(BatteryCard, { battery: onlineBattery }) });
    m.redraw.sync();

    const stats = root.querySelectorAll('.stat');
    const texts = Array.from(stats).map((s) => s.textContent);
    expect(texts.some((t) => t?.includes('210 W'))).toBe(true);
    expect(texts.some((t) => t?.includes('57 W'))).toBe(true);
  });

  it('renders AC and DC panel wattage', () => {
    m.mount(root, { view: () => m(BatteryCard, { battery: onlineBattery }) });
    m.redraw.sync();

    const panels = root.querySelectorAll('.panel');
    const texts = Array.from(panels).map((p) => p.textContent);
    expect(texts.some((t) => t?.includes('45 W'))).toBe(true);
    expect(texts.some((t) => t?.includes('12 W'))).toBe(true);
  });

  it('includes a BatteryGauge with the correct charge level', () => {
    m.mount(root, { view: () => m(BatteryCard, { battery: onlineBattery }) });
    m.redraw.sync();

    // BatteryGauge renders a [role="meter"] with aria-valuenow
    const meter = root.querySelector('[role="meter"]');
    expect(meter?.getAttribute('aria-valuenow')).toBe('78');
  });
});
