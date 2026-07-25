import m from 'mithril';

import { fetchPresence } from '../services/presence.js';
import Presence from './Presence.js';

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
      if (state.loading) return m('.presence-dashboard', m('.loading', 'Loading presence...'));
      if (state.error) return m('.presence-dashboard', m('.error', state.error));
      return m('.presence-dashboard', m(Presence, { presence: state.presence ?? {} }));
    },
  };
};

export default PresenceDashboard;
