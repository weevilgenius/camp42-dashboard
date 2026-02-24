// command line script for testing and exploring the Tempest API
import { config } from 'dotenv';
import { createTempestClient } from './libTempest.js';

// load the environment from Firebase config
const dotenv = config({ path: ['.env.local', '.env', '.secret.local']});
if (dotenv.error) {
  console.error('dotenv failed to load: ', dotenv.error);
  process.exit(1);
}

// get the API key
const TEMPEST_ACCESS_TOKEN = process.env.TEMPEST_ACCESS_TOKEN as string;
if (!TEMPEST_ACCESS_TOKEN) {
  console.error('TEMPEST_ACCESS_TOKEN not found');
  process.exit(1);
}

// this is the station at Camp 42
const STATION_ID = 136917;

// create the API client
const client = createTempestClient(TEMPEST_ACCESS_TOKEN);

// request forecast
const forecast = await client.getForecast(STATION_ID);
console.log(JSON.stringify(forecast, null, 2));
