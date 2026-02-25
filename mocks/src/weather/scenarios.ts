import type {
  ForecastCondition,
  ForecastIcon,
  WeatherDaily,
  WeatherHourly,
  WeatherStatus,
} from '@camp42/shared';
import {
  createWeatherStatus,
  createWeatherCurrent,
  createWeatherDaily,
  createWeatherHourly,
} from './factories.js';


/* ========================================================= *\
 *  Helpers for building themed daily / hourly arrays         *
\* ========================================================= */

/** Per-day theme overrides applied when building a 7-day forecast. */
interface DailyTheme {
  conditions: readonly ForecastCondition[];
  icons: readonly ForecastIcon[];
  highs: readonly number[];
  lows: readonly number[];
  precip: readonly number[];
}

/** Per-hour theme overrides applied when building a 12-hour forecast. */
interface HourlyTheme {
  conditions: readonly ForecastCondition[];
  icons: readonly ForecastIcon[];
  temps: readonly number[];
  feelsLike: readonly number[];
  precip: readonly number[];
  windAvg: readonly number[];
  windGust: readonly number[];
  windDir: string;
}

/** Build a 7-day daily array from a theme. */
const buildDaily = (theme: DailyTheme): WeatherDaily[] => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEpoch = Math.floor(todayStart.getTime() / 1000);
  const DAY = 86400;
  const HOUR = 3600;

  return Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date(todayStart.getTime() + i * DAY * 1000);
    return createWeatherDaily({
      day_start_local: todayEpoch + i * DAY,
      day_num: dayDate.getDate(),
      month_num: dayDate.getMonth() + 1,
      conditions: theme.conditions[i],
      icon: theme.icons[i],
      air_temp_high: theme.highs[i],
      air_temp_low: theme.lows[i],
      precip_probability: theme.precip[i],
      sunrise: todayEpoch + i * DAY + 6 * HOUR,
      sunset: todayEpoch + i * DAY + 18.5 * HOUR,
    });
  });
};

/** Build a 12-hour hourly array from a theme. */
const buildHourly = (theme: HourlyTheme): WeatherHourly[] => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEpoch = Math.floor(todayStart.getTime() / 1000);
  const HOUR = 3600;

  return Array.from({ length: 12 }, (_, i) => {
    const hour = (now.getHours() + i) % 24;
    return createWeatherHourly({
      time: todayEpoch + (now.getHours() + i) * HOUR,
      conditions: theme.conditions[i],
      icon: theme.icons[i],
      air_temperature: theme.temps[i],
      feels_like: theme.feelsLike[i],
      precip_probability: theme.precip[i],
      wind_avg: theme.windAvg[i],
      wind_gust: theme.windGust[i],
      wind_direction_cardinal: theme.windDir,
      local_hour: hour,
    });
  });
};


/* ========================================================= *\
 *  Scenarios                                                 *
\* ========================================================= */

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
    hourly: buildHourly({
      conditions: ['Clear', 'Clear', 'Clear', 'Clear', 'Clear', 'Clear', 'Clear', 'Clear', 'Clear', 'Clear', 'Clear', 'Clear'],
      icons: ['clear-night', 'clear-night', 'clear-night', 'clear-night', 'clear-night', 'clear-night', 'clear-day', 'clear-day', 'clear-day', 'clear-day', 'clear-day', 'clear-day'],
      temps: [55, 54, 53, 52, 51, 50, 52, 56, 60, 64, 68, 70],
      feelsLike: [53, 52, 51, 50, 49, 48, 50, 54, 58, 62, 66, 68],
      precip: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      windAvg: [3, 3, 2, 2, 2, 2, 3, 3, 4, 4, 5, 5],
      windGust: [5, 5, 4, 4, 3, 3, 5, 5, 6, 7, 8, 8],
      windDir: 'N',
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
    daily: buildDaily({
      conditions: ['Partly Cloudy', 'Partly Cloudy', 'Cloudy', 'Partly Cloudy', 'Clear', 'Partly Cloudy', 'Cloudy'],
      icons: ['partly-cloudy-day', 'partly-cloudy-day', 'cloudy', 'partly-cloudy-day', 'clear-day', 'partly-cloudy-day', 'cloudy'],
      highs: [74, 72, 70, 73, 76, 71, 68],
      lows: [56, 55, 54, 55, 57, 54, 52],
      precip: [10, 15, 25, 10, 5, 20, 30],
    }),
    hourly: buildHourly({
      conditions: ['Partly Cloudy', 'Partly Cloudy', 'Cloudy', 'Cloudy', 'Partly Cloudy', 'Partly Cloudy', 'Clear', 'Clear', 'Partly Cloudy', 'Partly Cloudy', 'Cloudy', 'Cloudy'],
      icons: ['partly-cloudy-day', 'partly-cloudy-day', 'cloudy', 'cloudy', 'partly-cloudy-day', 'partly-cloudy-day', 'clear-day', 'clear-day', 'partly-cloudy-day', 'partly-cloudy-day', 'cloudy', 'cloudy'],
      temps: [72, 73, 74, 74, 73, 72, 71, 70, 68, 66, 64, 62],
      feelsLike: [70, 71, 72, 72, 71, 70, 69, 68, 66, 64, 62, 60],
      precip: [10, 10, 15, 20, 15, 10, 5, 5, 10, 15, 20, 25],
      windAvg: [8, 9, 10, 10, 9, 8, 7, 7, 8, 9, 10, 11],
      windGust: [14, 15, 16, 17, 15, 14, 12, 12, 14, 15, 17, 18],
      windDir: 'W',
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
    daily: buildDaily({
      conditions: ['Heavy Rain', 'Rain Likely', 'Rain Likely', 'Light Rain', 'Rain Possible', 'Partly Cloudy', 'Clear'],
      icons: ['rainy', 'rainy', 'rainy', 'possibly-rainy-day', 'possibly-rainy-day', 'partly-cloudy-day', 'clear-day'],
      highs: [58, 56, 57, 62, 65, 70, 74],
      lows: [48, 47, 48, 50, 52, 54, 56],
      precip: [90, 85, 80, 60, 40, 15, 5],
    }),
    hourly: buildHourly({
      conditions: ['Heavy Rain', 'Heavy Rain', 'Heavy Rain', 'Rain Likely', 'Rain Likely', 'Light Rain', 'Light Rain', 'Rain Possible', 'Rain Possible', 'Partly Cloudy', 'Partly Cloudy', 'Cloudy'],
      icons: ['rainy', 'rainy', 'rainy', 'rainy', 'rainy', 'possibly-rainy-day', 'possibly-rainy-day', 'possibly-rainy-day', 'possibly-rainy-day', 'partly-cloudy-day', 'partly-cloudy-day', 'cloudy'],
      temps: [58, 57, 57, 56, 56, 55, 55, 56, 57, 58, 59, 60],
      feelsLike: [54, 53, 53, 52, 52, 51, 51, 52, 53, 54, 55, 56],
      precip: [90, 95, 90, 85, 75, 60, 50, 40, 30, 20, 15, 10],
      windAvg: [12, 14, 15, 14, 13, 12, 10, 9, 8, 7, 6, 6],
      windGust: [20, 22, 24, 22, 20, 18, 16, 14, 12, 11, 10, 9],
      windDir: 'NE',
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
    daily: buildDaily({
      conditions: ['Thunderstorms', 'Thunderstorms Likely', 'Rain Likely', 'Heavy Rain', 'Partly Cloudy', 'Rain Possible', 'Clear'],
      icons: ['thunderstorm', 'possibly-thunderstorm-day', 'rainy', 'rainy', 'partly-cloudy-day', 'possibly-rainy-day', 'clear-day'],
      highs: [64, 66, 60, 58, 68, 72, 76],
      lows: [52, 54, 50, 48, 54, 56, 58],
      precip: [95, 80, 75, 70, 20, 35, 5],
    }),
    hourly: buildHourly({
      conditions: ['Thunderstorms', 'Thunderstorms', 'Thunderstorms', 'Thunderstorms Likely', 'Heavy Rain', 'Heavy Rain', 'Rain Likely', 'Rain Likely', 'Light Rain', 'Partly Cloudy', 'Partly Cloudy', 'Clear'],
      icons: ['thunderstorm', 'thunderstorm', 'thunderstorm', 'possibly-thunderstorm-day', 'rainy', 'rainy', 'rainy', 'rainy', 'possibly-rainy-day', 'partly-cloudy-day', 'partly-cloudy-day', 'clear-day'],
      temps: [62, 61, 60, 59, 58, 58, 59, 60, 62, 64, 66, 68],
      feelsLike: [58, 57, 56, 55, 54, 54, 55, 56, 58, 60, 62, 64],
      precip: [95, 95, 90, 80, 75, 70, 60, 50, 35, 15, 10, 5],
      windAvg: [18, 20, 22, 20, 18, 15, 13, 11, 9, 7, 6, 5],
      windGust: [25, 30, 35, 30, 25, 22, 18, 16, 14, 11, 9, 8],
      windDir: 'SE',
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
    daily: buildDaily({
      conditions: ['Snow', 'Heavy Snow', 'Snow Likely', 'Snow Possible', 'Cloudy', 'Partly Cloudy', 'Clear'],
      icons: ['snow', 'snow', 'snow', 'possibly-snow-day', 'cloudy', 'partly-cloudy-day', 'clear-day'],
      highs: [30, 26, 28, 32, 35, 38, 42],
      lows: [18, 14, 16, 20, 22, 25, 28],
      precip: [80, 90, 70, 45, 20, 10, 5],
    }),
    hourly: buildHourly({
      conditions: ['Snow', 'Snow', 'Heavy Snow', 'Heavy Snow', 'Snow', 'Snow Likely', 'Snow Likely', 'Snow Possible', 'Cloudy', 'Cloudy', 'Partly Cloudy', 'Partly Cloudy'],
      icons: ['snow', 'snow', 'snow', 'snow', 'snow', 'snow', 'snow', 'possibly-snow-day', 'cloudy', 'cloudy', 'partly-cloudy-day', 'partly-cloudy-day'],
      temps: [28, 27, 26, 25, 25, 26, 27, 28, 29, 30, 31, 32],
      feelsLike: [18, 17, 15, 14, 14, 16, 17, 18, 20, 22, 24, 25],
      precip: [80, 85, 90, 90, 80, 70, 55, 40, 25, 15, 10, 5],
      windAvg: [10, 12, 14, 14, 12, 11, 10, 9, 8, 7, 6, 5],
      windGust: [18, 20, 22, 24, 20, 18, 16, 14, 12, 10, 9, 8],
      windDir: 'NW',
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
    daily: buildDaily({
      conditions: ['Windy', 'Windy', 'Partly Cloudy', 'Windy', 'Clear', 'Partly Cloudy', 'Clear'],
      icons: ['windy', 'windy', 'partly-cloudy-day', 'windy', 'clear-day', 'partly-cloudy-day', 'clear-day'],
      highs: [66, 64, 68, 62, 70, 72, 74],
      lows: [48, 46, 50, 44, 52, 54, 55],
      precip: [5, 10, 10, 5, 5, 10, 5],
    }),
    hourly: buildHourly({
      conditions: ['Windy', 'Windy', 'Windy', 'Windy', 'Windy', 'Partly Cloudy', 'Partly Cloudy', 'Clear', 'Clear', 'Windy', 'Windy', 'Windy'],
      icons: ['windy', 'windy', 'windy', 'windy', 'windy', 'partly-cloudy-day', 'partly-cloudy-day', 'clear-day', 'clear-day', 'windy', 'windy', 'windy'],
      temps: [65, 64, 63, 62, 62, 63, 64, 66, 67, 66, 64, 62],
      feelsLike: [58, 56, 55, 54, 54, 56, 58, 60, 61, 60, 57, 55],
      precip: [5, 5, 5, 10, 10, 5, 5, 0, 0, 5, 5, 10],
      windAvg: [30, 32, 34, 35, 33, 28, 25, 22, 20, 25, 30, 32],
      windGust: [42, 45, 48, 50, 47, 40, 36, 32, 28, 35, 42, 45],
      windDir: 'W',
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
    daily: buildDaily({
      conditions: ['Clear', 'Clear', 'Clear', 'Partly Cloudy', 'Clear', 'Clear', 'Partly Cloudy'],
      icons: ['clear-day', 'clear-day', 'clear-day', 'partly-cloudy-day', 'clear-day', 'clear-day', 'partly-cloudy-day'],
      highs: [105, 107, 108, 104, 106, 109, 103],
      lows: [82, 84, 85, 80, 83, 86, 79],
      precip: [0, 0, 0, 5, 0, 0, 10],
    }),
    hourly: buildHourly({
      conditions: ['Clear', 'Clear', 'Clear', 'Clear', 'Clear', 'Clear', 'Clear', 'Clear', 'Clear', 'Clear', 'Partly Cloudy', 'Partly Cloudy'],
      icons: ['clear-day', 'clear-day', 'clear-day', 'clear-day', 'clear-day', 'clear-day', 'clear-day', 'clear-day', 'clear-day', 'clear-day', 'partly-cloudy-day', 'partly-cloudy-day'],
      temps: [98, 100, 102, 104, 105, 106, 107, 108, 107, 105, 102, 99],
      feelsLike: [102, 105, 108, 110, 112, 113, 114, 115, 114, 112, 108, 104],
      precip: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      windAvg: [4, 4, 5, 5, 5, 4, 4, 3, 3, 4, 5, 5],
      windGust: [7, 7, 8, 8, 8, 7, 7, 6, 6, 7, 8, 8],
      windDir: 'S',
    }),
  });
