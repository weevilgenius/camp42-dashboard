import { describe, it, expect } from 'vitest';
import { BatteryType } from '@camp42/shared';
import {
  createBatteryState,
  createBatteryStatus,
  createWeatherCurrent,
  createWeatherDaily,
  createWeatherHourly,
  createWeatherStatus,
} from '@camp42/mocks';

/**
 * These tests verify that the @camp42/mocks package produces valid, consistent
 * data structures. This is important because Storybook stories and future
 * integration tests depend on the factories producing correctly-shaped data.
 */

describe('battery mock factories', () => {
  describe('createBatteryState', () => {
    it('returns a valid BatteryState with defaults', () => {
      const battery = createBatteryState();

      expect(battery.type).toBe(BatteryType.Delta_2_Max);
      expect(battery.name).toBe('Hank');
      expect(battery.online).toBe(true);
      expect(battery.state.charge_pct).toBeGreaterThanOrEqual(0);
      expect(battery.state.charge_pct).toBeLessThanOrEqual(100);
    });

    it('allows overriding top-level fields', () => {
      const battery = createBatteryState({
        name: 'Custom',
        online: false,
      });

      expect(battery.name).toBe('Custom');
      expect(battery.online).toBe(false);
      // non-overridden fields keep defaults
      expect(battery.type).toBe(BatteryType.Delta_2_Max);
    });

    it('allows overriding nested state fields', () => {
      const battery = createBatteryState({
        state: {
          charge_pct: 99,
          dc_on: true,
          dc_watts: 12,
          ac_on: true,
          ac_watts: 45,
          total_input: 210,
          total_output: 57,
        },
      });

      expect(battery.state.charge_pct).toBe(99);
      // the factory merges the state fields we provided
      expect(battery.state.dc_on).toBe(true);
    });
  });

  describe('createBatteryStatus', () => {
    it('returns both hank and bertha', () => {
      const status = createBatteryStatus();

      expect(status.hank).toBeDefined();
      expect(status.bertha).toBeDefined();
      expect(status.hank.name).toBe('Hank');
      expect(status.bertha.name).toBe('Bertha');
    });

    it('uses different battery types for each', () => {
      const status = createBatteryStatus();

      expect(status.hank.type).toBe(BatteryType.Delta_2_Max);
      expect(status.bertha.type).toBe(BatteryType.Delta_3_Pro);
    });
  });
});

describe('weather mock factories', () => {
  describe('createWeatherCurrent', () => {
    it('returns valid current conditions', () => {
      const current = createWeatherCurrent();

      expect(current.time).toBeGreaterThan(0);
      expect(current.conditions).toBe('Clear');
      expect(current.icon).toBe('clear-day');
      expect(current.air_temperature).toBeTypeOf('number');
      expect(current.relative_humidity).toBeGreaterThanOrEqual(0);
      expect(current.relative_humidity).toBeLessThanOrEqual(100);
    });

    it('allows overrides', () => {
      const current = createWeatherCurrent({ conditions: 'Heavy Rain', air_temperature: 55 });

      expect(current.conditions).toBe('Heavy Rain');
      expect(current.air_temperature).toBe(55);
    });
  });

  describe('createWeatherDaily', () => {
    it('returns a valid daily forecast entry', () => {
      const day = createWeatherDaily();

      expect(day.day_start_local).toBeGreaterThan(0);
      expect(day.day_num).toBeGreaterThanOrEqual(1);
      expect(day.day_num).toBeLessThanOrEqual(31);
      expect(day.month_num).toBeGreaterThanOrEqual(1);
      expect(day.month_num).toBeLessThanOrEqual(12);
      expect(day.air_temp_high).toBeGreaterThan(day.air_temp_low);
    });
  });

  describe('createWeatherHourly', () => {
    it('returns a valid hourly forecast entry', () => {
      const hour = createWeatherHourly();

      expect(hour.time).toBeGreaterThan(0);
      expect(hour.local_hour).toBeGreaterThanOrEqual(0);
      expect(hour.local_hour).toBeLessThanOrEqual(23);
      expect(hour.air_temperature).toBeTypeOf('number');
    });
  });

  describe('createWeatherStatus', () => {
    it('returns current, daily, and hourly arrays', () => {
      const status = createWeatherStatus();

      expect(status.current).toBeDefined();
      expect(status.daily).toHaveLength(7);
      expect(status.hourly).toHaveLength(12);
    });

    it('daily entries have increasing day_start_local values', () => {
      const status = createWeatherStatus();

      for (let i = 1; i < status.daily.length; i++) {
        expect(status.daily[i].day_start_local).toBeGreaterThan(
          status.daily[i - 1].day_start_local,
        );
      }
    });

    it('hourly entries have increasing time values', () => {
      const status = createWeatherStatus();

      for (let i = 1; i < status.hourly.length; i++) {
        expect(status.hourly[i].time).toBeGreaterThan(
          status.hourly[i - 1].time,
        );
      }
    });
  });
});
