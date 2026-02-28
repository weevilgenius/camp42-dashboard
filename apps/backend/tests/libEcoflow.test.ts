import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createEcoflowClient } from '../src/libEcoflow.js';

describe('createEcoflowClient', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // restore the real fetch in case a test forgot
    globalThis.fetch = originalFetch;
  });

  it('returns an object with listDevices and getState methods', () => {
    const client = createEcoflowClient('key', 'secret');

    expect(client).toHaveProperty('listDevices');
    expect(client).toHaveProperty('getState');
    expect(typeof client.listDevices).toBe('function');
    expect(typeof client.getState).toBe('function');
  });

  it('listDevices sends a GET request to the device list endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ code: "0", data: [] }),
    });
    globalThis.fetch = mockFetch;

    const client = createEcoflowClient('testkey', 'testsecret');
    await client.listDevices();

    expect(mockFetch).toHaveBeenCalledOnce();
    const url = mockFetch.mock.calls[0]?.[0] as string | URL;
    expect(String(url)).toContain('/iot-open/sign/device/list');
  });

  it('getState sends a GET request with the serial number parameter', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ code: "0", data: {} }),
    });
    globalThis.fetch = mockFetch;

    const client = createEcoflowClient('testkey', 'testsecret');
    await client.getState('SN12345');

    expect(mockFetch).toHaveBeenCalledOnce();
    const url = String(mockFetch.mock.calls[0]?.[0] as string | URL);
    expect(url).toContain('/iot-open/sign/device/quota/all');
    // the SN should appear somewhere in the URL query string
    expect(url).toContain('SN12345');
  });
});
