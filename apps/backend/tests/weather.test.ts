import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { WeatherStatus } from '@camp42/shared';

// --------------------------------------------------------------------------
// We test the weather module by mocking its two dependencies:
//   1. libTempest (the Tempest API client)
//   2. utils (the cache wrapper -- replaced with a passthrough)
// --------------------------------------------------------------------------

// mock the cache to be a simple passthrough so tests always call the real fetch
vi.mock('../src/utils.js', () => ({
  withCache: <T, A extends unknown[]>(fn: (...args: A) => Promise<T>) => fn,
}));

// mock the Tempest client so no real HTTP requests are made
const mockGetForecast = vi.fn();
vi.mock('../src/libTempest.js', () => ({
  createTempestClient: () => ({ getForecast: mockGetForecast }),
}));

// import after mocks are set up
const { getWeatherState } = await import('../src/weather.js');

describe('getWeatherState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws when the token is empty', async () => {
    await expect(getWeatherState('', 7, 12)).rejects.toThrow('Missing Tempest API token');
  });

  it('maps current conditions from the Tempest forecast response', async () => {
    const fakeForecast = buildFakeForecast();
    mockGetForecast.mockResolvedValue(fakeForecast);

    const result: WeatherStatus = await getWeatherState('tok', 7, 12);

    expect(result.current.conditions).toBe('Clear');
    expect(result.current.icon).toBe('clear-day');
    expect(result.current.air_temperature).toBe(78);
  });

  it('slices daily forecasts to the requested number of days', async () => {
    mockGetForecast.mockResolvedValue(buildFakeForecast());

    const result = await getWeatherState('tok', 3, 12);

    expect(result.daily).toHaveLength(3);
  });

  it('slices hourly forecasts to the requested number of hours', async () => {
    mockGetForecast.mockResolvedValue(buildFakeForecast());

    const result = await getWeatherState('tok', 7, 5);

    expect(result.hourly).toHaveLength(5);
  });

  it('maps all expected daily fields', async () => {
    mockGetForecast.mockResolvedValue(buildFakeForecast());

    const result = await getWeatherState('tok', 1, 1);

    const day = result.daily[0];
    expect(day).toHaveProperty('day_start_local');
    expect(day).toHaveProperty('day_num');
    expect(day).toHaveProperty('month_num');
    expect(day).toHaveProperty('conditions');
    expect(day).toHaveProperty('icon');
    expect(day).toHaveProperty('air_temp_high');
    expect(day).toHaveProperty('air_temp_low');
    expect(day).toHaveProperty('precip_probability');
    expect(day).toHaveProperty('sunrise');
    expect(day).toHaveProperty('sunset');
  });

  it('maps all expected hourly fields', async () => {
    mockGetForecast.mockResolvedValue(buildFakeForecast());

    const result = await getWeatherState('tok', 1, 1);

    const hour = result.hourly[0];
    expect(hour).toHaveProperty('time');
    expect(hour).toHaveProperty('conditions');
    expect(hour).toHaveProperty('icon');
    expect(hour).toHaveProperty('air_temperature');
    expect(hour).toHaveProperty('feels_like');
    expect(hour).toHaveProperty('precip_probability');
    expect(hour).toHaveProperty('wind_avg');
    expect(hour).toHaveProperty('wind_gust');
    expect(hour).toHaveProperty('wind_direction_cardinal');
    expect(hour).toHaveProperty('local_hour');
  });

  it('does not include extra fields from the raw forecast', async () => {
    mockGetForecast.mockResolvedValue(buildFakeForecast());

    const result = await getWeatherState('tok', 1, 1);

    // hourly entries in the raw response include sea_level_pressure, station_pressure, etc.
    // the weather module should only extract the fields listed in WeatherHourly
    const hour = result.hourly[0] as unknown as Record<string, unknown>;
    expect(hour).not.toHaveProperty('sea_level_pressure');
    expect(hour).not.toHaveProperty('station_pressure');
  });
});


/* ========================================================= *\
 *  Test helpers                                             *
\* ========================================================= */

/** Build a minimal BetterForecast-shaped object matching the Tempest response. */
function buildFakeForecast() {
  const now = Math.floor(Date.now() / 1000);
  return {
    current_conditions: {
      time: now,
      conditions: 'Clear' as const,
      icon: 'clear-day' as const,
      air_temperature: 78,
      feels_like: 75,
      relative_humidity: 35,
      wind_avg: 5,
      wind_gust: 8,
      wind_direction_cardinal: 'SW',
      precip_probability: 0,
      precip_accum_local_day: 0,
    },
    forecast: {
      daily: Array.from({ length: 10 }, (_, i) => ({
        day_start_local: now + i * 86400,
        day_num: i + 1,
        month_num: 6,
        conditions: 'Clear' as const,
        icon: 'clear-day' as const,
        air_temp_high: 85,
        air_temp_low: 58,
        precip_probability: 5,
        sunrise: now + i * 86400 + 6 * 3600,
        sunset: now + i * 86400 + 18 * 3600,
      })),
      hourly: Array.from({ length: 24 }, (_, i) => ({
        time: now + i * 3600,
        conditions: 'Clear' as const,
        icon: 'clear-day' as const,
        air_temperature: 72 + i,
        feels_like: 70 + i,
        precip_probability: 0,
        wind_avg: 5,
        wind_gust: 8,
        wind_direction_cardinal: 'SW',
        local_hour: i,
        // extra fields that should NOT appear in the output
        sea_level_pressure: 1013.25,
        station_pressure: 1010.0,
      })),
    },
  };
}
