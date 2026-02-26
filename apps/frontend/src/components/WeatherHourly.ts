import m from 'mithril';

// types shared with back end
import type { WeatherHourly as WeatherHourlyData } from '@camp42/shared';

import { weatherIconUrl } from '../utilities.js';

// CSS for this component
import './WeatherHourly.css';

/** Attrs for the WeatherHourly component. */
export interface WeatherHourlyAttrs extends m.Attributes {
  /** Array of hourly forecast data. */
  hourly: WeatherHourlyData[];
}

/** Displays a horizontally scrollable row of hourly forecasts. */
export const WeatherHourly: m.ClosureComponent<WeatherHourlyAttrs> = () => {
  /**
   * Converts a 0-23 hour value to a 12-hour time string.
   * E.g. 0 -> "12 AM", 13 -> "1 PM".
   */
  const formatHour = (hour: number): string => {
    const suffix = hour < 12 ? 'AM' : 'PM';
    const h = hour % 12 || 12;
    return `${h} ${suffix}`;
  };

  return {
    view: ({ attrs }) => {
      return m('.weather-hourly', [

        // horizontally scrolling container
        m('.scroll', attrs.hourly.map((hour) =>

          // each hour is a vertical stack
          m('.item', { key: hour.time }, [
            // hour
            m('.time', formatHour(hour.local_hour)),
            // prediction icon
            m('.icon', m('img', { src: weatherIconUrl(hour.icon), alt: hour.conditions })),
            // temperature
            m('.temp', `${Math.round(hour.air_temperature)}\u00B0`),
            // precipitation chance
            hour.precip_probability > 0
              ? m('.precip', `${hour.precip_probability}%`)
              : null,
          ]),
        )),
      ]);
    },
  };
};
export default WeatherHourly;
