import { withCache } from './utils.js';
import { createEcoflowClient } from './libEcoflow.js';
import type { Delta2MaxState, DeltaPro3State } from './libEcoflow.js';
import { BatteryType, type BatteryState } from '@camp42/shared';


/**
 * Fetch battery status from Ecoflow
 * @param accessKey Ecoflow API access key
 * @param secretKey Ecoflow API secret key
 * @param verbose Flag for verbose debugging
 * @returns Battery status for Hank and Bertha
 */
async function fetchBatteryStates(accessKey: string, secretKey: string, verbose = false): Promise<[hank: BatteryState, bertha: BatteryState]> {

  if (!accessKey || !secretKey) {
    throw new Error('Missing Ecoflow accessKey or secretKey');
  }

  if (verbose) { console.log('fetching battery state from Ecoflow'); }

  const Hank_Battery: BatteryState = {
    type: BatteryType.Delta_2_Max,
    name: "Hank",
    sn: "R351ZAB4HF6A0268",
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
  };

  const Bertha_Battery: BatteryState = {
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
  };

  const ecoflow = createEcoflowClient(accessKey, secretKey);

  // without using MQTT, you can only get online/offline state by querying the user's device list
  if (verbose) { console.log('invoking list devices'); }
  const devices_request = await ecoflow.listDevices();
  if (devices_request.code === "0" && devices_request.data) {
    for (const device of devices_request.data) {
      const online = device.online === 1;
      const name = device.deviceName;
      if (device.sn === Hank_Battery.sn) {
        Hank_Battery.online = online;
        Hank_Battery.name = name;
      }
      if (device.sn === Bertha_Battery.sn) {
        Bertha_Battery.online = online;
        Bertha_Battery.name = name;
      }
    }
  } else {
    throw new Error(`Ecoflow request failed: ${JSON.stringify(devices_request, null, 2)}`);
  }

  // the "GetAllQuota" endpoint appears to return the last known values for the device, regardless of online status

  // collect current state for Hank
  if (verbose) { console.log('invoking get state for Hank'); }
  const hank_request = await ecoflow.getState<Delta2MaxState>(Hank_Battery.sn);
  if (hank_request.code === "0" && hank_request.data) {
    const status = hank_request.data;
    Hank_Battery.state.charge_pct = status['pd.soc'];
    Hank_Battery.state.dc_on = status['pd.carState'] === 1;
    Hank_Battery.state.dc_watts = status['pd.carWatts'];
    Hank_Battery.state.ac_on = status['inv.cfgAcEnabled'] === 1;
    Hank_Battery.state.ac_watts = status['inv.outputWatts'];
    Hank_Battery.state.total_output = status['pd.wattsOutSum'];
    Hank_Battery.state.total_input = status['inv.inputWatts'] + status['mppt.inWatts'];
  } else {
    throw new Error(`unable to query Hank battery status: ${JSON.stringify(hank_request, null, 2)}`);
  }

  // collect current state for Bertha
  if (verbose) { console.log('invoking get state for Bertha'); }
  const bertha_request = await ecoflow.getState<DeltaPro3State>(Bertha_Battery.sn);
  if (bertha_request.code === "0" && bertha_request.data) {
    const status = bertha_request.data;
    Bertha_Battery.state.charge_pct = Math.round(status.cmsBattSoc);
    Bertha_Battery.state.dc_on = status.flowInfo12v !== 0;
    Bertha_Battery.state.dc_watts = Math.abs(status.powGet12v);
    Bertha_Battery.state.ac_on = status.flowInfoAcLvOut !== 0;
    Bertha_Battery.state.ac_watts = Math.abs(status.powGetAcLvOut);
    Bertha_Battery.state.total_output = status.powOutSumW;
    Bertha_Battery.state.total_input = status.powInSumW;
  } else {
    throw new Error(`unable to query Bertha battery status: ${JSON.stringify(bertha_request, null, 2)}`);
  }

  return [Hank_Battery, Bertha_Battery];
}


/**
 * Gets battery states from Ecoflow. Results are cached for 60 seconds.
 * @param accessKey Ecoflow API access key
 * @param secretKey Ecoflow API secret key
 * @param verbose Flag for verbose debugging
 * @returns Battery status for Hank and Bertha
 */
export const getBatteryStates = withCache(fetchBatteryStates, 60 * 1000);
