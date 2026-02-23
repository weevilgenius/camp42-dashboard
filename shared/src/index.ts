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
  temp: number;
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

