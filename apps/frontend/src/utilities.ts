import type { ForecastIcon } from '@camp42/shared';

/** Maps each Tempest ForecastIcon value to a weather-icons SVG filename. */
const ICON_MAP: Record<ForecastIcon, string> = {
  'clear-day': 'clear-day.svg',
  'clear-night': 'clear-night.svg',
  'cloudy': 'cloudy.svg',
  'foggy': 'fog.svg',
  'partly-cloudy-day': 'cloudy-1-day.svg',
  'partly-cloudy-night': 'cloudy-1-night.svg',
  'possibly-rainy-day': 'rainy-1-day.svg',
  'possibly-rainy-night': 'rainy-1-night.svg',
  'possibly-sleet-day': 'rainy-1-day.svg',
  'possibly-sleet-night': 'rainy-1.night.svg',
  'possibly-snow-day': 'snowy-1-day.svg',
  'possibly-snow-night': 'snowy-1-night.svg',
  'possibly-thunderstorm-day': 'isolated-thunderstorms-day.svg',
  'possibly-thunderstorm-night': 'isolated-thunderstorms-night.svg',
  'rainy': 'rainy-3.svg',
  'sleet': 'rain-and-sleet-mix.svg',
  'snow': 'snowy-3.svg',
  'thunderstorm': 'thunderstorms.svg',
  'windy': 'wind.svg',
};

/** Returns the URL path for a weather icon SVG. */
export function weatherIconUrl(icon: ForecastIcon): string {
  return `/weather-icons/${ICON_MAP[icon]}`;
}
