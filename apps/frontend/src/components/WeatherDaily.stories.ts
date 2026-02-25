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
import { WeatherDaily, type WeatherDailyAttrs } from './WeatherDaily.js';


const meta: Meta<WeatherDailyAttrs> = {
  title: 'Components/WeatherDaily',

  render: (args) => {
    const container = document.createElement('div');
    m.render(container, m(WeatherDaily, args));
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

/** Clear week with calm conditions. */
export const ClearDay: Story = {
  args: { daily: WEATHER_CLEAR_DAY().daily },
};

/** Clear night forecast for the week. */
export const ClearNight: Story = {
  args: { daily: WEATHER_CLEAR_NIGHT().daily },
};

/** Partly cloudy week with light breezes. */
export const PartlyCloudy: Story = {
  args: { daily: WEATHER_PARTLY_CLOUDY().daily },
};

/** Rainy week with high precipitation probability. */
export const Rainy: Story = {
  args: { daily: WEATHER_RAINY().daily },
};

/** Stormy week with thunderstorms and gusty winds. */
export const Stormy: Story = {
  args: { daily: WEATHER_STORMY().daily },
};

/** Snowy week with cold temperatures. */
export const Snowy: Story = {
  args: { daily: WEATHER_SNOWY().daily },
};

/** Windy week with strong sustained winds. */
export const Windy: Story = {
  args: { daily: WEATHER_WINDY().daily },
};

/** Hot week with extreme temperatures. */
export const Hot: Story = {
  args: { daily: WEATHER_HOT().daily },
};
