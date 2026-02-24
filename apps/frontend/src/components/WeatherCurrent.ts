import m from 'mithril';

import type { WeatherCurrent as WeatherCurrentData } from '@camp42/shared';

import { weatherIconUrl } from '../utilities.js';
import './WeatherCurrent.css';

/** Attrs for the WeatherCurrent component. */
export interface WeatherCurrentAttrs extends m.Attributes {
  /** Current weather conditions data. */
  current: WeatherCurrentData;
}

/** Displays current weather conditions prominently. */
export const WeatherCurrent: m.ClosureComponent<WeatherCurrentAttrs> = () => {
  return {
    view: ({ attrs }) => {
      const { current } = attrs;

      return m('.weather-current', [
        m('.main', [

          // current conditions icon
          m('.icon', m('img', { src: weatherIconUrl(current.icon), alt: current.conditions })),

          // temperatures
          m('.temps', [
            m('.temp', `${Math.round(current.air_temperature)}\u00B0`),
            m('.feels', `Feels like ${Math.round(current.feels_like)}\u00B0`),
            // conditions string e.g. "Rain Likely"
            m('.condition', current.conditions),
          ]),

        ]),

        // weather details
        m('.stats', [

          // humidity
          m('.stat', [
            m('span.label', 'Humidity'),
            m('span.value', `${current.relative_humidity}%`),
          ]),

          // wind details
          m('.stat', [
            m('span.label', 'Wind'),
            m('span.value', `${Math.round(current.wind_avg)} mph ${current.wind_direction_cardinal}`),
          ]),

          // precipitation
          m('.stat', [
            m('span.label', 'Precipitation'),
            m('span.value', `${current.precip_probability}%`),
          ]),

        ]),
      ]);
    },
  };
};
export default WeatherCurrent;
