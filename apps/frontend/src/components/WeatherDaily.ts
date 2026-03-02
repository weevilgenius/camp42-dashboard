import m from 'mithril';

// types shared with back end
import type { WeatherDaily as WeatherDailyData } from '@camp42/shared';

import { weatherIconUrl } from '../utilities.js';

// WebAwesome components
import '@awesome.me/webawesome/dist/components/card/card.js';

// CSS for this component
import './WeatherDaily.css';

/** Attrs for the WeatherDaily component. */
export interface WeatherDailyAttrs extends m.Attributes {
  /** Array of daily forecast data. */
  daily: WeatherDailyData[];
}

/** Displays a vertical list of daily forecasts. */
export const WeatherDaily: m.ClosureComponent<WeatherDailyAttrs> = () => {
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

  /** Converts a unix epoch (seconds) to a short weekday name. */
  const formatDayName = (epoch: number): string => {
    const day = new Date(epoch * 1000).getUTCDay();
    return DAY_NAMES[day];
  };

  return {
    view: ({ attrs }) => {
      return m('.weather-daily', attrs.daily.map((day) =>
        m('wa-card',
          {
            key: day.day_start_local,
          },
          m('.row', [

            // day of week + day of month, with conditions below
            m('.day', [
              m('span.date', `${formatDayName(day.day_start_local)} ${day.day_num}`),
              m('span.conditions', day.conditions),
            ]),

            // forecast icon
            m('.icon', m('img', { src: weatherIconUrl(day.icon), alt: day.conditions })),

            // extra whitespace
            m('.spacer'),

            // high/low temps
            m('.temps', [
              m('span.high', `${Math.round(day.air_temp_high)}\u00B0`),
              m('span.low', `${Math.round(day.air_temp_low)}\u00B0`),
            ]),

            // chance of precipitation
            m('.precip', `${day.precip_probability}%`),

          ]),
        ),
      ));
    },
  };
};
export default WeatherDaily;
