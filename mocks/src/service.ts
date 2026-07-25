import type { AIStatus, BatteryStatus, WeatherStatus } from '@camp42/shared';
import {
  BATTERIES_NORMAL,
  BATTERIES_CHARGING,
  BATTERIES_FULL,
  BATTERIES_LOW,
  BATTERIES_ONE_OFFLINE,
  BATTERIES_BOTH_OFFLINE,
  BATTERIES_HEAVY_LOAD,
} from './batteries/scenarios.js';
import {
  WEATHER_CLEAR_DAY,
  WEATHER_CLEAR_NIGHT,
  WEATHER_PARTLY_CLOUDY,
  WEATHER_RAINY,
  WEATHER_STORMY,
  WEATHER_SNOWY,
  WEATHER_WINDY,
  WEATHER_HOT,
} from './weather/scenarios.js';

/** Simulated network delay in milliseconds. */
const MOCK_DELAY_MS = 300;

const BATTERY_SCENARIOS: Record<string, () => BatteryStatus> = {
  normal: BATTERIES_NORMAL,
  charging: BATTERIES_CHARGING,
  full: BATTERIES_FULL,
  low: BATTERIES_LOW,
  'one-offline': BATTERIES_ONE_OFFLINE,
  'both-offline': BATTERIES_BOTH_OFFLINE,
  'heavy-load': BATTERIES_HEAVY_LOAD,
};

const WEATHER_SCENARIOS: Record<string, () => WeatherStatus> = {
  'clear-day': WEATHER_CLEAR_DAY,
  'clear-night': WEATHER_CLEAR_NIGHT,
  'partly-cloudy': WEATHER_PARTLY_CLOUDY,
  rainy: WEATHER_RAINY,
  stormy: WEATHER_STORMY,
  snowy: WEATHER_SNOWY,
  windy: WEATHER_WINDY,
  hot: WEATHER_HOT,
};

/**
 * Read a query parameter from the current URL.
 *
 * Uses `?battery=<key>` and `?weather=<key>` to select scenarios.
 * Falls back to the default scenario when the param is absent or unrecognised.
 *
 * Available battery keys: normal, charging, full, low, one-offline, both-offline, heavy-load
 * Available weather keys: clear-day, clear-night, partly-cloudy, rainy, stormy, snowy, windy, hot
 */
const getScenarioFromParams = <T>(param: string, map: Record<string, () => T>, fallback: () => T): () => T => {
  const params = new URLSearchParams(window.location.search);
  const key = params.get(param);
  if (key && key in map) {
    console.log(`[mock] ${param} scenario: ${key}`);
    return map[key];
  }
  return fallback;
};

let batteryScenario: () => BatteryStatus = BATTERIES_NORMAL;
let weatherScenario: () => WeatherStatus = WEATHER_CLEAR_DAY;

/** Set the active battery scenario for subsequent fetches. */
export function setMockBatteryScenario(scenario: () => BatteryStatus): void {
  batteryScenario = scenario;
}

/** Set the active weather scenario for subsequent fetches. */
export function setMockWeatherScenario(scenario: () => WeatherStatus): void {
  weatherScenario = scenario;
}

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** Drop-in replacement for the real fetchBatteryStatus. Returns mock data after a short delay. */
export async function fetchBatteryStatus(): Promise<BatteryStatus> {
  await delay(MOCK_DELAY_MS);
  return getScenarioFromParams('battery', BATTERY_SCENARIOS, batteryScenario)();
}

/** Drop-in replacement for the real fetchWeatherStatus. Returns mock data after a short delay. */
export async function fetchWeatherStatus(): Promise<WeatherStatus> {
  await delay(MOCK_DELAY_MS);
  return getScenarioFromParams('weather', WEATHER_SCENARIOS, weatherScenario)();
}

/** Drop-in replacement for the real fetchAIStatus. Returns a mock response after a short delay. */
export async function fetchAIStatus(): Promise<AIStatus> {
  await delay(MOCK_DELAY_MS);
  return {
    name: "Bilbo",
    message: 'The air is brisk and the breeze is picking up from the west, so I shall pack an extra wool waistcoat before I venture into the woods. It looks to be a clear evening for adventure, and one must always be prepared for a bit of a chill when the stars begin to peek through the clouds.',
  };
}

/** Drop-in replacement for the real fetchPresence. */
export async function fetchPresence(): Promise<Record<string, number>> {
  await delay(MOCK_DELAY_MS);
  return { Cathie: 0, Barry: 3 * 60 * 60 };
}
