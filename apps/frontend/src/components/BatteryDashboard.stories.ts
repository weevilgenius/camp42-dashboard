import m from 'mithril';
import type { Meta, StoryObj as Story } from '@storybook/web-components-vite';
import { BatteryDashboard } from './BatteryDashboard.js';


const meta: Meta = {
  title: 'Dashboards/BatteryDashboard',

  decorators: [
    (story) => {
      const wrapper = document.createElement('div');
      wrapper.style.maxWidth = '600px';
      wrapper.appendChild(story() as Node);
      return wrapper;
    },
  ],
};
export default meta;

/** Loading state: before data arrives. */
export const Loading: Story = {
  render: () => {
    const container = document.createElement('div');
    m.render(container, m(BatteryDashboard));
    return container;
  },
};

/** Loaded state: battery cards populated with mock data. */
export const Loaded: Story = {
  render: () => {
    const container = document.createElement('div');
    m.mount(container, BatteryDashboard);
    return container;
  },
};
