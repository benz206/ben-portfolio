/**
 * Shared number / date / time formatting helpers.
 *
 * Intl formatters are expensive to construct, so number formatters are
 * instantiated once and date/time formatters are memoized by locale + options.
 */

const numberFormatter = new Intl.NumberFormat();
const compactFormatter = new Intl.NumberFormat(undefined, {
    notation: "compact",
});

/** Locale-aware integer/decimal formatting (e.g. "1,234"). */
export function formatNumber(value: number): string {
    return numberFormatter.format(value);
}

/** Compact number formatting (e.g. "1.2K"). */
export function formatCompact(value: number): string {
    return compactFormatter.format(value);
}

const dateTimeCache = new Map<string, Intl.DateTimeFormat>();

function getDateTimeFormatter(
    locale: string | undefined,
    options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
    const key = `${locale ?? ""}|${JSON.stringify(options)}`;
    let formatter = dateTimeCache.get(key);
    if (!formatter) {
        formatter = new Intl.DateTimeFormat(locale, options);
        dateTimeCache.set(key, formatter);
    }
    return formatter;
}

type DateInput = string | number | Date | null | undefined;

/** Format a date with Intl options; returns null for empty/invalid input. */
export function formatDate(
    value: DateInput,
    options: Intl.DateTimeFormatOptions,
    locale?: string,
): string | null {
    if (value === null || value === undefined || value === "") return null;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.valueOf())) return null;
    return getDateTimeFormatter(locale, options).format(date);
}

/** Clock time (e.g. "14:05"); returns null for empty/invalid input. */
export function formatTime(value: DateInput): string | null {
    return formatDate(value, { hour: "2-digit", minute: "2-digit" });
}

/** Whole-seconds string from a millisecond duration (e.g. Spotify). */
export function secondsFromMs(ms: number): string {
    return String(Math.round(ms / 1000));
}
