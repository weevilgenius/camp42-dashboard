import { describe, it, expect, afterEach } from 'vitest';
import m from 'mithril';
import type { WeatherDaily as WeatherDailyData } from '@camp42/shared';
import { WeatherDaily } from '../src/components/WeatherDaily.js';

describe('WeatherDaily', () => {
  const root = document.createElement('div');
  document.body.appendChild(root);

  afterEach(() => {
    m.mount(root, null);
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
    m.mount(root, { view: () => m(WeatherDaily, { daily }) });
    m.redraw.sync();

    const cards = root.querySelectorAll('wa-card');
    expect(cards.length).toBe(2);
  });

  it('shows the day name and day number', () => {
    m.mount(root, { view: () => m(WeatherDaily, { daily }) });
    m.redraw.sync();

    const dates = root.querySelectorAll('.date');
    // The component uses getDay() (local TZ) so the rendered day name depends
    // on the machine's timezone.  We verify the format is "<DayName> <num>"
    // and that the day number from the data is present.
    const dayNamePattern = /^(Sun|Mon|Tue|Wed|Thu|Fri|Sat) \d+$/;
    expect(dates[0].textContent).toMatch(dayNamePattern);
    expect(dates[0].textContent).toContain('8');
  });

  it('displays the conditions string', () => {
    m.mount(root, { view: () => m(WeatherDaily, { daily }) });
    m.redraw.sync();

    const conditions = root.querySelectorAll('.conditions');
    expect(conditions[0].textContent).toBe('Clear');
    expect(conditions[1].textContent).toBe('Rain Likely');
  });

  it('shows rounded high and low temperatures', () => {
    m.mount(root, { view: () => m(WeatherDaily, { daily }) });
    m.redraw.sync();

    const highs = root.querySelectorAll('.high');
    const lows = root.querySelectorAll('.low');

    // Math.round(85.4) = 85
    expect(highs[0].textContent).toContain('85');
    // Math.round(58.2) = 58
    expect(lows[0].textContent).toContain('58');
  });

  it('displays precipitation probability', () => {
    m.mount(root, { view: () => m(WeatherDaily, { daily }) });
    m.redraw.sync();

    const precips = root.querySelectorAll('.precip');
    expect(precips[0].textContent).toContain('5%');
    expect(precips[1].textContent).toContain('80%');
  });

  it('renders weather icons', () => {
    m.mount(root, { view: () => m(WeatherDaily, { daily }) });
    m.redraw.sync();

    const imgs = root.querySelectorAll<HTMLImageElement>('.icon img');
    expect(imgs.length).toBe(2);
    expect(imgs[0].alt).toBe('Clear');
    expect(imgs[1].alt).toBe('Rain Likely');
  });
});
