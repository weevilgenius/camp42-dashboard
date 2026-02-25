import m from 'mithril';
import type { Meta, StoryObj as Story } from '@storybook/web-components-vite';
import {
  BATTERIES_NORMAL,
  BATTERIES_LOW,
  BATTERIES_FULL,
  BATTERIES_CHARGING,
  BATTERIES_HEAVY_LOAD,
  BATTERIES_ONE_OFFLINE,
} from '@camp42/mocks';
import { BatteryCard, type BatteryCardAttrs } from './BatteryCard.js';


const meta: Meta<BatteryCardAttrs> = {
  title: 'Components/BatteryCard',

  render: (args) => {
    const container = document.createElement('div');
    m.render(container, m(BatteryCard, args));
    return container;
  },

  decorators: [
    (story) => {
      const wrapper = document.createElement('div');
      wrapper.style.maxWidth = '360px';
      wrapper.appendChild(story() as Node);
      return wrapper;
    },
  ],
};
export default meta;

/** Default healthy state: ~78% charge with solar input. */
export const Normal: Story = {
  args: { battery: BATTERIES_NORMAL().hank },
};

/** Warning state: 15% charge, draining with no solar input. */
export const LowCharge: Story = {
  args: { battery: BATTERIES_LOW().hank },
};

/** Danger state: 8% charge, nearly empty. */
export const Empty: Story = {
  args: { battery: BATTERIES_LOW().bertha },
};

/** Fully charged at 100% with trickle input. */
export const FullCharge: Story = {
  args: { battery: BATTERIES_FULL().hank },
};

/** Low charge but actively charging with high solar input. */
export const Charging: Story = {
  args: { battery: BATTERIES_CHARGING().hank },
};

/** High AC output draw under heavy load. */
export const HeavyLoad: Story = {
  args: { battery: BATTERIES_HEAVY_LOAD().hank },
};

/** Offline battery with -1 state values and dimmed appearance. */
export const Offline: Story = {
  args: { battery: BATTERIES_ONE_OFFLINE().bertha },
};

/** Delta Pro 3 model (Bertha). */
export const DeltaPro3: Story = {
  args: { battery: BATTERIES_NORMAL().bertha },
};
