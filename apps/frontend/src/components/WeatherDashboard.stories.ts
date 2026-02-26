import m from 'mithril';
import type { Meta, StoryObj as Story } from '@storybook/web-components-vite';
import { WeatherDashboard } from './WeatherDashboard.js';


const meta: Meta = {
  title: 'Dashboards/WeatherDashboard',

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
    m.render(container, m(WeatherDashboard));
    return container;
  },
};

/** Loaded state: weather sections populated with mock data. */
export const Loaded: Story = {
  render: () => {
    const container = document.createElement('div');
    m.mount(container, WeatherDashboard);
    return container;
  },
};
