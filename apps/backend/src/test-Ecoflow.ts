// command line script for testing and exploring the Ecoflow API
import { config } from 'dotenv';
import { createEcoflowClient } from './libEcoflow.js';
import type { River2ProState } from './libEcoflow.js';

// load the environment from Firebase config
const dotenv = config({ path: ['.env.local', '.env', '.secret.local']});
if (dotenv.error) {
  console.error('dotenv failed to load: ', dotenv.error);
  process.exit(1);
}

// get the API keys
const ECOFLOW_ACCESS_KEY = process.env.ECOFLOW_ACCESS_KEY as string;
const ECOFLOW_SECRET_KEY = process.env.ECOFLOW_SECRET_KEY as string;
if (!ECOFLOW_ACCESS_KEY || !ECOFLOW_SECRET_KEY) {
  console.error('Ecoflow API keys not found');
  process.exit(1);
}

// known batteries
const Bill_Serial = "R621ZAB6XFCT0320";
//const Hank_Serial = "R351ZAB4HF6A0268";
//const Bertha_Serial = "MR51ZAS5PG7U0302";

// create the API client
const ecoflow = createEcoflowClient(ECOFLOW_ACCESS_KEY, ECOFLOW_SECRET_KEY);

// list all devices
// const devices = await ecoflow.listDevices();
// console.log(JSON.stringify(devices, null, 2));

// get battery state
const bill_state = await ecoflow.getState<River2ProState>(Bill_Serial);
console.log(JSON.stringify(bill_state, null, 2));
