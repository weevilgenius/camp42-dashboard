import m from 'mithril';
import type { Meta, StoryObj as Story } from '@storybook/web-components-vite';
import { SummaryCard } from './SummaryCard.js';


const meta: Meta = {
  title: 'Components/SummaryCard',

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

/** Loading state: skeleton placeholders before the AI response arrives. */
export const Loading: Story = {
  render: () => {
    const container = document.createElement('div');
    m.render(container, m(SummaryCard));
    return container;
  },
};

/** Loaded state: rendered AI summary from the mock service (when VITE_USE_MOCKS=true). */
export const Loaded: Story = {
  render: () => {
    const container = document.createElement('div');
    m.mount(container, SummaryCard);
    return container;
  },
};
