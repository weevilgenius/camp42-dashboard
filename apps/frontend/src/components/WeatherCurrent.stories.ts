import m from 'mithril';
import type { Meta, StoryObj as Story } from '@storybook/web-components-vite';
import {
  WEATHER_CLEAR_DAY,
  WEATHER_CLEAR_NIGHT,
  WEATHER_PARTLY_CLOUDY,
  WEATHER_RAINY,
  WEATHER_STORMY,
  WEATHER_SNOWY,
  WEATHER_WINDY,
  WEATHER_HOT,
} from '@camp42/mocks';
import { WeatherCurrent, type WeatherCurrentAttrs } from './WeatherCurrent.js';


const meta: Meta<WeatherCurrentAttrs> = {
  title: 'Components/WeatherCurrent',

  render: (args) => {
    const container = document.createElement('div');
    m.render(container, m(WeatherCurrent, args));
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

/** Clear day, 78F with calm winds and no precipitation. */
export const ClearDay: Story = {
  args: { current: WEATHER_CLEAR_DAY().current },
};

/** Clear night, 55F with calm winds. */
export const ClearNight: Story = {
  args: { current: WEATHER_CLEAR_NIGHT().current },
};

/** Partly cloudy, 72F with a light breeze. */
export const PartlyCloudy: Story = {
  args: { current: WEATHER_PARTLY_CLOUDY().current },
};

/** Heavy rain, 58F with 90% precipitation probability. */
export const Rainy: Story = {
  args: { current: WEATHER_RAINY().current },
};

/** Thunderstorms, 62F with 25mph gusts. */
export const Stormy: Story = {
  args: { current: WEATHER_STORMY().current },
};

/** Snow, 28F with 80% precipitation probability. */
export const Snowy: Story = {
  args: { current: WEATHER_SNOWY().current },
};

/** Windy, 65F with 30mph sustained winds. */
export const Windy: Story = {
  args: { current: WEATHER_WINDY().current },
};

/** Extreme heat, 105F with feels-like 110F. */
export const Hot: Story = {
  args: { current: WEATHER_HOT().current },
};
