import 'server-only';

// IANA zones known to the runtime; the API validates against the same database (tzinfo).
export function timeZones(): string[] {
    return Intl.supportedValuesOf('timeZone');
}
