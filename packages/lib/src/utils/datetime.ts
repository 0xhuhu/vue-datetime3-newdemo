import { DateTime, Settings, WeekdayNumbers } from 'luxon';
import { getWeekStartByLocale } from 'weekstart';

import { DateElement } from '../namespace';

export function datetimeFromISO(string: string): DateTime | undefined {
  const datetime = DateTime.fromISO(string);

  return datetime.isValid ? datetime : undefined;
}

export const startOfDay = (datetime: DateTime | undefined): DateTime | undefined => (datetime?.startOf('day'));

export function validDatetimeRange(minDate: DateTime | undefined, maxDate: DateTime | undefined): boolean {
  // Valid range is whatever either date is null or when minDate is lesser then maxDate
  return !minDate || !maxDate || minDate <= maxDate;
}

export function yearIsDisabled(minDate: DateTime | undefined, maxDate: DateTime | undefined, year: number): boolean {
  const minYear = minDate?.year;
  const maxYear = maxDate?.year;

  return !validDatetimeRange(minDate, maxDate) || (!!minYear && year < minYear) || (!!maxYear && year > maxYear);
}

export function monthIsDisabled(
  minDate: DateTime | undefined,
  maxDate: DateTime | undefined,
  year: number,
  month: number,
): boolean {
  const minMonth = minDate?.month;
  const maxMonth = maxDate?.month;

  return yearIsDisabled(minDate, maxDate, year) ||
    (!!minMonth && minDate.year === year && month < minDate.month) ||
    (!!maxMonth && maxDate.year === year && month > maxDate.month);
}

export function dateIsDisabled(
  minDate: DateTime | undefined,
  maxDate: DateTime | undefined,
  year: number,
  month: number,
  day: number,
): boolean {
  const minDay = minDate?.day;
  const maxDay = maxDate?.day;

  return monthIsDisabled(minDate, maxDate, year, month) ||
    (!!minDay && (minDate.month === month && minDate.year === year && day < minDate.day)) ||
    (!!maxDay && (maxDate.month === month && maxDate.year === year && day > maxDate.day));
}

export function timeComponentIsDisabled(min: number | null, max: number | null, component: number): boolean {
  return (min !== null && component < min) || (max !== null && component > max);
}

export function monthDays(year: number, month: number, weekStart: WeekdayNumbers): DateElement[] {
  const monthDate = DateTime.local(year, month, 1);
  if (!monthDate.isValid) {
    return [];
  }
  const calendarRows = 6;
  const calendarSize = 7 * (calendarRows - 1);

  const daysInFirstRow = (7 - monthDate.weekday + weekStart) % 7;
  const paddingFront = (7 - daysInFirstRow) % 7;
  const daysInMonth = monthDate.daysInMonth!;
  const paddingBack = calendarSize - (daysInMonth - daysInFirstRow - (daysInFirstRow ? 0 : 7));

  const daysInMonthPrevious = monthDate.minus({ month: 1 }).daysInMonth!;
  const prevMonth = monthDate.minus({ month: 1 });
  const nextMonth = monthDate.plus({ month: 1 });

  return [...Array(daysInMonth + paddingFront + paddingBack)]
    .map(
      (_, index) => {
        if (index + 1 <= paddingFront) {
          return {
            year: prevMonth.year,
            month: prevMonth.month,
            day: daysInMonthPrevious + (index + 1 - paddingFront),
          };
        }
        if (index >= paddingFront + daysInMonth) {
          return {
            year: nextMonth.year,
            month: nextMonth.month,
            day: index + 1 - (paddingFront + daysInMonth),
          };
        }
        return { year, month, day: (index + 1 - paddingFront) };
      },
    );
}

export function calculateWeekStart(): WeekdayNumbers {
  const firstDay = getWeekStartByLocale(Settings.defaultLocale);

  return firstDay || 7;
}
