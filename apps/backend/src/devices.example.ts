/**
 * Device mapping entry for presence detection.
 */
export interface TrackedDevice {
  /** MAC address of the tracked device */
  readonly mac: string;
  /** Display name of person */
  readonly name: string;
  /** Optional name/description of device */
  readonly device?: string;
}

/**
 * List of tracked devices.
 * Copy to devices.config.ts and add real devices.
 */
export const DEVICES: readonly TrackedDevice[] = [
  { mac: '00:00:00:00:00:01', name: 'Sample User', device: 'Sample Device' },
];
