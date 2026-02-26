import m from 'mithril';

// WebAwesome components
import '@awesome.me/webawesome/dist/components/skeleton/skeleton.js';

// use CSS from existing components so that the skeleton looks similar
import './BatteryCard.css';

/** Renders a single battery card skeleton placeholder. */
const cardSkeleton = () =>
  m('.battery-card', [
    m('.header', [
      m('div', [
        m('wa-skeleton', { effect: 'sheen', style: 'width: 6rem; height: 1.125rem;' }),
        m('wa-skeleton', { effect: 'sheen', style: 'width: 5rem; height: 0.8rem; margin-top: 0.25rem;' }),
      ]),
      m('wa-skeleton', { effect: 'sheen', style: 'width: 3.5rem; height: 1.5rem; --border-radius: 1rem;' }),
    ]),

    m('.charge', [
      m('wa-skeleton', { effect: 'sheen', style: 'width: 100%; height: 1rem; --border-radius: 0.25rem;' }),
    ]),

    m('.stats', [
      m('.stat', [
        m('wa-skeleton', { effect: 'sheen', style: 'width: 2.5rem; height: 0.75rem;' }),
        m('wa-skeleton', { effect: 'sheen', style: 'width: 3rem; height: 0.95rem; margin-top: 0.125rem;' }),
      ]),
      m('.stat', [
        m('wa-skeleton', { effect: 'sheen', style: 'width: 2.5rem; height: 0.75rem;' }),
        m('wa-skeleton', { effect: 'sheen', style: 'width: 3rem; height: 0.95rem; margin-top: 0.125rem;' }),
      ]),
    ]),

    m('.panels', [
      m('.panel', [
        m('wa-skeleton', { effect: 'sheen', style: 'width: 2rem; height: 1.25rem; --border-radius: 1rem;' }),
        m('wa-skeleton', { effect: 'sheen', style: 'width: 2.5rem; height: 0.85rem;' }),
      ]),
      m('.panel', [
        m('wa-skeleton', { effect: 'sheen', style: 'width: 2rem; height: 1.25rem; --border-radius: 1rem;' }),
        m('wa-skeleton', { effect: 'sheen', style: 'width: 2.5rem; height: 0.85rem;' }),
      ]),
    ]),
  ]);

/** Skeleton placeholder for the BatteryDashboard loading state. */
export const BatteryDashboardSkeleton: m.Component = {
  view: () =>
    m('.grid', [cardSkeleton(), cardSkeleton()]),
};
export default BatteryDashboardSkeleton;
