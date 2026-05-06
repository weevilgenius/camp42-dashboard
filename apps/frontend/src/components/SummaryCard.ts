import m from 'mithril';

// types shared with the back end
import type { AIStatus } from '@camp42/shared';

// other components
import { fetchAIStatus } from '../services/campStatus.js';

// WebAwesome components
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/icon/icon.js';
import '@awesome.me/webawesome/dist/components/skeleton/skeleton.js';

// CSS for this component
import './SummaryCard.css';

/** Fetches and displays the AI-generated summary of current camp conditions. */
export const SummaryCard: m.ClosureComponent = () => {
  const state = {
    loading: true,
    error: null as string | null,
    summary: null as AIStatus | null,
  };

  const load = async () => {
    state.loading = true;
    state.error = null;
    m.redraw();

    try {
      state.summary = await fetchAIStatus();
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
      return m('.summary-card', [
        m('.header', [
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

        m('.card', [
          m('h2.title', state.loading ? '' : ` ${state.summary?.name} says`),

          state.loading
            ? m('.skeleton-message', [
              m('wa-skeleton', { effect: 'sheen' }),
              m('wa-skeleton', { effect: 'sheen' }),
              m('wa-skeleton', { effect: 'sheen', style: 'width: 60%' }),
            ])
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
              : state.summary
                ? m('p.message', state.summary.message)
                : null,
        ]),
      ]);
    },
  };
};
export default SummaryCard;
