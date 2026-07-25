import m from 'mithril';
import type { Meta, StoryObj as Story } from '@storybook/web-components-vite';
import { Presence, type PresenceAttrs } from './Presence.js';

const meta: Meta<PresenceAttrs> = {
  title: 'Components/Presence',

  render: (args) => {
    const container = document.createElement('div');
    m.render(container, m(Presence, args));
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

/** Multiple people currently at camp. */
export const Here: Story = {
  args: {
    presence: {
      Cathie: 0,
      Barry: 30,
      Candace: 5 * 60,
    },
  },
};

/** Multiple people seen recently, with nobody currently at camp. */
export const RecentlySeen: Story = {
  args: {
    presence: {
      Angela: 16 * 60,
      Ed: 3 * 60 * 60,
      Barry: 8 * 60 * 60,
    },
  },
};

/** People currently at camp alongside people seen recently. */
export const Mixed: Story = {
  args: {
    presence: {
      Cathie: 0,
      Ed: 5 * 60,
      Candace: 20 * 60,
      Angela: 4 * 60 * 60,
    },
  },
};

/** Nobody has been detected in the last day. */
export const NobodyHere: Story = {
  args: {
    presence: {},
  },
};
