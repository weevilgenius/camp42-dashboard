import type {
  WeatherCurrent,
  WeatherDaily,
  WeatherHourly,
  WeatherStatus,
} from '@camp42/shared';

/** Create a mock WeatherCurrent with realistic clear-day defaults. */
export function createWeatherCurrent(overrides?: Partial<WeatherCurrent>): WeatherCurrent {
  return {
    time: Math.floor(Date.now() / 1000),
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
    ...overrides,
  };
}

/** Create a mock WeatherDaily entry with realistic defaults. */
export function createWeatherDaily(overrides?: Partial<WeatherDaily>): WeatherDaily {
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayStartEpoch = Math.floor(dayStart.getTime() / 1000);

  return {
    day_start_local: dayStartEpoch,
    day_num: now.getDate(),
    month_num: now.getMonth() + 1,
    conditions: 'Clear',
    icon: 'clear-day',
    air_temp_high: 85,
    air_temp_low: 58,
    precip_probability: 5,
    sunrise: dayStartEpoch + 6 * 3600,
    sunset: dayStartEpoch + 18.5 * 3600,
    ...overrides,
  };
}

/** Create a mock WeatherHourly entry with realistic defaults. */
export function createWeatherHourly(overrides?: Partial<WeatherHourly>): WeatherHourly {
  const now = new Date();
  const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());

  return {
    time: Math.floor(hourStart.getTime() / 1000),
    conditions: 'Clear',
    icon: 'clear-day',
    air_temperature: 78,
    feels_like: 75,
    precip_probability: 0,
    wind_avg: 5,
    wind_gust: 8,
    wind_direction_cardinal: 'SW',
    local_hour: now.getHours(),
    ...overrides,
  };
}

/** Create a complete mock WeatherStatus with 7 daily and 12 hourly entries. */
export function createWeatherStatus(overrides?: Partial<WeatherStatus>): WeatherStatus {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEpoch = Math.floor(todayStart.getTime() / 1000);
  const DAY = 86400;
  const HOUR = 3600;

  const conditions = ['Clear', 'Partly Cloudy', 'Clear', 'Clear', 'Partly Cloudy', 'Rain Possible', 'Clear'] as const;
  const icons = ['clear-day', 'partly-cloudy-day', 'clear-day', 'clear-day', 'partly-cloudy-day', 'possibly-rainy-day', 'clear-day'] as const;

  const daily = overrides?.daily ?? Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date(todayStart.getTime() + i * DAY * 1000);
    return createWeatherDaily({
      day_start_local: todayEpoch + i * DAY,
      day_num: dayDate.getDate(),
      month_num: dayDate.getMonth() + 1,
      conditions: conditions[i],
      icon: icons[i],
      air_temp_high: 82 + Math.round(Math.sin(i * 0.8) * 6),
      air_temp_low: 55 + Math.round(Math.sin(i * 0.8) * 4),
      precip_probability: i === 5 ? 40 : i === 4 ? 15 : 5,
      sunrise: todayEpoch + i * DAY + 6 * HOUR,
      sunset: todayEpoch + i * DAY + 18.5 * HOUR,
    });
  });

  const hourly = overrides?.hourly ?? Array.from({ length: 12 }, (_, i) => {
    const hour = (now.getHours() + i) % 24;
    const isNight = hour < 6 || hour >= 20;
    return createWeatherHourly({
      time: todayEpoch + (now.getHours() + i) * HOUR,
      conditions: isNight ? 'Clear' : (i > 8 ? 'Partly Cloudy' : 'Clear'),
      icon: isNight ? 'clear-night' : (i > 8 ? 'partly-cloudy-day' : 'clear-day'),
      air_temperature: 72 + Math.round(Math.sin((hour - 6) * Math.PI / 12) * 10),
      feels_like: 70 + Math.round(Math.sin((hour - 6) * Math.PI / 12) * 8),
      precip_probability: 0,
      wind_avg: 3 + Math.round(Math.sin(i * 0.5) * 3),
      wind_gust: 6 + Math.round(Math.sin(i * 0.5) * 5),
      wind_direction_cardinal: 'SW',
      local_hour: hour,
    });
  });

  return {
    current: overrides?.current ?? createWeatherCurrent(),
    daily,
    hourly,
  };
}
