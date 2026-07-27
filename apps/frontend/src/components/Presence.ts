import m from 'mithril';

import './Presence.css';

/** Attrs for the Presence component. */
export interface PresenceAttrs extends m.Attributes {
  /** People mapped to the number of seconds since they were last seen. */
  presence?: Record<string, number>;
}

const MINUTE_SECONDS = 60;
const HOUR_SECONDS = 60 * MINUTE_SECONDS;
const DAY_SECONDS = 24 * HOUR_SECONDS;
const PRESENT_SECONDS = 15 * MINUTE_SECONDS;

/** Formats the number of seconds since a person was last seen. */
const formatPresence = (secondsAgo: number): string => {
  if (secondsAgo < HOUR_SECONDS) {
    const minutes = Math.floor(secondsAgo / MINUTE_SECONDS);
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  const hours = Math.floor(secondsAgo / HOUR_SECONDS);
  return `${hours} hour${hours === 1 ? '' : 's'} ago`;
};

/** Displays people recently detected at camp. */
export const Presence: m.Component<PresenceAttrs> = {
  view: ({ attrs }) => {
    const people = Object.entries(attrs.presence ?? {})
      .filter(([, secondsAgo]) => secondsAgo < DAY_SECONDS)
      .sort(([, firstSeen], [, secondSeen]) => firstSeen - secondSeen);
    const here = people.filter(([, secondsAgo]) => secondsAgo < PRESENT_SECONDS);
    const recentlySeen = people.filter(([, secondsAgo]) => secondsAgo >= PRESENT_SECONDS);

    return m('.presence', [
      m('h2', 'At Camp'),
      here.length > 0
        ? m('p.present', here.map(([name]) => name).join(', '))
        : m('p.empty', 'Nobody'),
      recentlySeen.length > 0
        ? [
          m('h3', 'Seen Recently'),
          m('ul.recent', recentlySeen.map(([name, secondsAgo]) =>
            m('li', { key: name }, [
              m('span.name', name), ` ${formatPresence(secondsAgo)}`,
            ]),
          )),
        ]
        : null,
    ]);
  },
};

export default Presence;
