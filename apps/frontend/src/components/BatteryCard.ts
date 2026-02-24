import m from 'mithril';

// types shared with the back end
import type { BatteryState } from '@camp42/shared';

// WebAwesome components
import '@awesome.me/webawesome/dist/components/badge/badge.js';
import '@awesome.me/webawesome/dist/components/progress-bar/progress-bar.js';

// this component's CSS
import './BatteryCard.css';

/** Attrs for the BatteryCard component. */
export interface BatteryCardAttrs extends m.Attributes {
  /** Battery state to display. */
  battery: BatteryState;
}

/** Displays the status of a single battery. */
export const BatteryCard: m.ClosureComponent<BatteryCardAttrs> = () => {
  return {
    view: ({ attrs }) => {
      const { battery } = attrs;
      const { state } = battery;

      const chargeState = state.charge_pct > 50 ? 'good' : state.charge_pct > 20 ? 'low' : 'empty';

      return m('.battery-card', [
        m('.header', [
          m('div', [
            m('h3.name', battery.name),
            m('p.type', battery.type),
          ]),
          m(
            'wa-badge',
            {
              variant: 'neutral',
              appearance: battery.online ? 'accent' : 'outlined',
            },
            battery.online ? 'Online' : 'Offline',
          ),
        ]),

        m('.charge', [
          m('wa-progress-bar', {
            className: chargeState,
            value: state.charge_pct,
          }, `${state.charge_pct}%`),
        ]),

        m('.stats', [
          m('.stat', [
            m('span.stat-label', 'Input'),
            m('span.stat-value', `${state.total_input} W`),
          ]),
          m('.stat', [
            m('span.stat-label', 'Output'),
            m('span.stat-value', `${state.total_output} W`),
          ]),
        ]),

        m('.panels', [
          m('.panel', [
            m(
              'wa-badge',
              {
                variant: 'neutral',
                appearance: state.ac_on ? 'accent' : 'outlined',
                size: 'small',
              },
              'AC',
            ),
            m('span', `${state.ac_watts} W`),
          ]),
          m('.panel', [
            m(
              'wa-badge',
              {
                variant: 'neutral',
                appearance: state.dc_on ? 'accent' : 'outlined',
                size: 'small',
              },
              'DC',
            ),
            m('span', `${state.dc_watts} W`),
          ]),
        ]),
      ]);
    },
  };
};
export default BatteryCard;
