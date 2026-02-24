import { createHmac } from 'crypto';

import type { DeviceInfo } from './EcoflowTypes.js';

const ECOFLOW_API = "https://api-a.ecoflow.com";

/* ========================================================= *\
 *  Public interface                                         *
\* ========================================================= */

/** Common envelope for all EcoFlow API responses. */
export interface EcoflowResponse<T> {
  /** Status code. `"0"` indicates success. */
  code: string;
  /** Human-readable status message. */
  message?: string;
  /** Response payload, varies by endpoint. */
  data?: T;
  /** Trace ID for debugging. */
  eagleEyeTraceId?: string;
  /** Transaction ID. */
  tid?: string;
}


/** Client for the EcoFlow IoT Open API. */
export interface EcoflowClient {
  /** List all devices associated with the account. */
  listDevices(): Promise<EcoflowResponse<DeviceInfo[]>>;
  /** Query all data for a device. */
  getState<T = Record<string, unknown>>(sn: string): Promise<EcoflowResponse<T>>;
}

/**
 * Create an authenticated EcoFlow API client.
 *
 * All requests are automatically signed using the provided credentials.
 */
export function createEcoflowClient(accessKey: string, secretKey: string): EcoflowClient {
  return {
    listDevices: () => request<EcoflowResponse<DeviceInfo[]>>("/iot-open/sign/device/list", accessKey, secretKey),
    getState: <T = Record<string, unknown>>(sn: string) => request<EcoflowResponse<T>>("/iot-open/sign/device/quota/all", accessKey, secretKey, { params: { sn } }),
  };
}

/* ========================================================= *\
 *  Internal helpers                                         *
\* ========================================================= */

/** Options for an API request. */
interface RequestOptions {
  /** Request parameters (may be nested). */
  params?: Record<string, unknown>;
  /** When true, send params as a JSON body (POST). Otherwise use query string (GET). */
  json?: boolean;
}

/**
 * Recursively flatten a nested object into dot/bracket notation for signature
 * computation.
 *
 * - Objects use dot notation:   `{ deviceInfo: { id: 1 } }` → `deviceInfo.id=1`
 * - Arrays use bracket notation: `{ ids: [1, 2] }` → `ids[0]=1&ids[1]=2`
 */
const flattenParams = (
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (Array.isArray(value)) {
      for (const [i, item] of value.entries()) {
        if (typeof item === 'object' && item !== null) {
          Object.assign(result, flattenParams(item as Record<string, unknown>, `${fullKey}[${i}]`));
        } else {
          result[`${fullKey}[${i}]`] = String(item);
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenParams(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }

  return result;
};

/**
 * Build the HMAC-SHA256 signature required by the EcoFlow API.
 *
 * Request params are sorted by ASCII key order and joined as `key=value`
 * pairs, then accessKey, nonce, and timestamp are appended in that fixed
 * order. The resulting string is signed with the secret key.
 */
const buildSignature = (
  params: Record<string, string>,
  accessKey: string,
  nonce: string,
  timestamp: string,
  secretKey: string,
): string => {
  const sorted = Object.keys(params).sort();
  const parts = sorted.map((k) => `${k}=${params[k]}`);
  parts.push(`accessKey=${accessKey}`, `nonce=${nonce}`, `timestamp=${timestamp}`);
  const str = parts.join('&');

  return createHmac('sha256', secretKey).update(str).digest('hex');
};

/**
 * Make a signed request to the EcoFlow API.
 *
 * - If `options.json` is true, parameters are sent as a JSON body with
 *   `Content-Type: application/json;charset=UTF-8` (POST).
 * - Otherwise parameters are appended as a query string (GET).
 *
 * The signature is always computed from the flattened parameter representation.
 */
const request = async <T>(
  path: string,
  accessKey: string,
  secretKey: string,
  options?: RequestOptions,
): Promise<T> => {
  const timestamp = Date.now().toString();
  const nonce = Math.random().toString().slice(2, 8);

  const flat = options?.params ? flattenParams(options.params) : {};
  const sign = buildSignature(flat, accessKey, nonce, timestamp, secretKey);

  const headers: Record<string, string> = {
    accessKey,
    timestamp,
    nonce,
    sign,
  };

  let url = ECOFLOW_API + path;
  let body: string | undefined;

  if (options?.json) {
    headers['Content-Type'] = 'application/json;charset=UTF-8';
    body = JSON.stringify(options.params);
  } else if (options?.params) {
    const qs = new URLSearchParams(flat).toString();
    url += '?' + qs;
  }

  const res = await fetch(url, {
    method: options?.json ? 'POST' : 'GET',
    headers,
    body,
  });

  return res.json() as Promise<T>;
};
