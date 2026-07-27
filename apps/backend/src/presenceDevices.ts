/**
 * Helpers for the RTDB `/presence-devices` tree:
 * `{ person: { mac: deviceLabel } }`.
 */

/** A single tracked device used when generating the router whitelist. */
export interface TrackedDevice {
  /** MAC address (uppercase, colon-separated) */
  readonly mac: string;
  /** Person name */
  readonly name: string;
  /** Optional device label from RTDB */
  readonly device?: string;
}

/**
 * Type guard for plain object records.
 * @param value Candidate value
 * @returns Whether value is a non-null, non-array object
 */
const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

/**
 * Inverts a presence-devices tree into MAC (uppercase) → person name.
 * Invalid entries are skipped.
 * @param raw Value at `/presence-devices`
 * @returns Map of normalized MAC to person
 */
export function invertPresenceDevices(raw: unknown): Readonly<Record<string, string>> {
  const map: Record<string, string> = {};
  if (!isRecord(raw)) {
    return map;
  }

  for (const [person, devices] of Object.entries(raw)) {
    if (!isRecord(devices)) {
      continue;
    }
    for (const mac of Object.keys(devices)) {
      const key = mac.trim().toUpperCase();
      if (key) {
        map[key] = person;
      }
    }
  }

  return map;
}

/**
 * Flattens a presence-devices tree into tracked-device rows for script generation.
 * Invalid entries are skipped.
 * @param raw Value at `/presence-devices`
 * @returns List of devices with person name and optional label
 */
export function flattenPresenceDevices(raw: unknown): readonly TrackedDevice[] {
  if (!isRecord(raw)) {
    return [];
  }

  const devices: TrackedDevice[] = [];
  for (const [person, deviceMap] of Object.entries(raw)) {
    if (!isRecord(deviceMap)) {
      continue;
    }
    for (const [mac, label] of Object.entries(deviceMap)) {
      const normalized = mac.trim().toUpperCase();
      if (!normalized) {
        continue;
      }
      devices.push({
        mac: normalized,
        name: person,
        ...(typeof label === 'string' && label.length > 0 ? { device: label } : {}),
      });
    }
  }

  return devices;
}
