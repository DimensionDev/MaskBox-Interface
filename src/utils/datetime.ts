export const timezoneOffset = -new Date().getTimezoneOffset() / 60;
export const TZOffsetLabel = timezoneOffset > 0 ? `UTC+${timezoneOffset}` : `UTC${timezoneOffset}`;
