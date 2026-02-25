import type { WeatherStatus } from '@camp42/shared';
import { createWeatherStatus, createWeatherCurrent } from './factories.js';

/** Clear day, 78F, calm winds. */
export const WEATHER_CLEAR_DAY = (): WeatherStatus =>
  createWeatherStatus();

/** Clear night, 55F, calm. */
export const WEATHER_CLEAR_NIGHT = (): WeatherStatus =>
  createWeatherStatus({
    current: createWeatherCurrent({
      conditions: 'Clear',
      icon: 'clear-night',
      air_temperature: 55,
      feels_like: 53,
      relative_humidity: 60,
      wind_avg: 3,
      wind_gust: 5,
      wind_direction_cardinal: 'N',
    }),
  });

/** Partly cloudy, 72F, light breeze. */
export const WEATHER_PARTLY_CLOUDY = (): WeatherStatus =>
  createWeatherStatus({
    current: createWeatherCurrent({
      conditions: 'Partly Cloudy',
      icon: 'partly-cloudy-day',
      air_temperature: 72,
      feels_like: 70,
      relative_humidity: 45,
      wind_avg: 8,
      wind_gust: 14,
      wind_direction_cardinal: 'W',
    }),
  });

/** Heavy rain, 58F, high precipitation probability. */
export const WEATHER_RAINY = (): WeatherStatus =>
  createWeatherStatus({
    current: createWeatherCurrent({
      conditions: 'Heavy Rain',
      icon: 'rainy',
      air_temperature: 58,
      feels_like: 54,
      relative_humidity: 92,
      wind_avg: 12,
      wind_gust: 20,
      wind_direction_cardinal: 'NE',
      precip_probability: 90,
      precip_accum_local_day: 0.45,
    }),
  });

/** Thunderstorms, 62F, 25mph gusts. */
export const WEATHER_STORMY = (): WeatherStatus =>
  createWeatherStatus({
    current: createWeatherCurrent({
      conditions: 'Thunderstorms',
      icon: 'thunderstorm',
      air_temperature: 62,
      feels_like: 58,
      relative_humidity: 88,
      wind_avg: 18,
      wind_gust: 25,
      wind_direction_cardinal: 'SE',
      precip_probability: 95,
      precip_accum_local_day: 0.82,
    }),
  });

/** Snow, 28F, high precipitation probability. */
export const WEATHER_SNOWY = (): WeatherStatus =>
  createWeatherStatus({
    current: createWeatherCurrent({
      conditions: 'Snow',
      icon: 'snow',
      air_temperature: 28,
      feels_like: 18,
      relative_humidity: 78,
      wind_avg: 10,
      wind_gust: 18,
      wind_direction_cardinal: 'NW',
      precip_probability: 80,
      precip_accum_local_day: 0.3,
    }),
  });

/** Windy, 65F, 30mph sustained winds. */
export const WEATHER_WINDY = (): WeatherStatus =>
  createWeatherStatus({
    current: createWeatherCurrent({
      conditions: 'Windy',
      icon: 'windy',
      air_temperature: 65,
      feels_like: 58,
      relative_humidity: 30,
      wind_avg: 30,
      wind_gust: 42,
      wind_direction_cardinal: 'W',
      precip_probability: 5,
    }),
  });

/** Extreme heat, 105F, feels like 110F. */
export const WEATHER_HOT = (): WeatherStatus =>
  createWeatherStatus({
    current: createWeatherCurrent({
      conditions: 'Clear',
      icon: 'clear-day',
      air_temperature: 105,
      feels_like: 110,
      relative_humidity: 15,
      wind_avg: 4,
      wind_gust: 7,
      wind_direction_cardinal: 'S',
      precip_probability: 0,
    }),
  });
