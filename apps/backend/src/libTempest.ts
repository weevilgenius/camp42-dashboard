/* ========================================================= *\
 *  Tempest Response Types                                   *
\* ========================================================= */

/** Top-level response wrapper returned by both station endpoints. */
export interface StationSet {
  /** API status indicator. */
  status: Status;
  /** Array of station objects. */
  stations: Station[];
}

/** API response status. */
export interface Status {
  /** Numeric status code (0 = success). */
  status_code: number;
  /** Human-readable status description, e.g. "SUCCESS". */
  status_message?: string;
}

/**
 * A Tempest weather station. Each user can create multiple stations. A station
 * contains metadata about itself and all the devices attached to it.
 */
export interface Station {
  /** Unique numeric identifier for this station. */
  station_id: number;
  /** Owner-assigned station name. */
  name: string;
  /** Publicly visible name shown on the WeatherFlow map. */
  public_name?: string;
  /** Station latitude in decimal degrees. */
  latitude: number;
  /** Station longitude in decimal degrees. */
  longitude: number;
  /** Unix epoch (seconds) when the station was first registered. */
  created_epoch: number;
  /** Unix epoch (seconds) of the most recent configuration change. */
  last_modified_epoch: number;
  /** Numeric location identifier (often matches station_id). */
  location_id: number;
  /** Whether the station is operating in local-only (hub-direct) mode. */
  is_local_mode: boolean;
  /** Station state flag (1 = active). */
  state: number;
  /** IANA timezone string, e.g. "America/Los_Angeles". */
  timezone: string;
  /** UTC offset in minutes, e.g. -480 for PST. */
  timezone_offset_minutes: number;
  /** Elevation and data-sharing metadata. */
  station_meta?: StationMeta;
  /** Physical devices (hubs and sensors) attached to this station. */
  devices?: Device[];
  /** Mapping of sensor data items to their source devices. */
  station_items?: StationItem[];
  /** Sensor capabilities; only present in single-station responses. */
  capabilities?: Capability[];
}

/** Elevation and sharing metadata for a station. */
export interface StationMeta {
  /** Station elevation above sea level in meters. */
  elevation: number;
  /** Whether observation data is shared with WeatherFlow. */
  share_with_wf?: boolean;
  /** Whether observation data is shared with Weather Underground. */
  share_with_wu?: boolean;
}

/**
 * A physical device (hub or sensor) attached to a station. A device can only
 * belong to one station at a time. Only devices with a `serial_number` can
 * send new observations; a missing serial number indicates the device is no
 * longer active.
 */
export interface Device {
  /** Unique numeric identifier for this device. */
  device_id: number;
  /** Hardware serial number. Absent if the device is no longer active. */
  serial_number?: string;
  /** Placement and naming metadata for this device. */
  device_meta?: DeviceMeta;
  /** Hardware product type: AR = AIR, HB = Hub, SK = SKY, ST = Tempest. */
  device_type?: 'AR' | 'HB' | 'SK' | 'ST';
  /** Board hardware revision string. */
  hardware_revision?: string;
  /** Currently installed firmware version string. */
  firmware_revision?: string;
  /** Location this device is associated with. */
  location_id?: number;
  /** User-configurable device settings (e.g. precipitation display). */
  device_settings?: DeviceSettings;
  /** Free-text notes attached to this device by the owner. */
  notes?: string;
}

/** Per-device user-configurable settings. */
export interface DeviceSettings {
  /** Whether to display the rain-check corrected precipitation value. */
  show_precip_final?: boolean;
}

/** An item linking a device sensor capability to a station. */
export interface StationItem {
  /** Legacy location-based item identifier. */
  location_item_id: number;
  /** Unique identifier for this station item entry. */
  station_item_id: number;
  /** Parent station this item belongs to. */
  station_id: number;
  /** Location this item is associated with. */
  location_id: number;
  /** Device that provides this data item. */
  device_id: number;
  /** Sensor data category, e.g. "wind", "rain", "lightning", "diagnostics". */
  item: string;
  /** Display sort order in the UI; absent for non-display items like diagnostics. */
  sort?: number;
}

/** Physical device placement and naming metadata. */
export interface DeviceMeta {
  /** Sensor height above ground level in meters. */
  agl: number;
  /** User-assigned device name (defaults to the serial number). */
  name: string;
  /** Whether the device is mounted indoors or outdoors. */
  environment: 'indoor' | 'outdoor';
  /** Name of the Wi-Fi network the device connects through. */
  wifi_network_name?: string;
}

/** A sensor capability reported by a station in single-station responses. */
export interface Capability {
  /** Sensor data category, e.g. "wind", "rain", "barometric_pressure". */
  capability: string;
  /** Device that provides this capability. */
  device_id: number;
  /** Mounting environment of the providing device ("indoor" or "outdoor"). */
  environment: string;
  /** Sensor height above ground level in meters; present for pressure sensors. */
  agl?: number;
  /** Whether rain-check corrected precipitation is displayed. */
  show_precip_final?: boolean;
}

/**
 * Federated observation response from `/observations/station/{station_id}`.
 * This observation is composed from the latest readings of each device in the
 * station. When a user has multiple devices of the same type, the one
 * designated as primary is used.
 */
export interface StationObservation {
  /** API status indicator. */
  status: Status;
  /**
   * Unit preferences of the station owner's account. Note: these represent the
   * owner's display preferences, not the units of the observation values in the
   * API response (which are always metric).
   */
  station_units: StationUnits;
  /** Station that produced these observations. */
  station_id: number;
  /** Owner-assigned station name. */
  station_name: string;
  /** Publicly visible station name. */
  public_name: string;
  /** Station latitude in decimal degrees. */
  latitude: number;
  /** Station longitude in decimal degrees. */
  longitude: number;
  /** IANA timezone string, e.g. "America/Los_Angeles". */
  timezone: string;
  /** Station elevation above sea level in meters. */
  elevation: number;
  /** Whether this station's observations are publicly shared. */
  is_public: boolean;
  /** Most recent observation snapshots (typically a single element). */
  obs: ObservationValues[];
  /** Names of the observation keys sourced from outdoor sensors. */
  outdoor_keys: string[];
}

/**
 * Unit preferences for the station owner's account. These reflect the owner's
 * display settings, not the units of the values in the API response.
 */
export interface StationUnits {
  /** Temperature unit, e.g. "f" or "c". */
  units_temp: string;
  /** Wind speed unit, e.g. "mph" or "kph". */
  units_wind: string;
  /** Precipitation unit, e.g. "in" or "mm". */
  units_precip: string;
  /** Pressure unit, e.g. "inhg" or "mb". */
  units_pressure: string;
  /** Distance unit, e.g. "mi" or "km". */
  units_distance: string;
  /** Wind direction format, e.g. "cardinal" or "degrees". */
  units_direction: string;
  /** Catch-all unit system for other measurements, e.g. "imperial" or "metric". */
  units_other: string;
}

/**
 * A single federated observation snapshot from a station. This is composed from
 * the latest readings of each device in the station, with the primary device
 * used when multiple devices of the same type exist.
 *
 * Outdoor observation fields have no suffix. Indoor observation fields are
 * suffixed with `_indoor`. All fields except `timestamp` are optional because
 * their presence depends on which sensors are attached; the `outdoor_keys`
 * array on the parent response lists which outdoor fields are populated.
 */
export interface ObservationValues {
  /** Unix epoch (seconds) when this observation was recorded. */
  timestamp: number;

  /* --- Temperature & humidity (outdoor) ---------------------------------- */

  /** Air temperature. */
  air_temperature?: number;
  /** Relative humidity (%). */
  relative_humidity?: number;
  /** Dew point temperature. */
  dew_point?: number;
  /** Wet-bulb temperature. */
  wet_bulb_temperature?: number;
  /** Wet-bulb globe temperature (heat stress index). */
  wet_bulb_globe_temperature?: number;
  /** Apparent temperature accounting for wind and humidity. */
  feels_like?: number;
  /** Heat index (perceived temperature in warm conditions). */
  heat_index?: number;
  /** Wind chill (perceived temperature in cold/windy conditions). */
  wind_chill?: number;
  /** Difference between air temperature and wet-bulb temperature. */
  delta_t?: number;
  /** Air density in kg/m^3. */
  air_density?: number;

  /* --- Pressure (outdoor) ------------------------------------------------ */

  /** Raw barometric pressure at station elevation. */
  barometric_pressure?: number;
  /** Barometric pressure at station level (same sensor, uncompensated). */
  station_pressure?: number;
  /** Pressure adjusted to sea level. */
  sea_level_pressure?: number;
  /** Short-term pressure trend. */
  pressure_trend?: PressureTrend;

  /* --- Wind (outdoor) ---------------------------------------------------- */

  /** Average wind speed over the reporting interval. */
  wind_avg?: number;
  /** Wind direction in degrees (0-360). */
  wind_direction?: number;
  /** Maximum wind gust during the reporting interval. */
  wind_gust?: number;
  /** Minimum wind speed (lull) during the reporting interval. */
  wind_lull?: number;

  /* --- Precipitation (outdoor) ------------------------------------------- */

  /** Precipitation amount during the most recent minute. */
  precip?: number;
  /** Accumulated precipitation over the last hour. */
  precip_accum_last_1hr?: number;
  /** Accumulated precipitation since local midnight. */
  precip_accum_local_day?: number;
  /** Rain-check corrected accumulation since local midnight. */
  precip_accum_local_day_final?: number;
  /** Accumulated precipitation for the previous local day. */
  precip_accum_local_yesterday?: number;
  /** Rain-check corrected accumulation for the previous local day. */
  precip_accum_local_yesterday_final?: number;
  /** Rain-check analysis type for yesterday (0 = none, 1+ = corrected). */
  precip_analysis_type_yesterday?: number;
  /** Minutes of detected precipitation since local midnight. */
  precip_minutes_local_day?: number;
  /** Minutes of detected precipitation for the previous local day. */
  precip_minutes_local_yesterday?: number;
  /** Rain-check corrected precipitation minutes for the previous day. */
  precip_minutes_local_yesterday_final?: number;

  /* --- Solar & UV (outdoor) ---------------------------------------------- */

  /** Solar radiation in W/m^2. */
  solar_radiation?: number;
  /** UV index. */
  uv?: number;
  /** Ambient light brightness in lux. */
  brightness?: number;

  /* --- Lightning (outdoor) ----------------------------------------------- */

  /** Total lightning strikes detected during the reporting interval. */
  lightning_strike_count?: number;
  /** Lightning strikes detected in the last hour. */
  lightning_strike_count_last_1hr?: number;
  /** Lightning strikes detected in the last 3 hours. */
  lightning_strike_count_last_3hr?: number;
  /** Unix epoch of the most recent lightning strike. */
  lightning_strike_last_epoch?: number;
  /** Distance to the most recent lightning strike in km. */
  lightning_strike_last_distance?: number;

  /* --- Indoor sensor readings -------------------------------------------- */
  /* Present when a device is designated as indoor. All fields mirror their  */
  /* outdoor counterparts with an "_indoor" suffix.                          */

  /** Indoor air temperature. */
  air_temperature_indoor?: number;
  /** Indoor relative humidity (%). */
  relative_humidity_indoor?: number;
  /** Indoor dew point temperature. */
  dew_point_indoor?: number;
  /** Indoor wet-bulb temperature. */
  wet_bulb_temperature_indoor?: number;
  /** Indoor wet-bulb globe temperature. */
  wet_bulb_globe_temperature_indoor?: number;
  /** Indoor feels-like temperature. */
  feels_like_indoor?: number;
  /** Indoor heat index. */
  heat_index_indoor?: number;
  /** Indoor wind chill. */
  wind_chill_indoor?: number;
  /** Indoor delta-T. */
  delta_t_indoor?: number;
  /** Indoor air density in kg/m^3. */
  air_density_indoor?: number;
  /** Indoor barometric pressure. */
  barometric_pressure_indoor?: number;
  /** Indoor station pressure. */
  station_pressure_indoor?: number;
  /** Indoor sea-level pressure. */
  sea_level_pressure_indoor?: number;
  /** Indoor pressure trend. */
  pressure_trend_indoor?: PressureTrend;
  /** Indoor average wind speed. */
  wind_avg_indoor?: number;
  /** Indoor wind direction in degrees. */
  wind_direction_indoor?: number;
  /** Indoor wind gust. */
  wind_gust_indoor?: number;
  /** Indoor wind lull. */
  wind_lull_indoor?: number;
  /** Indoor precipitation in the most recent minute. */
  precip_indoor?: number;
  /** Indoor accumulated precipitation over the last hour. */
  precip_accum_last_1hr_indoor?: number;
  /** Indoor solar radiation in W/m^2. */
  solar_radiation_indoor?: number;
  /** Indoor UV index. */
  uv_indoor?: number;
  /** Indoor brightness in lux. */
  brightness_indoor?: number;
  /** Indoor lightning strike count. */
  lightning_strike_count_indoor?: number;
  /** Indoor lightning strikes in the last hour. */
  lightning_strike_count_last_1hr_indoor?: number;
  /** Indoor lightning strikes in the last 3 hours. */
  lightning_strike_count_last_3hr_indoor?: number;
  /** Indoor epoch of the most recent lightning strike. */
  lightning_strike_last_epoch_indoor?: number;
  /** Indoor distance to the most recent lightning strike in km. */
  lightning_strike_last_distance_indoor?: number;
}

/** Response from the `/better_forecast` endpoint. */
export interface BetterForecast {
  /** API status indicator. */
  status: Status;
  /** Current weather conditions at the station. */
  current_conditions: BetterForecastCurrentConditions;
  /** Daily and hourly forecast data. */
  forecast: BetterForecastForecast;
  /** Measurement units used in this response (controlled by request params). */
  units: BetterForecastUnits;
  /** Station latitude in decimal degrees. */
  latitude: number;
  /** Station longitude in decimal degrees. */
  longitude: number;
  /** Human-readable station location name. */
  location_name: string;
  /** Numeric identifier for the data source providing current conditions. */
  source_id_conditions: number;
  /** Summary metadata about the station. */
  station: BetterForecastStation;
  /** IANA timezone string, e.g. "America/Los_Angeles". */
  timezone: string;
  /** UTC offset in minutes, e.g. -480 for PST. */
  timezone_offset_minutes: number;
}

/** Abbreviated station metadata returned in the better forecast response. */
export interface BetterForecastStation {
  /** Sensor height above ground level in meters. */
  agl: number;
  /** Station elevation above sea level in meters. */
  elevation: number;
  /** Whether the station is currently online and reporting. */
  is_station_online: boolean;
  /** Station state flag (1 = active). */
  state: number;
  /** Unique numeric identifier for this station. */
  station_id: number;
}

/** Current weather conditions at the station. */
export interface BetterForecastCurrentConditions {
  /** Unix epoch (seconds) of this conditions snapshot. */
  time: number;
  /** Human-readable weather conditions summary. */
  conditions: ForecastCondition;
  /** Weather icon identifier. */
  icon: ForecastIcon;

  /* --- Temperature & humidity -------------------------------------------- */

  /** Air temperature. */
  air_temperature: number;
  /** Apparent temperature accounting for wind and humidity. */
  feels_like: number;
  /** Dew point temperature. */
  dew_point: number;
  /** Wet-bulb temperature. */
  wet_bulb_temperature: number;
  /** Wet-bulb globe temperature (heat stress index). */
  wet_bulb_globe_temperature: number;
  /** Relative humidity (%). */
  relative_humidity: number;
  /** Difference between air temperature and wet-bulb temperature. */
  delta_t: number;
  /** Air density in kg/m^3. */
  air_density: number;

  /* --- Pressure ---------------------------------------------------------- */

  /** Pressure adjusted to sea level. */
  sea_level_pressure: number;
  /** Barometric pressure at station level. */
  station_pressure: number;
  /** Short-term pressure trend. */
  pressure_trend: PressureTrend;

  /* --- Wind -------------------------------------------------------------- */

  /** Average wind speed over the reporting interval. */
  wind_avg: number;
  /** Wind direction in degrees (0-360). */
  wind_direction: number;
  /** Cardinal wind direction. */
  wind_direction_cardinal: CardinalDirection;
  /** Maximum wind gust during the reporting interval. */
  wind_gust: number;

  /* --- Solar & UV -------------------------------------------------------- */

  /** Solar radiation in W/m^2. */
  solar_radiation: number;
  /** UV index. */
  uv: number;
  /** Ambient light brightness in lux. */
  brightness: number;

  /* --- Lightning --------------------------------------------------------- */

  /** Lightning strikes detected in the last hour. */
  lightning_strike_count_last_1hr: number;
  /** Lightning strikes detected in the last 3 hours. */
  lightning_strike_count_last_3hr: number;
  /** Distance to the most recent lightning strike. */
  lightning_strike_last_distance: number;
  /** Human-readable distance range, e.g. "21 - 24 mi". */
  lightning_strike_last_distance_msg: string;
  /** Unix epoch of the most recent lightning strike. */
  lightning_strike_last_epoch: number;

  /* --- Precipitation ----------------------------------------------------- */

  /** Probability of precipitation (%). */
  precip_probability: number;
  /** Accumulated precipitation since local midnight. */
  precip_accum_local_day: number;
  /** Accumulated precipitation for the previous local day. */
  precip_accum_local_yesterday: number;
  /** Minutes of detected precipitation since local midnight. */
  precip_minutes_local_day: number;
  /** Minutes of detected precipitation for the previous local day. */
  precip_minutes_local_yesterday: number;
  /** Whether today's precipitation has been corrected by rain-check. */
  is_precip_local_day_rain_check: boolean;
  /** Whether yesterday's precipitation has been corrected by rain-check. */
  is_precip_local_yesterday_rain_check: boolean;
}

/** Container for daily and hourly forecast arrays. */
export interface BetterForecastForecast {
  /** 10-day daily forecast. */
  daily: BetterForecastDailyForecast[];
  /** Hourly forecast (typically ~240 hours). */
  hourly: BetterForecastHourlyForecast[];
}

/**
 * Measurement units used in the better forecast response. Unlike
 * `StationUnits`, these reflect the units requested in the API call and match
 * the values in the response.
 */
export interface BetterForecastUnits {
  /** Temperature unit, e.g. "f" or "c". */
  units_temp: string;
  /** Wind speed unit, e.g. "mph" or "kph". */
  units_wind: string;
  /** Precipitation unit, e.g. "in" or "mm". */
  units_precip: string;
  /** Pressure unit, e.g. "inhg" or "mb". */
  units_pressure: string;
  /** Distance unit, e.g. "mi" or "km". */
  units_distance: string;
  /** Brightness unit, e.g. "lux". */
  units_brightness: string;
  /** Solar radiation unit, e.g. "w/m2". */
  units_solar_radiation: string;
  /** Catch-all unit system for other measurements, e.g. "metric". */
  units_other: string;
  /** Air density unit, e.g. "kg/m3". */
  units_air_density: string;
}

/** A single day in the daily forecast. */
export interface BetterForecastDailyForecast {
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
  /** Unix epoch (seconds) of sunrise. */
  sunrise: number;
  /** Unix epoch (seconds) of sunset. */
  sunset: number;
  /** Forecasted high temperature. */
  air_temp_high: number;
  /** Forecasted low temperature. */
  air_temp_low: number;
  /** Probability of precipitation (%). */
  precip_probability: number;
  /** Precipitation icon identifier. */
  precip_icon: ForecastPrecipIcon;
  /** Precipitation type. */
  precip_type: ForecastPrecipType;
}

/** A single hour in the hourly forecast. */
export interface BetterForecastHourlyForecast {
  /** Unix epoch (seconds) of this forecast hour. */
  time: number;
  /** Human-readable conditions summary. */
  conditions: ForecastCondition;
  /** Weather icon identifier. */
  icon: ForecastIcon;
  /** Forecasted air temperature. */
  air_temperature: number;
  /** Sea-level pressure. */
  sea_level_pressure: number;
  /** Barometric pressure at station level. */
  station_pressure: number;
  /** Relative humidity (%). */
  relative_humidity: number;
  /** Forecasted precipitation amount. */
  precip: number;
  /** Probability of precipitation (%). */
  precip_probability: number;
  /** Precipitation icon identifier. */
  precip_icon: ForecastPrecipIcon;
  /** Precipitation type. */
  precip_type: ForecastPrecipType;
  /** Average wind speed. */
  wind_avg: number;
  /** Wind direction in degrees (0-360). */
  wind_direction: number;
  /** Cardinal wind direction. */
  wind_direction_cardinal: CardinalDirection;
  /** Maximum wind gust. */
  wind_gust: number;
  /** UV index. */
  uv: number;
  /** Apparent temperature. */
  feels_like: number;
  /** Hour of the day in local time (0-23). */
  local_hour: number;
  /** Day of the month in local time (1-31). */
  local_day: number;
}

// Request parameter unit types

/** Temperature unit for API requests. */
export type TempestTemperatureUnit = 'f' | 'c';
/** Wind speed unit for API requests. */
export type TempestWindUnit = 'mph' | 'kph' | 'kts' | 'mps' | 'bft' | 'lfm';
/** Pressure unit for API requests. */
export type TempestPressureUnit = 'mb' | 'inhg' | 'mmhg' | 'hpa';
/** Precipitation unit for API requests. */
export type TempestPrecipitationUnit = 'mm' | 'cm' | 'in';
/** Distance unit for API requests. */
export type TempestDistanceUnit = 'km' | 'mi';

// Forecast value enumerations

/** Human-readable weather condition strings returned by the forecast API. */
export type ForecastCondition =
  | 'Clear'
  | 'Cloudy'
  | 'Foggy'
  | 'Partly Cloudy'
  | 'Rain Likely'
  | 'Rain Possible'
  | 'Snow'
  | 'Snow Possible'
  | 'Thunderstorms Likely'
  | 'Thunderstorms Possible'
  | 'Very Light Rain'
  | 'Windy'
  | 'Wintry Mix Likely'
  | 'Wintry Mix Possible';

/** Weather icon identifiers returned by the forecast API. */
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

/** Precipitation type values returned by the forecast API. */
export type ForecastPrecipType = 'rain' | 'snow' | 'sleet' | 'storm';

/** Precipitation icon identifiers returned by the forecast API. */
export type ForecastPrecipIcon = 'chance-rain' | 'chance-snow' | 'chance-sleet';

/** Pressure trend values returned by the forecast and observation APIs. */
export type PressureTrend = 'falling' | 'steady' | 'rising' | 'unknown';

/** 16-point compass cardinal direction values. */
export type CardinalDirection =
  | 'N' | 'NNE' | 'NE' | 'ENE'
  | 'E' | 'ESE' | 'SE' | 'SSE'
  | 'S' | 'SSW' | 'SW' | 'WSW'
  | 'W' | 'WNW' | 'NW' | 'NNW';


/* ========================================================= *\
 *  Public Interface                                         *
\* ========================================================= */

/** Interface for Tempest weather API client */
export interface TempestClient {
  /** List all stations associated with the account. */
  listStations(): Promise<StationSet>;
  /** Get a single station by ID. */
  getStation(station_id: number): Promise<StationSet>;
  /** Get the most recent observations for a station. */
  getStationObservations(station_id: number): Promise<StationObservation>;
  /** Get the weather forecast with current conditions, daily, and hourly data. */
  getForecast(
    station_id: number,
    units_temp?: TempestTemperatureUnit,
    units_wind?: TempestWindUnit,
    units_pressure?: TempestPressureUnit,
    units_precip?: TempestPrecipitationUnit,
    units_distance?: TempestDistanceUnit
  ): Promise<BetterForecast>;
}

/** Create an authenticated Tempest API client. */
export function createTempestClient(token: string): TempestClient {
  return {
    listStations: () => getAllStations(token),
    getStation: (station_id: number) => getStationById(token, station_id),
    getStationObservations: (station_id: number) => getStationObservation(token, station_id),
    getForecast: (
      station_id: number,
      units_temp: TempestTemperatureUnit = 'f',
      units_wind: TempestWindUnit = 'mph',
      units_pressure: TempestPressureUnit = 'inhg',
      units_precip: TempestPrecipitationUnit = 'in',
      units_distance: TempestDistanceUnit = 'mi'
    ) => getForcast(token, station_id, units_temp, units_wind, units_pressure, units_precip, units_distance),
  };
}


/* ========================================================= *\
 *  Internal helpers                                         *
\* ========================================================= */

const TEMPEST_BASE_URL = 'https://swd.weatherflow.com/swd/rest';

// access the /stations API endpoint
async function getAllStations(token: string): Promise<StationSet> {
  const url = new URL(`${TEMPEST_BASE_URL}/stations?token=${token}`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  }
  return res.json() as Promise<StationSet>;
}

// access the /stations/{station_id} endpoint — returns station metadata and
// metadata for all devices in it, including capabilities
async function getStationById(token: string, station_id: number): Promise<StationSet> {
  const url = new URL(`${TEMPEST_BASE_URL}/stations/${station_id}?token=${token}`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  }
  return res.json() as Promise<StationSet>;
}

// access the /observations/station/{station_id} endpoint
async function getStationObservation(token: string, station_id: number): Promise<StationObservation> {
  const url = new URL(`${TEMPEST_BASE_URL}/observations/station/${station_id}?token=${token}`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  }
  return res.json() as Promise<StationObservation>;
}

// access the /betterforecast endpoint
async function getForcast(
  token: string,
  station_id: number,
  units_temp: TempestTemperatureUnit,
  units_wind: TempestWindUnit,
  units_pressure: TempestPressureUnit,
  units_precip: TempestPrecipitationUnit,
  units_distance: TempestDistanceUnit
): Promise<BetterForecast> {
  const url = new URL(`${TEMPEST_BASE_URL}/better_forecast?station_id=${station_id}&units_temp=${units_temp}&units_wind=${units_wind}&units_pressure=${units_pressure}&units_precip=${units_precip}&units_distance=${units_distance}&token=${token}`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  }
  return res.json() as Promise<BetterForecast>;
}