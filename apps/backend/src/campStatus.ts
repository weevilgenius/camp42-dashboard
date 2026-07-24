import { logger } from 'firebase-functions';
import { onCall, type CallableOptions, HttpsError } from 'firebase-functions/https';

import { StatusType } from '@camp42/shared';
import type {
  BatteryState,
  StatusRequest,
  StatusResponse,
} from '@camp42/shared';
import { getBatteryStates } from './batteries.js';
import { getWeatherState } from './weather.js';
import { getAIMessage } from './ai.js';
import {
  VERBOSE,
  ECOFLOW_ACCESS_KEY,
  TEMPEST_ACCESS_TOKEN,
  ECOFLOW_SECRET_KEY,
  GEMINI_API_KEY,
} from './config.js';

/* ========================================================= *\
 *  Helper Functions                                         *
\* ========================================================= */

/**
 * Logs details about a battery's current state when verbose logging is enabled.
 * @param battery The battery state to log
 */
function debugBatteryState(battery: BatteryState): void {
  logger.debug(`
${battery.name} is ${battery.online ? 'online. Current state:' : 'offline. Last known state:'}
  ${battery.state.charge_pct}% charged.
  ${battery.state.total_output} watts output, ${battery.state.total_input} watts input
  DC output ${battery.state.dc_on ? 'on' : 'off'}: ${battery.state.dc_watts} watts
  AC output ${battery.state.ac_on ? 'on' : 'off'}: ${battery.state.ac_watts} watts`);
}

/* ========================================================= *\
 *  Cloud Function                                           *
\* ========================================================= */

/** Options for the campStatus callable cloud function */
const campStatusOpts: CallableOptions<StatusRequest> = {
  secrets: [
    ECOFLOW_SECRET_KEY,
    GEMINI_API_KEY,
  ],
};

/**
 * Firebase Callable Cloud Function that fetches camp status data (battery, weather, or AI response).
 * See https://firebase.google.com/docs/functions/callable?gen=2nd
 */
export const campStatus = onCall<StatusRequest, Promise<StatusResponse>>(campStatusOpts, async (request) => {
  // Because this is a "Callable" function, we don't need to deal with HTTP method or response codes.
  // SDK will automatically handle authentication and deserialize the request body into request.data
  if (VERBOSE.value()) { logger.debug('debug parameters', request.data); }

  // what are we being asked to do?
  switch (request.data.type) {

  // battery status
  case StatusType.Batteries: {
    const [hank, bertha] = await getBatteryStates(ECOFLOW_ACCESS_KEY.value(), ECOFLOW_SECRET_KEY.value(), VERBOSE.value());

    if (VERBOSE.value()) {
      debugBatteryState(hank);
      debugBatteryState(bertha);
    }

    return {
      code: 'SUCCESS',
      status: {
        hank,
        bertha,
      },
    };
  }

  // weather status
  case StatusType.Weather: {
    const weather = await getWeatherState(TEMPEST_ACCESS_TOKEN.value(), 10, 24, VERBOSE.value());
    if (VERBOSE.value()) { logger.debug('weather response', weather); }
    return {
      code: 'SUCCESS',
      status: weather,
    };
  }

  // AI response
  case StatusType.AI: {
    const weather = await getWeatherState(TEMPEST_ACCESS_TOKEN.value(), 10, 24);
    const response = await getAIMessage(GEMINI_API_KEY.value(), weather, VERBOSE.value());
    if (VERBOSE.value()) { logger.debug('AI response', response); }
    return {
      code: 'SUCCESS',
      status: response,
    };
  }

  // unknown status
  default:
    throw new HttpsError('invalid-argument', 'Unknown status type: ' + String(request.data.type));
  }
});
