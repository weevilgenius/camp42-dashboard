import { beforeEach, describe, expect, it, vi } from 'vitest';

const SECRET = '2080A250-CCA3-4317-9535-2D03F0FC5698';
const mockUpdate = vi.fn();
const mockOnce = vi.fn();
const mockRef = vi.fn(() => ({ once: mockOnce, update: mockUpdate }));
const mockWarn = vi.fn();

const PRESENCE_DEVICES = {
  Alice: { 'AA:BB:CC:DD:EE:01': 'Phone' },
  Bob: { 'AA:BB:CC:DD:EE:02': 'Tablet' },
} as const;

vi.mock('firebase-admin/database', () => ({
  getDatabase: () => ({ ref: mockRef }),
  ServerValue: { TIMESTAMP: { '.sv': 'timestamp' } },
}));
vi.mock('firebase-functions', () => ({ logger: { warn: mockWarn } }));
vi.mock('../src/config.js', () => ({
  PRESENCE_SECRET: { value: () => SECRET },
}));

const { presence } = await import('../src/presence.js');

describe('presence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdate.mockResolvedValue(undefined);
    mockOnce.mockImplementation(() => Promise.resolve({
      val: () => PRESENCE_DEVICES,
    }));
  });

  it('updates known devices and returns 204', async () => {
    const response = mockResponse();

    await presence({
      method: 'POST',
      body: { present: ['AA:BB:CC:DD:EE:01', 'aa:bb:cc:dd:ee:02'] },
      headers: {},
      get: () => `Bearer ${SECRET}`,
    } as never, response as never);

    expect(mockRef).toHaveBeenCalledWith('presence-devices');
    expect(mockRef).toHaveBeenCalledWith('presence');
    expect(mockUpdate).toHaveBeenCalledWith({
      Alice: { '.sv': 'timestamp' },
      Bob: { '.sv': 'timestamp' },
    });
    expect(response.set).toHaveBeenCalledWith('Connection', 'close');
    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.send).toHaveBeenCalledWith();
  });

  it('logs unknown devices while returning 204', async () => {
    const response = mockResponse();

    await presence({
      method: 'POST',
      body: { present: ['unknown'] },
      headers: {},
      get: () => `Bearer ${SECRET}`,
    } as never, response as never);

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockWarn).toHaveBeenCalledWith('Ignoring unknown presence MAC address', { mac: 'unknown' });
    expect(response.status).toHaveBeenCalledWith(204);
  });

  it('treats missing presence-devices as all unknown', async () => {
    const response = mockResponse();
    mockOnce.mockResolvedValue({ val: () => null });

    await presence({
      method: 'POST',
      body: { present: ['AA:BB:CC:DD:EE:01'] },
      headers: {},
      get: () => `Bearer ${SECRET}`,
    } as never, response as never);

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockWarn).toHaveBeenCalledWith('Ignoring unknown presence MAC address', {
      mac: 'AA:BB:CC:DD:EE:01',
    });
    expect(response.status).toHaveBeenCalledWith(204);
  });

  it('rejects unauthorized requests', async () => {
    const response1 = mockResponse();
    await presence({ method: 'POST', body: { present: [] }, headers: {}, get: () => 'wrong' } as never, response1 as never);
    expect(response1.set).toHaveBeenCalledWith('Connection', 'close');
    expect(response1.sendStatus).toHaveBeenCalledWith(401);

    const response2 = mockResponse();
    await presence({ method: 'POST', body: { present: [] }, headers: {}, get: () => SECRET } as never, response2 as never);
    expect(response2.set).toHaveBeenCalledWith('Connection', 'close');
    expect(response2.sendStatus).toHaveBeenCalledWith(401);
  });

  it('closes malformed POST requests', async () => {
    const response = mockResponse();

    await presence({ method: 'POST', body: {}, headers: {}, get: () => `Bearer ${SECRET}` } as never, response as never);

    expect(response.set).toHaveBeenCalledWith('Connection', 'close');
    expect(response.sendStatus).toHaveBeenCalledWith(400);
  });

  it('rejects GET requests', async () => {
    const response = mockResponse();

    await presence({ method: 'GET', headers: {} } as never, response as never);

    expect(response.set).toHaveBeenCalledWith('Allow', 'POST');
    expect(response.sendStatus).toHaveBeenCalledWith(405);
  });
});

/** Creates the minimal Express response mock needed by the endpoint. */
function mockResponse() {
  const response = {
    getHeader: vi.fn(),
    json: vi.fn(),
    on: vi.fn(),
    send: vi.fn(),
    sendStatus: vi.fn(),
    set: vi.fn(),
    setHeader: vi.fn(),
    status: vi.fn(),
  };
  response.status.mockReturnValue(response);
  response.set.mockReturnValue(response);
  return response;
}
