import { describe, it, expect, afterEach } from 'vitest';
import type { WeatherDaily as WeatherDailyData } from '@camp42/shared';
import { WeatherDaily } from '../src/components/WeatherDaily.js';
import { renderComponent } from './helpers/MithrilTestHarness.js';
import type { MountedComponent } from './helpers/MithrilTestHarness.js';

describe('WeatherDaily', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let view: MountedComponent<any>;

  afterEach(() => {
    view?.unmount();
  });

  // Use a known Monday: 2024-01-08 00:00:00 UTC
  const mondayEpoch = 1704672000;
  const DAY = 86400;

  const daily: WeatherDailyData[] = [
    {
      day_start_local: mondayEpoch,
      day_num: 8,
      month_num: 1,
      conditions: 'Clear',
      icon: 'clear-day',
      air_temp_high: 85.4,
      air_temp_low: 58.2,
      precip_probability: 5,
      sunrise: mondayEpoch + 6 * 3600,
      sunset: mondayEpoch + 18 * 3600,
    },
    {
      day_start_local: mondayEpoch + DAY,
      day_num: 9,
      month_num: 1,
      conditions: 'Rain Likely',
      icon: 'rainy',
      air_temp_high: 62,
      air_temp_low: 48,
      precip_probability: 80,
      sunrise: mondayEpoch + DAY + 6 * 3600,
      sunset: mondayEpoch + DAY + 18 * 3600,
    },
  ];

  it('renders one card per daily entry', () => {
    view = renderComponent(WeatherDaily, { attrs: { daily } });

    const cards = view.root.querySelectorAll('wa-card');
    expect(cards.length).toBe(2);
  });

  it('shows the day name and day number', () => {
    view = renderComponent(WeatherDaily, { attrs: { daily } });

    const dates = view.root.querySelectorAll('.date');
    const dayNamePattern = /^(Sun|Mon|Tue|Wed|Thu|Fri|Sat) \d+$/;
    expect(dates[0].textContent).toMatch(dayNamePattern);
    expect(dates[0].textContent).toContain('8');
  });

  it('displays the conditions string', () => {
    view = renderComponent(WeatherDaily, { attrs: { daily } });

    const conditions = view.root.querySelectorAll('.conditions');
    expect(conditions[0].textContent).toBe('Clear');
    expect(conditions[1].textContent).toBe('Rain Likely');
  });

  it('shows rounded high and low temperatures', () => {
    view = renderComponent(WeatherDaily, { attrs: { daily } });

    const highs = view.root.querySelectorAll('.high');
    const lows = view.root.querySelectorAll('.low');

    // Math.round(85.4) = 85
    expect(highs[0].textContent).toContain('85');
    // Math.round(58.2) = 58
    expect(lows[0].textContent).toContain('58');
  });

  it('displays precipitation probability', () => {
    view = renderComponent(WeatherDaily, { attrs: { daily } });

    const precips = view.root.querySelectorAll('.precip');
    expect(precips[0].textContent).toContain('5%');
    expect(precips[1].textContent).toContain('80%');
  });

  it('shows the correct UTC day name regardless of local timezone', () => {
    view = renderComponent(WeatherDaily, { attrs: { daily }});
    const dates = view.root.querySelectorAll('.date');
    // The correct answer is "Mon 8" (UTC weekday).
    expect(dates[0].textContent).toBe('Mon 8');
  });

  it('renders weather icons', () => {
    view = renderComponent(WeatherDaily, { attrs: { daily } });

    const imgs = view.root.querySelectorAll<HTMLImageElement>('.icon img');
    expect(imgs.length).toBe(2);
    expect(imgs[0].alt).toBe('Clear');
    expect(imgs[1].alt).toBe('Rain Likely');
  });
});
