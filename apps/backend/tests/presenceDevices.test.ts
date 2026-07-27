import { describe, expect, it } from 'vitest';

import { flattenPresenceDevices, invertPresenceDevices } from '../src/presenceDevices.js';

describe('invertPresenceDevices', () => {
  it('inverts person → MAC → label into MAC → person', () => {
    expect(invertPresenceDevices({
      Barry: { '08:8B:C8:30:10:FF': 'Pixel 9' },
      Cathie: {
        '12:86:A8:E6:C8:72': 'iPad',
        'de:31:b9:43:cf:2b': 'iPhone',
      },
    })).toEqual({
      '08:8B:C8:30:10:FF': 'Barry',
      '12:86:A8:E6:C8:72': 'Cathie',
      'DE:31:B9:43:CF:2B': 'Cathie',
    });
  });

  it('returns empty map for invalid or empty input', () => {
    expect(invertPresenceDevices(null)).toEqual({});
    expect(invertPresenceDevices(undefined)).toEqual({});
    expect(invertPresenceDevices([])).toEqual({});
    expect(invertPresenceDevices('x')).toEqual({});
    expect(invertPresenceDevices({ Alice: null, Bob: 'phone' })).toEqual({});
  });
});

describe('flattenPresenceDevices', () => {
  it('flattens devices with labels for script generation', () => {
    expect(flattenPresenceDevices({
      Bonnie: { '5A:19:95:11:EC:53': 'iPhone' },
      Ed: { '6E:7E:FD:0E:78:A4': '' },
    })).toEqual([
      { mac: '5A:19:95:11:EC:53', name: 'Bonnie', device: 'iPhone' },
      { mac: '6E:7E:FD:0E:78:A4', name: 'Ed' },
    ]);
  });

  it('returns empty list for invalid input', () => {
    expect(flattenPresenceDevices(null)).toEqual([]);
    expect(flattenPresenceDevices({ Alice: 1 })).toEqual([]);
  });
});
