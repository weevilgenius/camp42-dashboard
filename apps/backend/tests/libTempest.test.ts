import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTempestClient } from '../src/libTempest.js';

describe('createTempestClient', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('returns an object with the expected API methods', () => {
    const client = createTempestClient('token');

    expect(client).toHaveProperty('listStations');
    expect(client).toHaveProperty('getStation');
    expect(client).toHaveProperty('getStationObservations');
    expect(client).toHaveProperty('getForecast');
  });

  it('listStations calls the /stations endpoint with the token', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: { status_code: 0 }, stations: [] }),
    });
    globalThis.fetch = mockFetch;

    const client = createTempestClient('mytoken');
    await client.listStations();

    expect(mockFetch).toHaveBeenCalledOnce();
    const url = String(mockFetch.mock.calls[0][0]);
    expect(url).toContain('/stations');
    expect(url).toContain('token=mytoken');
  });

  it('getStation calls the /stations/:id endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: { status_code: 0 }, stations: [] }),
    });
    globalThis.fetch = mockFetch;

    const client = createTempestClient('tok');
    await client.getStation(12345);

    const url = String(mockFetch.mock.calls[0][0]);
    expect(url).toContain('/stations/12345');
  });

  it('getStationObservations calls the /observations/station/:id endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: { status_code: 0 }, obs: [] }),
    });
    globalThis.fetch = mockFetch;

    const client = createTempestClient('tok');
    await client.getStationObservations(99);

    const url = String(mockFetch.mock.calls[0][0]);
    expect(url).toContain('/observations/station/99');
  });

  it('getForecast calls the /better_forecast endpoint with unit parameters', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: { status_code: 0 } }),
    });
    globalThis.fetch = mockFetch;

    const client = createTempestClient('tok');
    await client.getForecast(100, 'c', 'kph', 'mb', 'mm', 'km');

    const url = String(mockFetch.mock.calls[0][0]);
    expect(url).toContain('/better_forecast');
    expect(url).toContain('station_id=100');
    expect(url).toContain('units_temp=c');
    expect(url).toContain('units_wind=kph');
    expect(url).toContain('units_pressure=mb');
    expect(url).toContain('units_precip=mm');
    expect(url).toContain('units_distance=km');
  });

  it('uses default imperial units when none are specified', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: { status_code: 0 } }),
    });
    globalThis.fetch = mockFetch;

    const client = createTempestClient('tok');
    await client.getForecast(100);

    const url = String(mockFetch.mock.calls[0][0]);
    expect(url).toContain('units_temp=f');
    expect(url).toContain('units_wind=mph');
    expect(url).toContain('units_pressure=inhg');
    expect(url).toContain('units_precip=in');
    expect(url).toContain('units_distance=mi');
  });

  it('throws on non-OK HTTP responses', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: () => Promise.resolve('Invalid token'),
    });
    globalThis.fetch = mockFetch;

    const client = createTempestClient('bad-token');

    await expect(client.listStations()).rejects.toThrow('401 Unauthorized');
  });
});
