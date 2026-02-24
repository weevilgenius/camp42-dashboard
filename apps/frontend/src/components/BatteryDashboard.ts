import m from 'mithril';

// types shared with the back end
import type { BatteryStatus } from '@camp42/shared';

// other components
import { fetchBatteryStatus } from '../services/campStatus.js';
import BatteryCard from './BatteryCard.js';

// WebAwesome components
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/spinner/spinner.js';
import '@awesome.me/webawesome/dist/components/icon/icon.js';

// CSS for this component
import './BatteryDashboard.css';

/** Fetches and displays battery status for both batteries. */
export const BatteryDashboard: m.ClosureComponent = () => {
  const state = {
    loading: true,
    error: null as string | null,
    batteries: null as BatteryStatus | null,
  };

  const load = async () => {
    state.loading = true;
    state.error = null;
    m.redraw();

    try {
      state.batteries = await fetchBatteryStatus();
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      state.loading = false;
      m.redraw();
    }
  };

  return {
    oninit: () => {
      void load();
    },

    view: () => {
      return m('.battery-dashboard', [
        m('.battery-dashboard__header', [
          m('h2.battery-dashboard__title', 'Batteries'),
          m(
            'wa-button',
            {
              variant: 'neutral',
              appearance: 'outlined',
              size: 'small',
              disabled: state.loading,
              onclick: () => {
                void load();
              },
            },
            [
              m('wa-icon', { library: 'material', name: 'refresh', slot: 'start' }), 'Refresh',
            ],
          ),
        ]),

        state.loading
          ? m('.battery-dashboard__loading', [m('wa-spinner'), m('span', 'Loading...')])
          : state.error
            ? m('.battery-dashboard__error', [
              m('p', state.error),
              m(
                'wa-button',
                {
                  variant: 'default',
                  onclick: () => {
                    void load();
                  },
                },
                'Retry',
              ),
            ])
            : state.batteries
              ? m('.battery-dashboard__grid', [
                m(BatteryCard, { key: 'hank', battery: state.batteries.hank }),
                m(BatteryCard, { key: 'bertha', battery: state.batteries.bertha }),
              ])
              : null,
      ]);
    },
  };
};
export default BatteryDashboard;
