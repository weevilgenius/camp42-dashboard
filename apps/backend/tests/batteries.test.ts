import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BatteryType } from '@camp42/shared';

// --------------------------------------------------------------------------
// Test the batteries module by mocking:
//   1. libEcoflow (the Ecoflow API client)
//   2. utils (the cache wrapper -- replaced with a passthrough)
// --------------------------------------------------------------------------

// passthrough cache so tests always invoke the real fetch logic
vi.mock('../src/utils.js', () => ({
  withCache: <T, A extends unknown[]>(fn: (...args: A) => Promise<T>) => fn,
}));

// mock the Ecoflow client
const mockListDevices = vi.fn();
const mockGetState = vi.fn();
vi.mock('../src/libEcoflow.js', () => ({
  createEcoflowClient: () => ({
    listDevices: mockListDevices,
    getState: mockGetState,
  }),
}));

const { getBatteryStates } = await import('../src/batteries.js');

describe('getBatteryStates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws when accessKey is empty', async () => {
    await expect(getBatteryStates('', 'secret')).rejects.toThrow('Missing Ecoflow accessKey or secretKey');
  });

  it('throws when secretKey is empty', async () => {
    await expect(getBatteryStates('key', '')).rejects.toThrow('Missing Ecoflow accessKey or secretKey');
  });

  it('returns two batteries with correct names and types', async () => {
    setupSuccessfulMocks();

    const [hank, bertha] = await getBatteryStates('key', 'secret');

    expect(hank.name).toBe('Hank');
    expect(hank.type).toBe(BatteryType.Delta_2_Max);
    expect(bertha.name).toBe('Bertha');
    expect(bertha.type).toBe(BatteryType.Delta_3_Pro);
  });

  it('sets online status from the device list', async () => {
    setupSuccessfulMocks();

    const [hank, bertha] = await getBatteryStates('key', 'secret');

    expect(hank.online).toBe(true);
    expect(bertha.online).toBe(true);
  });

  it('parses Delta 2 Max state fields correctly', async () => {
    setupSuccessfulMocks();

    const [hank] = await getBatteryStates('key', 'secret');

    expect(hank.state.charge_pct).toBe(78);
    expect(hank.state.dc_on).toBe(true);
    expect(hank.state.dc_watts).toBe(12);
    expect(hank.state.ac_on).toBe(true);
    expect(hank.state.ac_watts).toBe(45);
    expect(hank.state.total_output).toBe(57);
    // total_input = inv.inputWatts + mppt.inWatts = 80 + 130 = 210
    expect(hank.state.total_input).toBe(210);
  });

  it('parses Delta Pro 3 state fields correctly', async () => {
    setupSuccessfulMocks();

    const [_, bertha] = await getBatteryStates('key', 'secret');

    // cmsBattSoc 65.2 rounds to 65
    expect(bertha.state.charge_pct).toBe(65);
    // flowInfo12v !== 0 means DC is on
    expect(bertha.state.dc_on).toBe(false);
    expect(bertha.state.dc_watts).toBe(0);
    // flowInfoAcLvOut !== 0 means AC is on
    expect(bertha.state.ac_on).toBe(true);
    // Math.abs(-120) = 120
    expect(bertha.state.ac_watts).toBe(120);
    expect(bertha.state.total_output).toBe(120);
    expect(bertha.state.total_input).toBe(185);
  });

  it('throws when the device list request fails', async () => {
    mockListDevices.mockResolvedValue({ code: "1", message: "Auth error" });

    await expect(getBatteryStates('key', 'secret')).rejects.toThrow('Ecoflow request failed');
  });

  it('keeps default -1 values when getState fails for a device', async () => {
    // device list succeeds, but individual state queries fail
    mockListDevices.mockResolvedValue({
      code: "0",
      data: [
        { sn: "R351ZAB4HF6A0268", deviceName: "Hank", online: 1 },
        { sn: "MR51ZAS5PG7U0302", deviceName: "Bertha", online: 1 },
      ],
    });
    mockGetState.mockResolvedValue({ code: "1", message: "Quota error" });

    const [hank, bertha] = await getBatteryStates('key', 'secret');

    // state values should remain at their -1 defaults
    expect(hank.state.charge_pct).toBe(-1);
    expect(bertha.state.charge_pct).toBe(-1);
  });

  it('updates device name from the list-devices response', async () => {
    mockListDevices.mockResolvedValue({
      code: "0",
      data: [
        { sn: "R351ZAB4HF6A0268", deviceName: "Custom Hank Name", online: 1 },
        { sn: "MR51ZAS5PG7U0302", deviceName: "Custom Bertha Name", online: 0 },
      ],
    });
    mockGetState.mockResolvedValue({ code: "1" });

    const [hank, bertha] = await getBatteryStates('key', 'secret');

    expect(hank.name).toBe('Custom Hank Name');
    expect(bertha.name).toBe('Custom Bertha Name');
    expect(bertha.online).toBe(false);
  });
});


/* ========================================================= *\
 *  Test helpers                                             *
\* ========================================================= */

/** Set up mocks for a successful battery fetch with typical values. */
function setupSuccessfulMocks() {
  mockListDevices.mockResolvedValue({
    code: "0",
    data: [
      { sn: "R351ZAB4HF6A0268", deviceName: "Hank", online: 1, productName: "DELTA 2 Max" },
      { sn: "MR51ZAS5PG7U0302", deviceName: "Bertha", online: 1, productName: "DELTA Pro 3" },
    ],
  });

  mockGetState.mockImplementation((sn: string) => {
    if (sn === "R351ZAB4HF6A0268") {
      // Delta 2 Max state
      return Promise.resolve({
        code: "0",
        data: {
          'pd.soc': 78,
          'pd.carState': 1,
          'pd.carWatts': 12,
          'inv.cfgAcEnabled': 1,
          'inv.outputWatts': 45,
          'pd.wattsOutSum': 57,
          'inv.inputWatts': 80,
          'mppt.inWatts': 130,
        },
      });
    }
    // Delta Pro 3 state
    return Promise.resolve({
      code: "0",
      data: {
        cmsBattSoc: 65.2,
        flowInfo12v: 0,
        powGet12v: 0,
        flowInfoAcLvOut: 2,
        powGetAcLvOut: -120,
        powOutSumW: 120,
        powInSumW: 185,
      },
    });
  });
}
