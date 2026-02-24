import { httpsCallable } from 'firebase/functions';

import { StatusType } from '@camp42/shared';
import type {
  BatteryStatus,
  StatusRequest,
  StatusResponse,
  WeatherStatus,
} from '@camp42/shared';

import { functions } from '../firebase.js';

const batteryStatus = httpsCallable<StatusRequest, StatusResponse<StatusType.Batteries>>(
  functions,
  'campStatus',
);

const weatherStatus = httpsCallable<StatusRequest, StatusResponse<StatusType.Weather>>(
  functions,
  'campStatus',
);

/** Fetch battery status from the campStatus cloud function. */
export async function fetchBatteryStatus(): Promise<BatteryStatus> {
  const result = await batteryStatus({ type: StatusType.Batteries });
  const response = result.data;

  if (response.code !== 'SUCCESS' || !response.status) {
    throw new Error(response.error ?? 'Failed to fetch battery status');
  }

  return response.status;
}

/** Fetch weather status from the campStatus cloud function. */
export async function fetchWeatherStatus(): Promise<WeatherStatus> {
  const result = await weatherStatus({ type: StatusType.Weather });
  const response = result.data;

  if (response.code !== 'SUCCESS' || !response.status) {
    throw new Error(response.error ?? 'Failed to fetch weather status');
  }

  return response.status;
}
