import { describe, it, expect, afterEach } from 'vitest';
import { BatteryGauge } from '../src/components/BatteryGauge.js';
import { renderComponent } from './helpers/MithrilTestHarness.js';
import type { MountedComponent } from './helpers/MithrilTestHarness.js';

describe('BatteryGauge', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let view: MountedComponent<any>;

  afterEach(() => {
    view?.unmount();
  });

  it('renders a meter element with the correct ARIA attributes', () => {
    view = renderComponent(BatteryGauge, { attrs: { level: 75 } });

    const gauge = view.root.querySelector('[role="meter"]');
    expect(gauge).not.toBeNull();
    expect(gauge?.getAttribute('aria-valuenow')).toBe('75');
    expect(gauge?.getAttribute('aria-valuemin')).toBe('0');
    expect(gauge?.getAttribute('aria-valuemax')).toBe('100');
  });

  it('clamps the level between 0 and 100', () => {
    // level above 100 should be clamped to 100
    view = renderComponent(BatteryGauge, { attrs: { level: 150 } });

    // the aria-valuenow should still reflect the raw value for accessibility,
    // but the CSS variable should be clamped
    const fill = view.root.querySelector('.fill') as HTMLElement;
    expect(fill?.style.getPropertyValue('--fill-level')).toBe('100%');
  });

  it('applies the "good" class when level > 50', () => {
    view = renderComponent(BatteryGauge, { attrs: { level: 75 } });

    const gauge = view.root.querySelector('.battery-gauge');
    expect(gauge?.classList.contains('good')).toBe(true);
  });

  it('applies the "low" class when level is between 21 and 50', () => {
    view = renderComponent(BatteryGauge, { attrs: { level: 35 } });

    const gauge = view.root.querySelector('.battery-gauge');
    expect(gauge?.classList.contains('low')).toBe(true);
  });

  it('applies the "empty" class when level <= 20', () => {
    view = renderComponent(BatteryGauge, { attrs: { level: 10 } });

    const gauge = view.root.querySelector('.battery-gauge');
    expect(gauge?.classList.contains('empty')).toBe(true);
  });

  it('applies the "charging" class when charging is true', () => {
    view = renderComponent(BatteryGauge, { attrs: { level: 50, charging: true } });

    const gauge = view.root.querySelector('.battery-gauge');
    expect(gauge?.classList.contains('charging')).toBe(true);
  });

  it('does not apply the "charging" class when charging is false', () => {
    view = renderComponent(BatteryGauge, { attrs: { level: 50, charging: false } });

    const gauge = view.root.querySelector('.battery-gauge');
    expect(gauge?.classList.contains('charging')).toBe(false);
  });

  it('defaults to horizontal layout', () => {
    view = renderComponent(BatteryGauge, { attrs: { level: 50 } });

    const gauge = view.root.querySelector('.battery-gauge');
    expect(gauge?.classList.contains('horizontal')).toBe(true);
  });

  it('supports vertical layout', () => {
    view = renderComponent(BatteryGauge, { attrs: { level: 50, layout: 'vertical' } });

    const gauge = view.root.querySelector('.battery-gauge');
    expect(gauge?.classList.contains('vertical')).toBe(true);
  });

  it('shows the percentage in the label', () => {
    view = renderComponent(BatteryGauge, { attrs: { level: 42 } });

    const label = view.root.querySelector('.label');
    expect(label?.textContent).toContain('42%');
  });

  it('includes a lightning bolt in the label when charging', () => {
    view = renderComponent(BatteryGauge, { attrs: { level: 42, charging: true } });

    const label = view.root.querySelector('.label');
    // the component uses the unicode lightning symbol \u26A1
    expect(label?.textContent).toContain('\u26A1');
  });

  it('sets the --fill-level CSS variable on the fill element', () => {
    view = renderComponent(BatteryGauge, { attrs: { level: 63 } });

    const fill = view.root.querySelector('.fill') as HTMLElement;
    expect(fill?.style.getPropertyValue('--fill-level')).toBe('63%');
  });
});
