import { auth } from '../firebase.js';

const PRESENCE_URL = import.meta.env.VITE_USE_EMULATOR === 'true'
  ? 'http://127.0.0.1:5001/camp42-dashboard/us-central1/presence'
  : 'https://presence-rtsxjuo3va-uc.a.run.app';

/** Fetches the elapsed seconds since each person was last seen at camp. */
export async function fetchPresence(): Promise<Record<string, number>> {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const mock = await import('@camp42/mocks/src/service.js');
    return mock.fetchPresence();
  }

  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    throw new Error('Sign in is required to view presence');
  }

  const response = await fetch(PRESENCE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response);
  if (!response.ok) {
    throw new Error(`Failed to fetch presence (${response.status})`);
  }

  const presence: unknown = await response.json();
  if (!presence || typeof presence !== 'object' || Array.isArray(presence)
    || Object.values(presence).some((value) => typeof value !== 'number')) {
    throw new Error('Invalid presence response');
  }

  return presence as Record<string, number>;
}
