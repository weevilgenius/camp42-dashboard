import m from 'mithril';

// WebAwesome components
import '@awesome.me/webawesome/dist/components/skeleton/skeleton.js';
import '@awesome.me/webawesome/dist/components/card/card.js';

// use CSS from existing components so that the skeleton looks similar
import './WeatherCurrent.css';
import './WeatherHourly.css';
import './WeatherDaily.css';

const EFFECT = 'sheen';

/** Skeleton placeholder for the WeatherCurrent section. */
const currentSkeleton = () =>
  m('.weather-current', [
    m('.main', [
      m('.icon', [
        m('wa-skeleton', { effect: EFFECT, style: 'width: 100%; height: 100%;' }),
      ]),
      m('.temps', [
        m('wa-skeleton', { effect: EFFECT, style: 'width: 4rem; height: 3rem;' }),
        m('wa-skeleton', { effect: EFFECT, style: 'width: 7rem; height: 0.875rem; margin-top: 0.125rem;' }),
        m('wa-skeleton', { effect: EFFECT, style: 'width: 5rem; height: 1rem; margin-top: 0.25rem;' }),
      ]),
    ]),
    m('.stats', [
      m('.stat', [
        m('wa-skeleton', { effect: EFFECT, style: 'width: 3.5rem; height: 0.75rem;' }),
        m('wa-skeleton', { effect: EFFECT, style: 'width: 2.5rem; height: 0.9375rem; margin-top: 0.125rem;' }),
      ]),
      m('.stat', [
        m('wa-skeleton', { effect: EFFECT, style: 'width: 2rem; height: 0.75rem;' }),
        m('wa-skeleton', { effect: EFFECT, style: 'width: 5rem; height: 0.9375rem; margin-top: 0.125rem;' }),
      ]),
      m('.stat', [
        m('wa-skeleton', { effect: EFFECT, style: 'width: 5rem; height: 0.75rem;' }),
        m('wa-skeleton', { effect: EFFECT, style: 'width: 2rem; height: 0.9375rem; margin-top: 0.125rem;' }),
      ]),
    ]),
  ]);

/** Skeleton placeholder for a single hourly forecast item. */
const hourlyItemSkeleton = () =>
  m('.item', [
    m('wa-skeleton', { effect: EFFECT, style: 'width: 2.5rem; height: 0.75rem;' }),
    m('.icon', [
      m('wa-skeleton', { effect: EFFECT, style: 'width: 100%; height: 100%;' }),
    ]),
    m('wa-skeleton', { effect: EFFECT, style: 'width: 2rem; height: 0.9375rem;' }),
  ]);

/** Skeleton placeholder for the WeatherHourly section. */
const hourlySkeleton = () =>
  m('.weather-hourly', [
    m('.scroll', Array.from({ length: 6 }, () => hourlyItemSkeleton())),
  ]);

/** Skeleton placeholder for a single daily forecast row. */
const dailyRowSkeleton = () =>
  m('wa-card', [
    m('.row', [
      m('.day', [
        m('wa-skeleton', { effect: EFFECT, style: 'width: 3.5rem; height: 0.875rem;' }),
        m('wa-skeleton', { effect: EFFECT, style: 'width: 4.5rem; height: 0.7rem; margin-top: 0.25rem;' }),
      ]),
      m('.icon', [
        m('wa-skeleton', { effect: EFFECT, style: 'width: 100%; height: 100%;' }),
      ]),
      m('.spacer'),
      m('.temps', [
        m('wa-skeleton', { effect: EFFECT, style: 'width: 2rem; height: 0.9375rem;' }),
        m('wa-skeleton', { effect: EFFECT, style: 'width: 2rem; height: 0.9375rem;' }),
      ]),
      m('.precip', [
        m('wa-skeleton', { effect: EFFECT, style: 'width: 1.5rem; height: 0.75rem;' }),
      ]),
    ]),
  ]);

/** Skeleton placeholder for the WeatherDaily section. */
const dailySkeleton = () =>
  m('.weather-daily', Array.from({ length: 5 }, () => dailyRowSkeleton()));

/** Skeleton placeholder for the WeatherDashboard loading state. */
export const WeatherDashboardSkeleton: m.Component = {
  view: () => [
    currentSkeleton(),
    hourlySkeleton(),
    dailySkeleton(),
  ],
};
export default WeatherDashboardSkeleton;
