import m from 'mithril';
import type { Meta, StoryObj as Story } from '@storybook/web-components-vite';
import { BatteryGauge, type BatteryGaugeAttrs } from './BatteryGauge.js';

const meta: Meta<BatteryGaugeAttrs> = {
  title: 'Components/BatteryGauge',

  render: (args) => {
    const container = document.createElement('div');
    m.render(container, m(BatteryGauge, args));
    return container;
  },

  decorators: [
    (story) => {
      const wrapper = document.createElement('div');
      wrapper.style.padding = '2rem';
      wrapper.appendChild(story() as Node);
      return wrapper;
    },
  ],

  argTypes: {
    level: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    layout: { control: 'select', options: ['horizontal', 'vertical'] },
    charging: { control: 'boolean' },
  },
};
export default meta;

/* ========================================================= *\
 *  Horizontal layout stories (default)                      *
\* ========================================================= */

/** Healthy charge at 75% in the default horizontal layout. */
export const Default: Story = {
  args: { level: 75 },
};

/** Fully charged at 100%. */
export const FullCharge: Story = {
  args: { level: 100 },
};

/** Medium-low charge at 25%, in the "low" warning band. */
export const LowCharge: Story = {
  args: { level: 25 },
};

/** Critically low charge at 8%, danger state. */
export const CriticallyLow: Story = {
  args: { level: 8 },
};

/** Completely empty battery at 0%. */
export const Empty: Story = {
  args: { level: 0 },
};

/** Mid-level charge with active charging animation. */
export const Charging: Story = {
  args: { level: 45, charging: true },
};

/** Low charge with active charging, showing danger-colored wave. */
export const ChargingLow: Story = {
  args: { level: 15, charging: true },
};

/** Nearly full with active charging, showing success-colored wave. */
export const ChargingFull: Story = {
  args: { level: 95, charging: true },
};

/* ========================================================= *\
 *  Vertical layout stories                                  *
\* ========================================================= */

/** Vertical layout at 65% charge. */
export const Vertical: Story = {
  args: { level: 65, layout: 'vertical' },
};

/** Vertical layout with active charging animation. */
export const VerticalCharging: Story = {
  args: { level: 40, layout: 'vertical', charging: true },
};

/** Vertical layout at critically low charge. */
export const VerticalLow: Story = {
  args: { level: 12, layout: 'vertical' },
};

/** Vertical layout fully charged. */
export const VerticalFull: Story = {
  args: { level: 100, layout: 'vertical' },
};

/* ========================================================= *\
 *  Custom sizing                                            *
\* ========================================================= */

/** Large vertical gauge using custom CSS properties. */
export const LargeVertical: Story = {
  args: { level: 60, layout: 'vertical', charging: true },
  decorators: [
    (story) => {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = '--gauge-width: 120px; --gauge-height: 240px;';
      wrapper.appendChild(story() as Node);
      return wrapper;
    },
  ],
};

/** Compact horizontal gauge using custom CSS properties. */
export const CompactHorizontal: Story = {
  args: { level: 50 },
  decorators: [
    (story) => {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = '--gauge-width: 28px; --gauge-height: 100px;';
      wrapper.appendChild(story() as Node);
      return wrapper;
    },
  ],
};

/** Side-by-side comparison of all charge states. */
export const AllStates: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '1.5rem';
    container.style.alignItems = 'center';

    m.render(container, [
      m(BatteryGauge, { level: 100, key: 'full' }),
      m(BatteryGauge, { level: 75, key: 'good' }),
      m(BatteryGauge, { level: 35, key: 'low' }),
      m(BatteryGauge, { level: 10, key: 'empty' }),
      m(BatteryGauge, { level: 45, charging: true, key: 'charging' }),
    ]);

    return container;
  },
};
