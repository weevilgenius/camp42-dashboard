import { describe, it, expect, afterEach } from 'vitest';
import type { WeatherHourly as WeatherHourlyData } from '@camp42/shared';
import { WeatherHourly } from '../src/components/WeatherHourly.js';
import { renderComponent } from './helpers/MithrilTestHarness.js';
import type { MountedComponent } from './helpers/MithrilTestHarness.js';

describe('WeatherHourly', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let view: MountedComponent<any>;

  afterEach(() => {
    view?.unmount();
  });

  const hourly: WeatherHourlyData[] = [
    {
      time: 1700000000,
      conditions: 'Clear',
      icon: 'clear-day',
      air_temperature: 78.6,
      feels_like: 75,
      precip_probability: 0,
      wind_avg: 5,
      wind_gust: 8,
      wind_direction_cardinal: 'SW',
      local_hour: 14,
    },
    {
      time: 1700003600,
      conditions: 'Partly Cloudy',
      icon: 'partly-cloudy-day',
      air_temperature: 76.2,
      feels_like: 74,
      precip_probability: 20,
      wind_avg: 7,
      wind_gust: 12,
      wind_direction_cardinal: 'W',
      local_hour: 15,
    },
    {
      time: 1700007200,
      conditions: 'Clear',
      icon: 'clear-night',
      air_temperature: 60,
      feels_like: 58,
      precip_probability: 0,
      wind_avg: 3,
      wind_gust: 5,
      wind_direction_cardinal: 'N',
      local_hour: 0, // midnight
    },
  ];

  it('renders one item per hourly entry', () => {
    view = renderComponent(WeatherHourly, { attrs: { hourly } });

    const items = view.root.querySelectorAll('.item');
    expect(items.length).toBe(3);
  });

  it('formats hour 14 as "2 PM"', () => {
    view = renderComponent(WeatherHourly, { attrs: { hourly } });

    const times = view.root.querySelectorAll('.time');
    expect(times[0].textContent).toBe('2 PM');
  });

  it('formats hour 15 as "3 PM"', () => {
    view = renderComponent(WeatherHourly, { attrs: { hourly } });

    const times = view.root.querySelectorAll('.time');
    expect(times[1].textContent).toBe('3 PM');
  });

  it('formats hour 0 (midnight) as "12 AM"', () => {
    view = renderComponent(WeatherHourly, { attrs: { hourly } });

    const times = view.root.querySelectorAll('.time');
    expect(times[2].textContent).toBe('12 AM');
  });

  it('renders rounded temperatures', () => {
    view = renderComponent(WeatherHourly, { attrs: { hourly } });

    const temps = view.root.querySelectorAll('.temp');
    // Math.round(78.6) = 79
    expect(temps[0].textContent).toContain('79');
    // Math.round(76.2) = 76
    expect(temps[1].textContent).toContain('76');
  });

  it('shows precipitation percentage only when > 0', () => {
    view = renderComponent(WeatherHourly, { attrs: { hourly } });

    const items = view.root.querySelectorAll('.item');

    // first item: precip_probability = 0 -> no .precip element
    expect(items[0].querySelector('.precip')).toBeNull();

    // second item: precip_probability = 20 -> .precip shown
    const precip = items[1].querySelector('.precip');
    expect(precip).not.toBeNull();
    expect(precip?.textContent).toContain('20%');

    // third item: precip_probability = 0 -> no .precip element
    expect(items[2].querySelector('.precip')).toBeNull();
  });

  it('renders weather icons with alt text', () => {
    view = renderComponent(WeatherHourly, { attrs: { hourly } });

    const imgs = view.root.querySelectorAll<HTMLImageElement>('.icon img');
    expect(imgs.length).toBe(3);
    expect(imgs[0].alt).toBe('Clear');
    expect(imgs[1].alt).toBe('Partly Cloudy');
  });
});
