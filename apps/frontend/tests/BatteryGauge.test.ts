import { describe, it, expect, afterEach } from 'vitest';
import m from 'mithril';
import { BatteryGauge } from '../src/components/BatteryGauge.js';

// We render Mithril components into a real DOM node provided by happy-dom.
// This approach tests the vnode tree output without needing a full browser.

describe('BatteryGauge', () => {
  const root = document.createElement('div');
  document.body.appendChild(root);

  afterEach(() => {
    m.mount(root, null);
  });

  it('renders a meter element with the correct ARIA attributes', () => {
    m.mount(root, { view: () => m(BatteryGauge, { level: 75 }) });
    m.redraw.sync();

    const gauge = root.querySelector('[role="meter"]');
    expect(gauge).not.toBeNull();
    expect(gauge?.getAttribute('aria-valuenow')).toBe('75');
    expect(gauge?.getAttribute('aria-valuemin')).toBe('0');
    expect(gauge?.getAttribute('aria-valuemax')).toBe('100');
  });

  it('clamps the level between 0 and 100', () => {
    // level above 100 should be clamped to 100
    m.mount(root, { view: () => m(BatteryGauge, { level: 150 }) });
    m.redraw.sync();

    // the aria-valuenow should still reflect the raw value for accessibility,
    // but the CSS variable should be clamped
    const fill = root.querySelector('.fill') as HTMLElement;
    expect(fill?.style.getPropertyValue('--fill-level')).toBe('100%');
  });

  it('applies the "good" class when level > 50', () => {
    m.mount(root, { view: () => m(BatteryGauge, { level: 75 }) });
    m.redraw.sync();

    const gauge = root.querySelector('.battery-gauge');
    expect(gauge?.classList.contains('good')).toBe(true);
  });

  it('applies the "low" class when level is between 21 and 50', () => {
    m.mount(root, { view: () => m(BatteryGauge, { level: 35 }) });
    m.redraw.sync();

    const gauge = root.querySelector('.battery-gauge');
    expect(gauge?.classList.contains('low')).toBe(true);
  });

  it('applies the "empty" class when level <= 20', () => {
    m.mount(root, { view: () => m(BatteryGauge, { level: 10 }) });
    m.redraw.sync();

    const gauge = root.querySelector('.battery-gauge');
    expect(gauge?.classList.contains('empty')).toBe(true);
  });

  it('applies the "charging" class when charging is true', () => {
    m.mount(root, { view: () => m(BatteryGauge, { level: 50, charging: true }) });
    m.redraw.sync();

    const gauge = root.querySelector('.battery-gauge');
    expect(gauge?.classList.contains('charging')).toBe(true);
  });

  it('does not apply the "charging" class when charging is false', () => {
    m.mount(root, { view: () => m(BatteryGauge, { level: 50, charging: false }) });
    m.redraw.sync();

    const gauge = root.querySelector('.battery-gauge');
    expect(gauge?.classList.contains('charging')).toBe(false);
  });

  it('defaults to horizontal layout', () => {
    m.mount(root, { view: () => m(BatteryGauge, { level: 50 }) });
    m.redraw.sync();

    const gauge = root.querySelector('.battery-gauge');
    expect(gauge?.classList.contains('horizontal')).toBe(true);
  });

  it('supports vertical layout', () => {
    m.mount(root, { view: () => m(BatteryGauge, { level: 50, layout: 'vertical' }) });
    m.redraw.sync();

    const gauge = root.querySelector('.battery-gauge');
    expect(gauge?.classList.contains('vertical')).toBe(true);
  });

  it('shows the percentage in the label', () => {
    m.mount(root, { view: () => m(BatteryGauge, { level: 42 }) });
    m.redraw.sync();

    const label = root.querySelector('.label');
    expect(label?.textContent).toContain('42%');
  });

  it('includes a lightning bolt in the label when charging', () => {
    m.mount(root, { view: () => m(BatteryGauge, { level: 42, charging: true }) });
    m.redraw.sync();

    const label = root.querySelector('.label');
    // the component uses the unicode lightning symbol \u26A1
    expect(label?.textContent).toContain('\u26A1');
  });

  it('sets the --fill-level CSS variable on the fill element', () => {
    m.mount(root, { view: () => m(BatteryGauge, { level: 63 }) });
    m.redraw.sync();

    const fill = root.querySelector('.fill') as HTMLElement;
    expect(fill?.style.getPropertyValue('--fill-level')).toBe('63%');
  });
});
