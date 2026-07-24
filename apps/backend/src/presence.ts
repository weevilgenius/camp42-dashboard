import { timingSafeEqual } from 'node:crypto';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase, ServerValue } from 'firebase-admin/database';
import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/https';

import { PRESENCE_SECRET } from './config.js';
import { DEVICES } from './devices.config.js';

/* ========================================================= *\
 *  Presence reporting                                        *
\* ========================================================= */

// map device MAC addresses to people
const USERS_BY_MAC: Readonly<Record<string, string>> = Object.fromEntries(
  DEVICES.map((device) => [device.mac.trim().toUpperCase(), device.name])
);


// initialize Firebase
initializeApp();

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
 * Verifies the Firebase ID token supplied by a dashboard user.
 * @param authorization Authorization header value
 * @returns Whether the caller is signed in
 */
const isSignedIn = async (authorization: string | undefined): Promise<boolean> => {
  if (!authorization?.startsWith('Bearer ')) { return false; }

  try {
    await getAuth().verifyIdToken(authorization.slice('Bearer '.length));
    return true;
  } catch {
    return false;
  }
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
 * HTTPS endpoint that records and reads presence data.
 */
export const presence = onRequest({
  cors: true,
  secrets: [PRESENCE_SECRET],
}, async (request, response) => {
  // GET flow: return the presence data
  if (request.method === 'GET') {
    // note: if this were a Firebase "callable" function, we could look at
    // request.auth. Since it's a regular HTTPS function, we have to decode the
    // token ourselves
    if (!await isSignedIn(request.get('Authorization'))) {
      logger.warn("No authorization or user is not logged in, rejecting");
      response.sendStatus(401);
      return;
    }

    const values = (await getDatabase().ref('presence').once('value')).val() as Record<string, unknown> | null;
    const now = Date.now();
    const timestamps = Object.entries(values ?? {})
      .filter((entry): entry is [string, number] => typeof entry[1] === 'number');
    const secondsAgo = Object.fromEntries(timestamps
      .map(([user, timestamp]) => [user, Math.max(0, Math.floor((now - timestamp) / 1000))]));

    response.json(secondsAgo);
    return;
  }

  if (request.method !== 'POST') {
    logger.warn(`rejecting request method ${request.method}`);
    response.set('Connection', 'close').set('Allow', 'GET, POST').sendStatus(405);
    return;
  }

  // POST flow: update one or more presence records
  if (!isAuthorized(request.get('Authorization'))) {
    logger.warn('Missing or bad Authorization header, rejecting');
    response.set('Connection', 'close').sendStatus(401);
    return;
  }

  // parse the payload and extract MAC addresses
  const macs = getPresentMacs(request.body);
  if (!macs) {
    logger.warn('malformed or missing payload, rejecting');
    response.set('Connection', 'close').sendStatus(400);
    return;
  }

  const users = macs.flatMap((mac) => {
    const user = USERS_BY_MAC[mac.trim().toUpperCase()];
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
