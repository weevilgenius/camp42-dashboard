import { getDatabase } from 'firebase-admin/database';
import { HttpsError, onCall } from 'firebase-functions/https';

/* ========================================================= *\
 *  Presence retrieval                                        *
\* ========================================================= */

/**
 * Callable endpoint that returns elapsed seconds since each person was last seen.
 */
export const getPresence = onCall<void, Promise<Record<string, number>>>(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Sign in is required to view presence');
  }

  const values = (await getDatabase().ref('presence').once('value')).val() as Record<string, unknown> | null;
  const now = Date.now();
  const timestamps = Object.entries(values ?? {})
    .filter((entry): entry is [string, number] => typeof entry[1] === 'number');

  return Object.fromEntries(timestamps
    .map(([user, timestamp]) => [user, Math.max(0, Math.floor((now - timestamp) / 1000))]));
});
