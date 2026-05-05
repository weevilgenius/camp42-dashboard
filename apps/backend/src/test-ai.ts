// command line script for testing and exploring the Tempest API
import { config } from 'dotenv';
import { getAIMessage } from './ai.js';
import { getWeatherState } from "./weather.js";
import { getBatteryStates } from './batteries.js';


// load the environment from Firebase config
const dotenv = config({ path: ['.env.local', '.env', '.secret.local']});
if (dotenv.error) {
  console.error('dotenv failed to load: ', dotenv.error);
  process.exit(1);
}

// get the gemini API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY not found');
  process.exit(1);
}

// get the Tempest API key
const TEMPEST_ACCESS_TOKEN = process.env.TEMPEST_ACCESS_TOKEN as string;
if (!TEMPEST_ACCESS_TOKEN) {
  console.error('TEMPEST_ACCESS_TOKEN not found');
  process.exit(1);
}

// get the Ecoflow API keys
const ECOFLOW_ACCESS_KEY = process.env.ECOFLOW_ACCESS_KEY as string;
const ECOFLOW_SECRET_KEY = process.env.ECOFLOW_SECRET_KEY as string;
if (!ECOFLOW_ACCESS_KEY || !ECOFLOW_SECRET_KEY) {
  console.error('Ecoflow API keys not found');
  process.exit(1);
}


// request weather
const weather = await getWeatherState(TEMPEST_ACCESS_TOKEN, 1, 12);

// request battery states
const batteries = await getBatteryStates(ECOFLOW_ACCESS_KEY, ECOFLOW_SECRET_KEY);

// request ai message
const response = await getAIMessage(GEMINI_API_KEY, weather, batteries, true);
console.log(response);
