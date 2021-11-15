import { format } from 'date-fns';

export function getTimezoneOffset() {
  return;
}
export const timezoneOffset = -new Date().getTimezoneOffset() / 60;
export const TZOffsetLabel = timezoneOffset > 0 ? `UTC+${timezoneOffset}` : `UTC${timezoneOffset}`;
export function formatToLocale(dt: number | Date | undefined, pattern: string) {
  if (!dt) return '';
  const date = new Date(dt);
  date.setHours(date.getHours() + timezoneOffset);
  return format(date, pattern);
}

export function toLocalUTC(dt: number | string | Date) {
  const date = new Date(dt);
  date.setHours(date.getHours() + timezoneOffset);
  return date;
}

export function toUTCZero(dt: number | string | Date) {
  const date = new Date(dt);
  date.setHours(date.getHours() - timezoneOffset);
  return date;
}
