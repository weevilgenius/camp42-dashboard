import { httpsCallable } from 'firebase/functions';

import { functions } from '../firebase.js';

const getPresence = httpsCallable<void, Record<string, number>>(functions, 'getPresence');

/** Fetches the elapsed seconds since each person was last seen at camp. */
export async function fetchPresence(): Promise<Record<string, number>> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const mock = await import('@camp42/mocks/src/service.js');
    return mock.fetchPresence();
  }

  return (await getPresence()).data;
}
