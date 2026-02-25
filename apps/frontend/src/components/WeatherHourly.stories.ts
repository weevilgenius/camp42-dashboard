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
import { WeatherHourly, type WeatherHourlyAttrs } from './WeatherHourly.js';


const meta: Meta<WeatherHourlyAttrs> = {
  title: 'Components/WeatherHourly',

  render: (args) => {
    const container = document.createElement('div');
    m.render(container, m(WeatherHourly, args));
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

/** Clear day with calm hourly conditions. */
export const ClearDay: Story = {
  args: { hourly: WEATHER_CLEAR_DAY().hourly },
};

/** Clear night hourly forecast. */
export const ClearNight: Story = {
  args: { hourly: WEATHER_CLEAR_NIGHT().hourly },
};

/** Partly cloudy hourly forecast. */
export const PartlyCloudy: Story = {
  args: { hourly: WEATHER_PARTLY_CLOUDY().hourly },
};

/** Rainy hourly forecast with high precipitation. */
export const Rainy: Story = {
  args: { hourly: WEATHER_RAINY().hourly },
};

/** Stormy hourly forecast with thunderstorms. */
export const Stormy: Story = {
  args: { hourly: WEATHER_STORMY().hourly },
};

/** Snowy hourly forecast with cold temperatures. */
export const Snowy: Story = {
  args: { hourly: WEATHER_SNOWY().hourly },
};

/** Windy hourly forecast with strong winds. */
export const Windy: Story = {
  args: { hourly: WEATHER_WINDY().hourly },
};

/** Hot hourly forecast with extreme heat. */
export const Hot: Story = {
  args: { hourly: WEATHER_HOT().hourly },
};
