import { describe, it, expect, afterEach } from 'vitest';
import m from 'mithril';
import type { WeatherCurrent as WeatherCurrentData } from '@camp42/shared';
import { WeatherCurrent } from '../src/components/WeatherCurrent.js';

describe('WeatherCurrent', () => {
  const root = document.createElement('div');
  document.body.appendChild(root);

  afterEach(() => {
    m.mount(root, null);
  });

  const current: WeatherCurrentData = {
    time: 1700000000,
    conditions: 'Partly Cloudy',
    icon: 'partly-cloudy-day',
    air_temperature: 72.4,
    feels_like: 68.8,
    relative_humidity: 45,
    wind_avg: 8.3,
    wind_gust: 14,
    wind_direction_cardinal: 'SW',
    precip_probability: 15,
    precip_accum_local_day: 0.1,
  };

  it('displays the rounded temperature', () => {
    m.mount(root, { view: () => m(WeatherCurrent, { current }) });
    m.redraw.sync();

    const temp = root.querySelector('.temp');
    // Math.round(72.4) = 72
    expect(temp?.textContent).toContain('72');
  });

  it('displays the feels-like temperature', () => {
    m.mount(root, { view: () => m(WeatherCurrent, { current }) });
    m.redraw.sync();

    const feels = root.querySelector('.feels');
    // Math.round(68.8) = 69
    expect(feels?.textContent).toContain('69');
  });

  it('displays the conditions string', () => {
    m.mount(root, { view: () => m(WeatherCurrent, { current }) });
    m.redraw.sync();

    const condition = root.querySelector('.condition');
    expect(condition?.textContent).toBe('Partly Cloudy');
  });

  it('renders the weather icon with the correct alt text', () => {
    m.mount(root, { view: () => m(WeatherCurrent, { current }) });
    m.redraw.sync();

    const img = root.querySelector('.icon img') as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img?.alt).toBe('Partly Cloudy');
    expect(img?.src).toContain('cloudy');
  });

  it('displays humidity percentage', () => {
    m.mount(root, { view: () => m(WeatherCurrent, { current }) });
    m.redraw.sync();

    const stats = root.querySelectorAll('.stat');
    const humidityText = Array.from(stats).map((s) => s.textContent).join(' ');
    expect(humidityText).toContain('45%');
  });

  it('displays wind speed and direction', () => {
    m.mount(root, { view: () => m(WeatherCurrent, { current }) });
    m.redraw.sync();

    const stats = root.querySelectorAll('.stat');
    const windText = Array.from(stats).map((s) => s.textContent).join(' ');
    // Math.round(8.3) = 8
    expect(windText).toContain('8 mph SW');
  });

  it('displays precipitation probability', () => {
    m.mount(root, { view: () => m(WeatherCurrent, { current }) });
    m.redraw.sync();

    const stats = root.querySelectorAll('.stat');
    const precipText = Array.from(stats).map((s) => s.textContent).join(' ');
    expect(precipText).toContain('15%');
  });
});
