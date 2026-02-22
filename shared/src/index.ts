// placeholder for testing
export interface SystemStatus {
  service: 'ecoflow' | 'tempest' | 'reolink';
  status: 'online' | 'offline';
  lastPing: number;
}
