/* ========================================================= *\
 *  Battery State                                            *
\* ========================================================= */

/** Types of supported Ecoflow batteries */
export enum BatteryType {
  River_2_Pro = "RIVER 2 Pro",
  Delta_2_Max = "DELTA 2 Max",
  Delta_3_Pro = "DELTA Pro 3",
}

/** State of a battery */
export interface BatteryState {
  /** Type (model) of battery */
  type: BatteryType;
  /** Battery name */
  name: string;
  /** Serial number */
  sn: string;
  /** Is the battery online now? */
  online: boolean;
  /** System and charge state of battery */
  state: {
    /** Charge state of battery as a percentage */
    charge_pct: number;
    /** Is the 12V DC panel turned on? */
    dc_on: boolean;
    /** Power currently used by DC panel (watts) */
    dc_watts: number;
    /** Is the AC panel turned on? For Delta Pro 3, this is the low voltage AC panel. */
    ac_on: boolean;
    /** Power currently used by AC panel (watts) */
    ac_watts: number;
    /** Total power coming into the battery, all sources (watts) */
    total_input: number;
    /** Total power coming out of the battery, all sources (watts) */
    total_output: number;
  };
}


/* ========================================================= *\
 *  Weather State                                            *
\* ========================================================= */

/** Human-readable weather condition strings returned by the Tempest forecast API. */
export type ForecastCondition =
  | 'Clear'
  | 'Cloudy'
  | 'Foggy'
  | 'Heavy Rain'
  | 'Heavy Snow'
  | 'Light Rain'
  | 'Light Snow'
  | 'Partly Cloudy'
  | 'Rain Likely'
  | 'Rain Possible'
  | 'Sleet'
  | 'Sleet Likely'
  | 'Sleet Possible'
  | 'Snow'
  | 'Snow Likely'
  | 'Snow Possible'
  | 'Thunderstorms'
  | 'Thunderstorms Likely'
  | 'Thunderstorms Possible'
  | 'Very Light Rain'
  | 'Windy'
  | 'Wintry Mix'
  | 'Wintry Mix Likely'
  | 'Wintry Mix Possible';

/** Weather icon identifiers returned by the Tempest forecast API. */
export type ForecastIcon =
  | 'clear-day'
  | 'clear-night'
  | 'cloudy'
  | 'foggy'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'possibly-rainy-day'
  | 'possibly-rainy-night'
  | 'possibly-sleet-day'
  | 'possibly-sleet-night'
  | 'possibly-snow-day'
  | 'possibly-snow-night'
  | 'possibly-thunderstorm-day'
  | 'possibly-thunderstorm-night'
  | 'rainy'
  | 'sleet'
  | 'snow'
  | 'thunderstorm'
  | 'windy';

/** Current weather conditions, slimmed from the Tempest BetterForecast response. */
export interface WeatherCurrent {
  /** Unix epoch (seconds) of this conditions snapshot. */
  time: number;
  /** Human-readable weather conditions summary, e.g. "Clear", "Rain Likely". */
  conditions: ForecastCondition;
  /** Weather icon identifier, e.g. "clear-day", "rainy". */
  icon: ForecastIcon;
  /** Air temperature. */
  air_temperature: number;
  /** Apparent temperature accounting for wind and humidity. */
  feels_like: number;
  /** Relative humidity (%). */
  relative_humidity: number;
  /** Average wind speed. */
  wind_avg: number;
  /** Maximum wind gust. */
  wind_gust: number;
  /** Cardinal wind direction, e.g. "NE", "SSW". */
  wind_direction_cardinal: string;
  /** Probability of precipitation (%). */
  precip_probability: number;
  /** Accumulated precipitation since local midnight. */
  precip_accum_local_day: number;
}

/** A single day in the daily forecast, slimmed from the Tempest BetterForecast response. */
export interface WeatherDaily {
  /** Unix epoch (seconds) of the start of this local day. */
  day_start_local: number;
  /** Day of the month (1-31). */
  day_num: number;
  /** Month number (1-12). */
  month_num: number;
  /** Human-readable conditions summary. */
  conditions: ForecastCondition;
  /** Weather icon identifier. */
  icon: ForecastIcon;
  /** Forecasted high temperature. */
  air_temp_high: number;
  /** Forecasted low temperature. */
  air_temp_low: number;
  /** Probability of precipitation (%). */
  precip_probability: number;
  /** Unix epoch (seconds) of sunrise. */
  sunrise: number;
  /** Unix epoch (seconds) of sunset. */
  sunset: number;
}

/** A single hour in the hourly forecast, slimmed from the Tempest BetterForecast response. */
export interface WeatherHourly {
  /** Unix epoch (seconds) of this forecast hour. */
  time: number;
  /** Human-readable conditions summary. */
  conditions: ForecastCondition;
  /** Weather icon identifier. */
  icon: ForecastIcon;
  /** Forecasted air temperature. */
  air_temperature: number;
  /** Apparent temperature. */
  feels_like: number;
  /** Probability of precipitation (%). */
  precip_probability: number;
  /** Average wind speed. */
  wind_avg: number;
  /** Maximum wind gust. */
  wind_gust: number;
  /** Cardinal wind direction. */
  wind_direction_cardinal: string;
  /** Hour of the day in local time (0-23). */
  local_hour: number;
}


/* ========================================================= *\
 *  Cloud Function Interface                                 *
\* ========================================================= */

/** What type of status is being requested? */
export enum StatusType {
  Batteries = "batteries",
  Weather = "weather",
}

/** Request status */
export interface StatusRequest<T extends StatusType = StatusType> {
  type: T;
}

/** Response from battery status request */
export interface BatteryStatus {
  hank: BatteryState;
  bertha: BatteryState;
}

/** Response from weather status request */
export interface WeatherStatus {
  /** Current weather conditions. */
  current: WeatherCurrent;
  /** Daily forecast. */
  daily: WeatherDaily[];
  /** Hourly forecast. */
  hourly: WeatherHourly[];
}

/** Maps each StatusType to its corresponding response payload */
interface StatusPayloadMap {
  [StatusType.Batteries]: BatteryStatus;
  [StatusType.Weather]: WeatherStatus;
}

/** Response from status request */
export interface StatusResponse<T extends StatusType = StatusType> {
  code: "SUCCESS" | "FAILED";
  error?: string;
  status?: StatusPayloadMap[T];
}

