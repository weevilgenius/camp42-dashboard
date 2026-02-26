import m from 'mithril';

import type { WeatherStatus } from '@camp42/shared';

import { fetchWeatherStatus } from '../services/campStatus.js';
import { WeatherCurrent } from './WeatherCurrent.js';
import { WeatherDaily } from './WeatherDaily.js';
import { WeatherHourly } from './WeatherHourly.js';

// WebAwesome components
import '@awesome.me/webawesome/dist/components/spinner/spinner.js';
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/icon/icon.js';

import './WeatherDashboard.css';

/** Fetches and displays weather status. */
export const WeatherDashboard: m.ClosureComponent = () => {
  const state = {
    loading: true,
    error: null as string | null,
    weather: null as WeatherStatus | null,
  };

  const load = async () => {
    state.loading = true;
    state.error = null;
    m.redraw();

    try {
      state.weather = await fetchWeatherStatus();
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      state.loading = false;
      m.redraw();
    }
  };

  return {
    oninit: () => {
      void load();
    },

    view: () => {
      return m('.weather-dashboard', [
        m('.header', [
          m('h2.title', 'Weather'),
          m(
            'wa-button',
            {
              variant: 'neutral',
              appearance: 'outlined',
              size: 'small',
              disabled: state.loading,
              onclick: () => {
                void load();
              },
            },
            [
              m('wa-icon', { library: 'material', name: 'refresh', slot: 'start' }), 'Refresh',
            ],
          ),
        ]),

        state.loading
          ? m('.loading', [m('wa-spinner'), m('span', 'Loading...')])
          : state.error
            ? m('.error', [
              m('p', state.error),
              m(
                'wa-button',
                {
                  variant: 'default',
                  onclick: () => {
                    void load();
                  },
                },
                'Retry',
              ),
            ])
            : state.weather
              ? [
                m(WeatherCurrent, { current: state.weather.current }),
                m(WeatherHourly, { hourly: state.weather.hourly }),
                m(WeatherDaily, { daily: state.weather.daily }),
              ]
              : null,
      ]);
    },
  };
};
export default WeatherDashboard;
