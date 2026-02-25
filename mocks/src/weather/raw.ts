/* ========================================================= *\
 *  Minimal raw Tempest API response mocks                   *
 *                                                           *
 *  Only the fields used by apps/backend/src/weather.ts      *
 *  are included. These types are intentionally minimal --   *
 *  use the full interfaces in libTempest.ts for exhaustive  *
 *  typing.                                                  *
\* ========================================================= */

import type { ForecastCondition, ForecastIcon } from '@camp42/shared';

/** Minimal current conditions -- only fields the backend extracts. */
export interface MockBetterForecastCurrentConditions {
  time: number;
  conditions: ForecastCondition;
  icon: ForecastIcon;
  air_temperature: number;
  feels_like: number;
  relative_humidity: number;
  wind_avg: number;
  wind_gust: number;
  wind_direction_cardinal: string;
  precip_probability: number;
  precip_accum_local_day: number;
}

/** Minimal daily forecast entry -- only fields the backend extracts. */
export interface MockBetterForecastDaily {
  day_start_local: number;
  day_num: number;
  month_num: number;
  conditions: ForecastCondition;
  icon: ForecastIcon;
  air_temp_high: number;
  air_temp_low: number;
  precip_probability: number;
  sunrise: number;
  sunset: number;
}

/** Minimal hourly forecast entry -- only fields the backend extracts. */
export interface MockBetterForecastHourly {
  time: number;
  conditions: ForecastCondition;
  icon: ForecastIcon;
  air_temperature: number;
  feels_like: number;
  precip_probability: number;
  wind_avg: number;
  wind_gust: number;
  wind_direction_cardinal: string;
  local_hour: number;
}

/** Minimal BetterForecast response -- only the structure the backend reads. */
export interface MockBetterForecast {
  current_conditions: MockBetterForecastCurrentConditions;
  forecast: {
    daily: MockBetterForecastDaily[];
    hourly: MockBetterForecastHourly[];
  };
}

/** Create a mock BetterForecast API response. */
export function createBetterForecastResponse(
  overrides?: Partial<MockBetterForecast>,
): MockBetterForecast {
  const now = Math.floor(Date.now() / 1000);
  const todayStart = now - (now % 86400);
  const DAY = 86400;
  const HOUR = 3600;

  return {
    current_conditions: overrides?.current_conditions ?? {
      time: now,
      conditions: 'Clear',
      icon: 'clear-day',
      air_temperature: 78,
      feels_like: 75,
      relative_humidity: 35,
      wind_avg: 5,
      wind_gust: 8,
      wind_direction_cardinal: 'SW',
      precip_probability: 0,
      precip_accum_local_day: 0,
    },
    forecast: overrides?.forecast ?? {
      daily: Array.from({ length: 10 }, (_, i) => ({
        day_start_local: todayStart + i * DAY,
        day_num: new Date((todayStart + i * DAY) * 1000).getDate(),
        month_num: new Date((todayStart + i * DAY) * 1000).getMonth() + 1,
        conditions: 'Clear' as ForecastCondition,
        icon: 'clear-day' as ForecastIcon,
        air_temp_high: 85 + Math.round(Math.sin(i) * 5),
        air_temp_low: 58 + Math.round(Math.sin(i) * 3),
        precip_probability: 5,
        sunrise: todayStart + i * DAY + 6 * HOUR,
        sunset: todayStart + i * DAY + 18.5 * HOUR,
      })),
      hourly: Array.from({ length: 24 }, (_, i) => ({
        time: now + i * HOUR,
        conditions: 'Clear' as ForecastCondition,
        icon: 'clear-day' as ForecastIcon,
        air_temperature: 72 + Math.round(Math.sin(i * Math.PI / 12) * 10),
        feels_like: 70 + Math.round(Math.sin(i * Math.PI / 12) * 8),
        precip_probability: 0,
        wind_avg: 5,
        wind_gust: 8,
        wind_direction_cardinal: 'SW',
        local_hour: (new Date().getHours() + i) % 24,
      })),
    },
  };
}
