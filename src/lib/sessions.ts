/**
 * MAA Insight Room session dates.
 *
 * Sessions are the first Friday of every month at 19:00 in Lagos. Lagos (WAT)
 * is UTC+1 year-round with no daylight saving, so the offset is a constant —
 * this is the one timezone simplification that is actually safe to make, and it
 * avoids pulling in a date library for a single rule.
 *
 * Dates are computed rather than listed so the page never goes stale. The page
 * revalidates hourly, so "next session" is always current without a rebuild.
 */
const LAGOS_UTC_OFFSET_HOURS = 1;
const SESSION_HOUR_LOCAL = 19;
const FRIDAY = 5;

/** The first Friday of a given month, at 19:00 Lagos, as a UTC instant. */
function firstFriday(year: number, monthIndex: number): Date {
  const d = new Date(
    Date.UTC(year, monthIndex, 1, SESSION_HOUR_LOCAL - LAGOS_UTC_OFFSET_HOURS, 0, 0),
  );
  // getUTCDay() at 18:00 UTC still falls on the same calendar day in Lagos.
  const shift = (FRIDAY - d.getUTCDay() + 7) % 7;
  d.setUTCDate(1 + shift);
  return d;
}

/** The next `count` sessions that have not yet started. */
export function upcomingSessions(count = 4, now: Date = new Date()): Date[] {
  const sessions: Date[] = [];
  let year = now.getUTCFullYear();
  let month = now.getUTCMonth();

  // Look ahead a bounded number of months so a bad clock cannot spin forever.
  for (let i = 0; i < count + 2 && sessions.length < count; i += 1) {
    const candidate = firstFriday(year, month);
    if (candidate.getTime() > now.getTime()) sessions.push(candidate);
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  return sessions;
}

const LONG = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Lagos",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const SHORT = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Lagos",
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** "Friday 2 October 2026" */
export const formatSessionLong = (d: Date) => LONG.format(d);

/** "2 Oct 2026" */
export const formatSessionShort = (d: Date) => SHORT.format(d);

/** ISO instant, for <time datetime> and schema.org. */
export const sessionIso = (d: Date) => d.toISOString();
