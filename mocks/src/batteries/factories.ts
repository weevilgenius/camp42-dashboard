import { BatteryType } from '@camp42/shared';
import type { BatteryState, BatteryStatus } from '@camp42/shared';

/** Create a mock BatteryState with realistic defaults (Hank, Delta 2 Max). */
export function createBatteryState(overrides?: Partial<BatteryState>): BatteryState {
  const defaults: BatteryState = {
    type: BatteryType.Delta_2_Max,
    name: "Hank",
    sn: "R351ZAB4HF6A0268",
    online: true,
    state: {
      charge_pct: 78,
      dc_on: true,
      dc_watts: 12,
      ac_on: true,
      ac_watts: 45,
      total_input: 210,
      total_output: 57,
    },
  };

  if (!overrides) return defaults;

  return {
    ...defaults,
    ...overrides,
    state: {
      ...defaults.state,
      ...overrides.state,
    },
  };
}

/** Create a mock BatteryStatus with both Hank and Bertha. */
export function createBatteryStatus(overrides?: Partial<BatteryStatus>): BatteryStatus {
  return {
    hank: overrides?.hank ?? createBatteryState(),
    bertha: overrides?.bertha ?? createBatteryState({
      type: BatteryType.Delta_3_Pro,
      name: "Bertha",
      sn: "MR51ZAS5PG7U0302",
      state: {
        charge_pct: 65,
        dc_on: false,
        dc_watts: 0,
        ac_on: true,
        ac_watts: 120,
        total_input: 185,
        total_output: 120,
      },
    }),
  };
}
