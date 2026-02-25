import type { WeatherStatus } from '@camp42/shared';
import { withCache } from './utils.js';
import { createTempestClient } from './libTempest.js';


// this is the station at Camp 42
const STATION_ID = 136917;

/**
 * Gets the current and forecasted weather from Tempest
 * @param token Tempest API token
 * @param days Number of days in forecast (1 - 10)
 * @param hours Number of hours in forecast (1 - 24)
 * @param verbose Flag for verbose logging
 * @returns Weather status and forecast
 */
async function fetchWeatherState(token: string, days = 7, hours = 12, verbose = false): Promise<WeatherStatus> {

  if (!token) {
    throw new Error('Missing Tempest API token');
  }

  if (verbose) { console.log('fetching weather from Tempest'); }

  const client = createTempestClient(token);

  const forecast = await client.getForecast(STATION_ID);
  const current = forecast.current_conditions;

  const status: WeatherStatus = {
    current: {
      time: current.time,
      conditions: current.conditions,
      icon: current.icon,
      air_temperature: current.air_temperature,
      feels_like: current.feels_like,
      relative_humidity: current.relative_humidity,
      wind_avg: current.wind_avg,
      wind_gust: current.wind_gust,
      wind_direction_cardinal: current.wind_direction_cardinal,
      precip_probability: current.precip_probability,
      precip_accum_local_day: current.precip_accum_local_day,
    },
    daily: forecast.forecast.daily.slice(0, days).map((d) => ({
      day_start_local: d.day_start_local,
      day_num: d.day_num,
      month_num: d.month_num,
      conditions: d.conditions,
      icon: d.icon,
      air_temp_high: d.air_temp_high,
      air_temp_low: d.air_temp_low,
      precip_probability: d.precip_probability,
      sunrise: d.sunrise,
      sunset: d.sunset,
    })),
    hourly: forecast.forecast.hourly.slice(0, hours).map((h) => ({
      time: h.time,
      conditions: h.conditions,
      icon: h.icon,
      air_temperature: h.air_temperature,
      feels_like: h.feels_like,
      precip_probability: h.precip_probability,
      wind_avg: h.wind_avg,
      wind_gust: h.wind_gust,
      wind_direction_cardinal: h.wind_direction_cardinal,
      local_hour: h.local_hour,
    })),
  };

  return status;
};

/**
 * Gets the current and forecasted weather from Tempest
 * @param token Tempest API token
 * @param days Number of days in forecast: 1 - 10, default 7
 * @param hours Number of hours in forecast: 1 - 24, default 12
 * @param verbose Flag for verbose logging (optional)
 * @returns Weather status and forecast
 */
export const getWeatherState = withCache(fetchWeatherState, 5 * 60 * 1000);
