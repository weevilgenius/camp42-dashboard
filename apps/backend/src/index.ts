import { batteryState, type BatteryState } from './batteries.js';


function reportBatteryState(battery: BatteryState) {
  console.log(`
${battery.name} is ${battery.online ? 'online. Current state:' : 'offline. Last known state:'}
  ${battery.state.charge_pct}% charged.
  ${battery.state.total_output} watts output, ${battery.state.total_input} watts input
  DC output ${battery.state.dc_on ? "on" : "off"}: ${battery.state.dc_watts} watts
  AC output ${battery.state.ac_on ? "on" : "off"}: ${battery.state.ac_watts} watts`);

}


const ecoflowAccessKey = process.env.ECOFLOW_ACCESS_KEY;
const ecoflowSecretKey = process.env.ECOFLOW_SECRET_KEY;

if (!ecoflowAccessKey || !ecoflowSecretKey) {
  console.error('Missing ECOFLOW_ACCESS_KEY or ECOFLOW_SECRET_KEY environment variables');
  process.exit(1);
}

try {
  const [hank_battery, bertha_battery] = await batteryState(ecoflowAccessKey, ecoflowSecretKey);

  // report Hank's status
  reportBatteryState(hank_battery);

  // report Bertha's status
  reportBatteryState(bertha_battery);
} catch (err) {
  console.error(`failed to fetch battery state: ${String(err)}`);
  process.exitCode = 1;
}
