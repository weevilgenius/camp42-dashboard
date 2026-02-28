import { describe, it, expect } from 'vitest';
import type { ForecastIcon } from '@camp42/shared';
import { weatherIconUrl } from '../src/utilities.js';

describe('weatherIconUrl', () => {
  it('returns a path under /weather-icons/', () => {
    const url = weatherIconUrl('clear-day');
    expect(url).toMatch(/^\/weather-icons\//);
  });

  it('maps clear-day to clear-day.svg', () => {
    expect(weatherIconUrl('clear-day')).toBe('/weather-icons/clear-day.svg');
  });

  it('maps clear-night to clear-night.svg', () => {
    expect(weatherIconUrl('clear-night')).toBe('/weather-icons/clear-night.svg');
  });

  it('maps cloudy to cloudy.svg', () => {
    expect(weatherIconUrl('cloudy')).toBe('/weather-icons/cloudy.svg');
  });

  it('maps foggy to fog.svg', () => {
    expect(weatherIconUrl('foggy')).toBe('/weather-icons/fog.svg');
  });

  it('maps rainy to rainy-3.svg', () => {
    expect(weatherIconUrl('rainy')).toBe('/weather-icons/rainy-3.svg');
  });

  it('maps snow to snowy-3.svg', () => {
    expect(weatherIconUrl('snow')).toBe('/weather-icons/snowy-3.svg');
  });

  it('maps thunderstorm to thunderstorms.svg', () => {
    expect(weatherIconUrl('thunderstorm')).toBe('/weather-icons/thunderstorms.svg');
  });

  it('maps windy to wind.svg', () => {
    expect(weatherIconUrl('windy')).toBe('/weather-icons/wind.svg');
  });

  it('maps sleet to rain-and-sleet-mix.svg', () => {
    expect(weatherIconUrl('sleet')).toBe('/weather-icons/rain-and-sleet-mix.svg');
  });

  // verify all 19 ForecastIcon values produce a non-empty string
  it('returns a non-empty string for every ForecastIcon value', () => {
    const allIcons: ForecastIcon[] = [
      'clear-day', 'clear-night', 'cloudy', 'foggy',
      'partly-cloudy-day', 'partly-cloudy-night',
      'possibly-rainy-day', 'possibly-rainy-night',
      'possibly-sleet-day', 'possibly-sleet-night',
      'possibly-snow-day', 'possibly-snow-night',
      'possibly-thunderstorm-day', 'possibly-thunderstorm-night',
      'rainy', 'sleet', 'snow', 'thunderstorm', 'windy',
    ];

    for (const icon of allIcons) {
      const url = weatherIconUrl(icon);
      expect(url).toBeTruthy();
      expect(url).toMatch(/\.svg$/);
    }
  });
});
