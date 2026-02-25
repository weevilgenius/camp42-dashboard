/* ========================================================= *\
 *  Minimal raw Ecoflow API response mocks                   *
 *                                                           *
 *  Only the fields used by apps/backend/src/batteries.ts    *
 *  are included. These types are intentionally minimal --   *
 *  use the full interfaces in libEcoflow.ts for exhaustive  *
 *  typing.                                                  *
\* ========================================================= */

/** Minimal Delta 2 Max state -- only the 8 fields the backend reads. */
export interface MockDelta2MaxState {
  'pd.soc': number;
  'pd.carState': number;
  'pd.carWatts': number;
  'inv.cfgAcEnabled': number;
  'inv.outputWatts': number;
  'pd.wattsOutSum': number;
  'inv.inputWatts': number;
  'mppt.inWatts': number;
}

/** Minimal Delta Pro 3 state -- only the 7 fields the backend reads. */
export interface MockDeltaPro3State {
  cmsBattSoc: number;
  flowInfo12v: number;
  powGet12v: number;
  flowInfoAcLvOut: number;
  powGetAcLvOut: number;
  powOutSumW: number;
  powInSumW: number;
}

/** Common EcoFlow API response wrapper. */
export interface MockEcoflowResponse<T> {
  code: string;
  message?: string;
  data?: T;
  eagleEyeTraceId?: string;
  tid?: string;
}

/** Minimal device info from the list-devices endpoint. */
export interface MockDeviceInfo {
  sn: string;
  deviceName: string;
  online: 0 | 1;
  productName: string;
}

/** Create a mock Delta 2 Max API response. */
export function createDelta2MaxResponse(
  overrides?: Partial<MockDelta2MaxState>,
): MockEcoflowResponse<MockDelta2MaxState> {
  return {
    code: "0",
    message: "Success",
    data: {
      'pd.soc': 78,
      'pd.carState': 1,
      'pd.carWatts': 12,
      'inv.cfgAcEnabled': 1,
      'inv.outputWatts': 45,
      'pd.wattsOutSum': 57,
      'inv.inputWatts': 80,
      'mppt.inWatts': 130,
      ...overrides,
    },
  };
}

/** Create a mock Delta Pro 3 API response. */
export function createDeltaPro3Response(
  overrides?: Partial<MockDeltaPro3State>,
): MockEcoflowResponse<MockDeltaPro3State> {
  return {
    code: "0",
    message: "Success",
    data: {
      cmsBattSoc: 65.2,
      flowInfo12v: 0,
      powGet12v: 0,
      flowInfoAcLvOut: 2,
      powGetAcLvOut: -120,
      powOutSumW: 120,
      powInSumW: 185,
      ...overrides,
    },
  };
}

/** Create a mock device list response with both batteries. */
export function createEcoflowDeviceListResponse(
  overrides?: Partial<MockDeviceInfo>[],
): MockEcoflowResponse<MockDeviceInfo[]> {
  const defaults: MockDeviceInfo[] = [
    {
      sn: "R351ZAB4HF6A0268",
      deviceName: "Hank",
      online: 1,
      productName: "DELTA 2 Max",
    },
    {
      sn: "MR51ZAS5PG7U0302",
      deviceName: "Bertha",
      online: 1,
      productName: "DELTA Pro 3",
    },
  ];

  if (overrides) {
    for (let i = 0; i < Math.min(overrides.length, defaults.length); i++) {
      Object.assign(defaults[i], overrides[i]);
    }
  }

  return {
    code: "0",
    message: "Success",
    data: defaults,
  };
}
