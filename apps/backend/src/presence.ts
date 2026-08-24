import { timingSafeEqual } from 'node:crypto';
import { getDatabase, ServerValue } from 'firebase-admin/database';
import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/https';

import { PRESENCE_SECRET } from './config.js';
import { flattenPresenceDevices, invertPresenceDevices } from './presenceDevices.js';

/* ========================================================= *\
 *  Presence reporting                                        *
\* ========================================================= */

/**
 * Loads the MAC → person map from RTDB `/presence-devices`.
 * @returns Map of normalized MAC to person name
 */
const getUsersByMac = async (): Promise<Readonly<Record<string, string>>> => {
  const snapshot = await getDatabase().ref('presence-devices').once('value');
  const val: unknown = snapshot.val();
  return invertPresenceDevices(val);
};

/**
 * Checks whether an Authorization header matches the configured shared secret.
 * @param authorization Authorization header value
 * @returns Whether the caller is authorized
 */
const isAuthorized = (authorization: string | undefined): boolean => {
  const expected = Buffer.from(`Bearer ${PRESENCE_SECRET.value()}`);
  const received = Buffer.from(authorization ?? '');
  return expected.length === received.length && timingSafeEqual(expected, received);
};

/**
 * Extracts a list of MAC addresses from a presence request body.
 * @param body Request body
 * @returns The submitted MAC addresses, or null for an invalid payload
 */
const getPresentMacs = (body: unknown): readonly string[] | null => {
  if (!body || typeof body !== 'object' || !('present' in body)) { return null; }

  const present = body.present;
  return Array.isArray(present) && present.every((mac) => typeof mac === 'string') ? present : null;
};

/**
 * HTTPS endpoint that records presence data from the camp router.
 */
export const presence = onRequest({
  cors: true,
  secrets: [PRESENCE_SECRET],
}, async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'POST') {
    logger.warn(`rejecting request method ${request.method}`);
    response.set('Connection', 'close').set('Allow', 'GET, POST').sendStatus(405);
    return;
  }

  if (!isAuthorized(request.get('Authorization'))) {
    logger.warn('Missing or bad Authorization header, rejecting');
    response.set('Connection', 'close').sendStatus(401);
    return;
  }

  // GET flow: return the whitelisted MAC addresses
  if (request.method === 'GET') {
    const snapshot = await getDatabase().ref('presence-devices').once('value');
    // response format is flat string, comma separated
    const macs = flattenPresenceDevices(snapshot.val()).map(({ mac }) => mac).join(',');
    response.set('Connection', 'close').type('text/plain').status(200).send(macs);
    return;
  }

  // POST flow: update one or more presence records
  // parse the payload and extract MAC addresses
  const macs = getPresentMacs(request.body);
  if (!macs) {
    logger.warn('malformed or missing payload, rejecting');
    response.set('Connection', 'close').sendStatus(400);
    return;
  }

  const usersByMac = await getUsersByMac();
  const users = macs.flatMap((mac) => {
    const user = usersByMac[mac.trim().toUpperCase()];
    if (!user) { logger.warn('Ignoring unknown presence MAC address', { mac }); }
    return user ? [user] : [];
  });
  const updates = Object.fromEntries(users.map((user) => [user, ServerValue.TIMESTAMP]));

  if (Object.keys(updates).length > 0) {
    await getDatabase().ref('presence').update(updates);
  }

  // return HTTP 204 with empty response body
  response.set('Connection', 'close').status(204).send();
});
