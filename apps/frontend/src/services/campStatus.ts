import { httpsCallable } from 'firebase/functions';

import { StatusType } from '@camp42/shared';
import type { BatteryStatus, StatusRequest, StatusResponse } from '@camp42/shared';

import { functions } from '../firebase.js';

const campStatus = httpsCallable<StatusRequest, StatusResponse<StatusType.Batteries>>(
  functions,
  'campStatus',
);

/** Fetch battery status from the campStatus cloud function. */
export async function fetchBatteryStatus(): Promise<BatteryStatus> {
  const result = await campStatus({ type: StatusType.Batteries });
  const response = result.data;

  if (response.code !== 'SUCCESS' || !response.status) {
    throw new Error(response.error ?? 'Failed to fetch battery status');
  }

  return response.status;
}
