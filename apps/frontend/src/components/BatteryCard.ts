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
        m('.battery-card__header', [
          m('div', [
            m('h3.battery-card__name', battery.name),
            m('p.battery-card__type', battery.type),
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

        m('.battery-card__charge', [
          m('wa-progress-bar', {
            className: chargeState,
            value: state.charge_pct,
          }, `${state.charge_pct}%`),
        ]),

        m('.battery-card__stats', [
          m('.battery-card__stat', [
            m('span.battery-card__stat-label', 'Input'),
            m('span.battery-card__stat-value', `${state.total_input} W`),
          ]),
          m('.battery-card__stat', [
            m('span.battery-card__stat-label', 'Output'),
            m('span.battery-card__stat-value', `${state.total_output} W`),
          ]),
        ]),

        m('.battery-card__panels', [
          m('.battery-card__panel', [
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
          m('.battery-card__panel', [
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
