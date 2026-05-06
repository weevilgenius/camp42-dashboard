/* ========================================================= *\
 *  @camp42/mocks -- barrel export                           *
\* ========================================================= */

// Battery factories & scenarios
export { createBatteryState, createBatteryStatus } from './batteries/factories.js';
export {
  BATTERIES_NORMAL,
  BATTERIES_CHARGING,
  BATTERIES_FULL,
  BATTERIES_LOW,
  BATTERIES_ONE_OFFLINE,
  BATTERIES_BOTH_OFFLINE,
  BATTERIES_HEAVY_LOAD,
} from './batteries/scenarios.js';

// Battery raw API mocks
export {
  createDelta2MaxResponse,
  createDeltaPro3Response,
  createEcoflowDeviceListResponse,
} from './batteries/raw.js';
export type {
  MockDelta2MaxState,
  MockDeltaPro3State,
  MockEcoflowResponse,
  MockDeviceInfo,
} from './batteries/raw.js';

// Weather factories & scenarios
export {
  createWeatherCurrent,
  createWeatherDaily,
  createWeatherHourly,
  createWeatherStatus,
} from './weather/factories.js';
export {
  WEATHER_CLEAR_DAY,
  WEATHER_CLEAR_NIGHT,
  WEATHER_PARTLY_CLOUDY,
  WEATHER_RAINY,
  WEATHER_STORMY,
  WEATHER_SNOWY,
  WEATHER_WINDY,
  WEATHER_HOT,
} from './weather/scenarios.js';

// Weather raw API mocks
export { createBetterForecastResponse } from './weather/raw.js';
export type {
  MockBetterForecast,
  MockBetterForecastCurrentConditions,
  MockBetterForecastDaily,
  MockBetterForecastHourly,
} from './weather/raw.js';

// Mock service layer
export {
  fetchAIStatus,
  fetchBatteryStatus,
  fetchWeatherStatus,
  setMockBatteryScenario,
  setMockWeatherScenario,
} from './service.js';
