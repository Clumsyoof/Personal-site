import { describe, expect, it } from 'bun:test';
import { formatClock, formatDateStamp } from './format-time.ts';

describe('format-time utils', () => {
  it('formats clock digits with leading zeroes in Bangalore time', () => {
    // 2026-08-24T08:30:05.000Z is 14:00:05 in Asia/Kolkata (UTC+5:30)
    const date = new Date('2026-08-24T08:30:05.000Z');
    const time = formatClock(date, 'Asia/Kolkata');
    expect(time).toEqual({ h: '14', m: '00', s: '05' });
  });

  it('formats date stamp in YYYY:MM:DD format', () => {
    const date = new Date('2026-08-24T08:30:05.000Z');
    const stamp = formatDateStamp(date, 'Asia/Kolkata');
    expect(stamp).toBe('2026:08:24');
  });
});

