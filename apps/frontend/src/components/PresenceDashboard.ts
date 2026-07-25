import m from 'mithril';

import { fetchPresence } from '../services/presence.js';
import Presence from './Presence.js';

// WebAwesome components
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/icon/icon.js';

// CSS for this component
import './PresenceDashboard.css';

/** Fetches and displays the current camp presence. */
export const PresenceDashboard: m.ClosureComponent = () => {
  const state = {
    loading: true,
    error: null as string | null,
    presence: null as Record<string, number> | null,
  };

  const load = async () => {
    state.loading = true;
    state.error = null;
    m.redraw();

    try {
      state.presence = await fetchPresence();
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Unknown error';
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
      return m('.presence-dashboard', [
        m('.header', [
          m('h2.title', 'Presence'),
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
          ? m('.loading', 'Loading presence...')
          : state.error
            ? m('.error', [
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
            : m(Presence, { presence: state.presence ?? {} }),
      ]);
    },
  };
};

export default PresenceDashboard;
