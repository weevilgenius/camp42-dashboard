import { BatteryType } from '@camp42/shared';
import type { BatteryStatus } from '@camp42/shared';
import { createBatteryState } from './factories.js';

/** Both online, moderate charge, solar input ~200W. */
export const BATTERIES_NORMAL = (): BatteryStatus => ({
  hank: createBatteryState(),
  bertha: createBatteryState({
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
});

/** Both online, low charge, high solar input 400-500W. */
export const BATTERIES_CHARGING = (): BatteryStatus => ({
  hank: createBatteryState({
    state: {
      charge_pct: 25,
      dc_on: false,
      dc_watts: 0,
      ac_on: false,
      ac_watts: 0,
      total_input: 480,
      total_output: 0,
    },
  }),
  bertha: createBatteryState({
    type: BatteryType.Delta_3_Pro,
    name: "Bertha",
    sn: "MR51ZAS5PG7U0302",
    state: {
      charge_pct: 18,
      dc_on: false,
      dc_watts: 0,
      ac_on: false,
      ac_watts: 0,
      total_input: 420,
      total_output: 0,
    },
  }),
});

/** Both at 100%, trickle input. */
export const BATTERIES_FULL = (): BatteryStatus => ({
  hank: createBatteryState({
    state: {
      charge_pct: 100,
      dc_on: true,
      dc_watts: 5,
      ac_on: true,
      ac_watts: 10,
      total_input: 18,
      total_output: 15,
    },
  }),
  bertha: createBatteryState({
    type: BatteryType.Delta_3_Pro,
    name: "Bertha",
    sn: "MR51ZAS5PG7U0302",
    state: {
      charge_pct: 100,
      dc_on: false,
      dc_watts: 0,
      ac_on: true,
      ac_watts: 8,
      total_input: 12,
      total_output: 8,
    },
  }),
});

/** Both below 20%, no input, draining. */
export const BATTERIES_LOW = (): BatteryStatus => ({
  hank: createBatteryState({
    state: {
      charge_pct: 15,
      dc_on: true,
      dc_watts: 25,
      ac_on: true,
      ac_watts: 180,
      total_input: 0,
      total_output: 205,
    },
  }),
  bertha: createBatteryState({
    type: BatteryType.Delta_3_Pro,
    name: "Bertha",
    sn: "MR51ZAS5PG7U0302",
    state: {
      charge_pct: 8,
      dc_on: true,
      dc_watts: 15,
      ac_on: true,
      ac_watts: 95,
      total_input: 0,
      total_output: 110,
    },
  }),
});

/** Hank online, Bertha offline with -1 state values. */
export const BATTERIES_ONE_OFFLINE = (): BatteryStatus => ({
  hank: createBatteryState(),
  bertha: createBatteryState({
    type: BatteryType.Delta_3_Pro,
    name: "Bertha",
    sn: "MR51ZAS5PG7U0302",
    online: false,
    state: {
      charge_pct: -1,
      dc_on: false,
      dc_watts: -1,
      ac_on: false,
      ac_watts: -1,
      total_input: -1,
      total_output: -1,
    },
  }),
});

/** Both offline. */
export const BATTERIES_BOTH_OFFLINE = (): BatteryStatus => ({
  hank: createBatteryState({
    online: false,
    state: {
      charge_pct: -1,
      dc_on: false,
      dc_watts: -1,
      ac_on: false,
      ac_watts: -1,
      total_input: -1,
      total_output: -1,
    },
  }),
  bertha: createBatteryState({
    type: BatteryType.Delta_3_Pro,
    name: "Bertha",
    sn: "MR51ZAS5PG7U0302",
    online: false,
    state: {
      charge_pct: -1,
      dc_on: false,
      dc_watts: -1,
      ac_on: false,
      ac_watts: -1,
      total_input: -1,
      total_output: -1,
    },
  }),
});

/** Both online, high AC draw 800-1200W. */
export const BATTERIES_HEAVY_LOAD = (): BatteryStatus => ({
  hank: createBatteryState({
    state: {
      charge_pct: 52,
      dc_on: true,
      dc_watts: 30,
      ac_on: true,
      ac_watts: 820,
      total_input: 350,
      total_output: 850,
    },
  }),
  bertha: createBatteryState({
    type: BatteryType.Delta_3_Pro,
    name: "Bertha",
    sn: "MR51ZAS5PG7U0302",
    state: {
      charge_pct: 44,
      dc_on: false,
      dc_watts: 0,
      ac_on: true,
      ac_watts: 1180,
      total_input: 280,
      total_output: 1180,
    },
  }),
});
