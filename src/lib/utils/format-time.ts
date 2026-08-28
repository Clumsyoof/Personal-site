export interface ClockDigits {
  h: string;
  m: string;
  s: string;
}

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

/**
 * Formats a Date into 2-digit hour, minute, and second strings.
 * Pure function: takes input, returns formatted output, no internal state.
 */
export function formatClock(date: Date, timeZone: string = DEFAULT_TIMEZONE): ClockDigits {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === type)?.value ?? '00';

  return {
    h: getPart('hour'),
    m: getPart('minute'),
    s: getPart('second'),
  };
}

/**
 * Formats a Date into a date stamp string in YYYY:MM:DD format (e.g. "2026:08:24").
 * Pure function: takes input, returns formatted output, no internal state.
 */
export function formatDateStamp(date: Date, timeZone: string = DEFAULT_TIMEZONE): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === 'year')?.value ?? String(date.getFullYear());
  const month = parts.find((p) => p.type === 'month')?.value ?? '01';
  const day = parts.find((p) => p.type === 'day')?.value ?? '01';

  return `${year}:${month}:${day}`;
}

