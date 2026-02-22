import { SystemStatus } from '@camp42/shared';

const ecoFlowAPI: SystemStatus = {
  service: 'ecoflow',
  status: 'online',
  lastPing: Date.now(),
};

console.log('Backend Node Script Running...');
console.log('Device Status Check:', ecoFlowAPI);
