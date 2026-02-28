import m from 'mithril';

import './BatteryGauge.css';

/** Layout orientation for the battery gauge. */
export type BatteryGaugeLayout = 'horizontal' | 'vertical';

/** Attrs for the BatteryGauge component. */
export interface BatteryGaugeAttrs extends m.Attributes {
  /** Charge level as a percentage (0-100). */
  level: number;
  /** Layout orientation. Defaults to 'vertical'. */
  layout?: BatteryGaugeLayout;
  /** Whether the battery is actively charging. Defaults to false. */
  charging?: boolean;
}

/**
 * Displays battery charge as a glowing liquid inside a battery-shaped vessel.
 *
 * The liquid fill rises or extends based on the charge level, with color
 * indicating charge state (green/yellow/red). When charging is true, the
 * liquid surface animates with a wave effect and the glow pulses.
 */
export const BatteryGauge: m.ClosureComponent<BatteryGaugeAttrs> = () => {
  const chargeState = (level: number): string => {
    if (level > 50) return 'good';
    if (level > 20) return 'low';
    return 'empty';
  };

  return {
    view: ({ attrs }) => {
      const level = Math.max(0, Math.min(100, attrs.level));
      const layout = attrs.layout ?? 'vertical';
      const charging = attrs.charging ?? false;
      const state = chargeState(level);

      const classes = [
        '.battery-gauge',
        `.battery-gauge--${layout}`,
        `.battery-gauge--${state}`,
        charging ? '.battery-gauge--charging' : '',
      ].join('');

      return m(
        classes,
        {
          role: 'meter',
          'aria-valuenow': level,
          'aria-valuemin': 0,
          'aria-valuemax': 100,
          'aria-label': `Battery charge: ${level}%`,
        },
        [
          m('.battery-gauge__terminal'),
          m('.battery-gauge__body', [
            m('.battery-gauge__fill', {
              style: { '--fill-level': `${level}%` },
            }),
            m('.battery-gauge__label', `${level}%`),
          ]),
        ],
      );
    },
  };
};
export default BatteryGauge;
