import m from 'mithril';
import { SystemStatus } from '@camp42/shared';

const weatherStation: SystemStatus = {
  service: 'tempest',
  status: 'online',
  lastPing: Date.now(),
};

const Dashboard = {
  view: () => {
    return m('main', [
      m('h1', 'Camp 42 Dashboard'),
      m('p', `Tempest Weather: ${weatherStation.status}`),
    ]);
  },
};

const root = document.getElementById('app');
if (root) {
  m.mount(root, Dashboard);
}
