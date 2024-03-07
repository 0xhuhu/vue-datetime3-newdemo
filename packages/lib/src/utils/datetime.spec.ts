import { DateTime, WeekdayNumbers } from 'luxon';
import { expectTypeOf } from 'vitest';

import {
  calculateWeekStart,
  datetimeFromISO,
  dateIsDisabled, monthDays,
  monthIsDisabled,
  startOfDay,
  timeComponentIsDisabled, validDatetimeRange,
  yearIsDisabled,
} from './datetime';

describe('Datetime Utilities', () => {
  const { year, month, day } = { year: 2023, month: 10, day: 13 };
  const datetimeObject = { year, month, day };
  const datetime = DateTime.fromObject(datetimeObject);
  const weekstart = 1;

  it('Datetime From ISO', () => {
    expect(datetimeFromISO('')).toBeUndefined();
    // @ts-ignore
    expectTypeOf(datetimeFromISO('')).toEqualTypeOf<DateTime>();
    expect(datetimeFromISO('2018-05-12T00:00:00.000Z')).not.toBeUndefined();
    expect(datetimeFromISO('2018-05-12T')).toBeUndefined();
  });

  it('Start Of Day', () => {
    // @ts-ignore
    expectTypeOf(startOfDay(datetime)).toEqualTypeOf<DateTime>();
    // @ts-ignore
    expectTypeOf(startOfDay(undefined)).toEqualTypeOf<undefined>();
    // @ts-ignore
    expectTypeOf(startOfDay(null)).toEqualTypeOf<undefined>();
    const tmp = startOfDay(datetime)!.toObject();
    expect({ minute: tmp.minute, seconds: tmp.second, millisecond: tmp.millisecond })
      .toEqual({ minute: 0, seconds: 0, millisecond: 0 });
  });

  it('Date Is Disabled', () => {
    const datetimeBefore = datetime.minus({ day: 1 });
    const datetimeAfter = datetime.plus({ day: 1 });

    expect(dateIsDisabled(undefined, undefined, year, month, day)).toBe(false);
    expect(dateIsDisabled(datetimeBefore, undefined, year, month, day)).toBe(false);
    expect(dateIsDisabled(undefined, datetimeAfter, year, month, day)).toBe(false);
    expect(dateIsDisabled(datetimeBefore, datetimeAfter, year, month, day)).toBe(false);

    expect(dateIsDisabled(undefined, datetimeBefore, year, month, day)).toBe(true);
    expect(dateIsDisabled(datetimeAfter, undefined, year, month, day)).toBe(true);
    expect(dateIsDisabled(datetimeAfter, datetimeBefore, year, month, day)).toBe(true);
    expect(dateIsDisabled(datetimeBefore, datetimeBefore, year, month, day)).toBe(true);
    expect(dateIsDisabled(datetimeAfter, datetimeAfter, year, month, day)).toBe(true);

    expect(dateIsDisabled(datetime.minus({ year: 1 }), undefined, year, month, day)).toBe(false);
    expect(dateIsDisabled(undefined, datetime.plus({ year: 1 }), year, month, day)).toBe(false);

    expect(dateIsDisabled(datetime.minus({ month: 1 }), undefined, year, month, day)).toBe(false);
    expect(dateIsDisabled(undefined, datetime.plus({ month: 1 }), year, month, day)).toBe(false);

    const dateBefore = DateTime.fromObject({ year: 2023, month: 9, day: 25 });
    const dateAfter = DateTime.fromObject({ year: 2023, month: 10, day: 10 });

    expect(dateIsDisabled(dateBefore, dateAfter, 2023, 9, 29)).toBe(false);
    expect(dateIsDisabled(dateBefore, dateAfter, 2023, 10, 5)).toBe(false);

    expect(dateIsDisabled(dateBefore, dateAfter, 2023, 9, 5)).toBe(true);
    expect(dateIsDisabled(dateBefore, dateAfter, 2023, 10, 29)).toBe(true);
  });

  it('Month Is Disabled', () => {
    const datetimeBefore = datetime.minus({ month: 1 });
    const datetimeAfter = datetime.plus({ month: 1 });

    // obvious true statements
    expect(monthIsDisabled(undefined, undefined, year, month)).toBe(false);
    expect(monthIsDisabled(datetimeBefore, undefined, year, month)).toBe(false);
    expect(monthIsDisabled(undefined, datetimeAfter, year, month)).toBe(false);
    expect(monthIsDisabled(datetimeBefore, datetimeAfter, year, month)).toBe(false);

    // obvious false
    expect(monthIsDisabled(datetimeAfter, undefined, year, month)).toBe(true);
    expect(monthIsDisabled(undefined, datetimeBefore, year, month)).toBe(true);
    expect(monthIsDisabled(datetimeAfter, datetimeBefore, year, month)).toBe(true);

    // date within the month
    const monthBegin = DateTime.fromObject({ ...datetimeObject, day: 1 });
    const monthEnd = DateTime.fromObject({ ...datetimeObject, day: DateTime.utc(year, month).daysInMonth ?? 31 });

    expect(monthIsDisabled(monthBegin, undefined, year, month)).toBe(false);
    expect(monthIsDisabled(undefined, monthBegin, year, month)).toBe(false);
    expect(monthIsDisabled(monthEnd, undefined, year, month)).toBe(false);
    expect(monthIsDisabled(undefined, monthEnd, year, month)).toBe(false);
    expect(monthIsDisabled(monthBegin, monthEnd, year, month)).toBe(false);
    expect(monthIsDisabled(monthEnd, monthBegin, year, month)).toBe(true);

    const monthPreviousYear = DateTime.fromObject({ year: 2022, month: 10 });
    const monthNextYear = DateTime.fromObject({ year: 2023, month: 3 });

    expect(monthIsDisabled(monthPreviousYear, monthNextYear, 2022, 11)).toBe(false);
    expect(monthIsDisabled(monthPreviousYear, monthNextYear, 2023, 1)).toBe(false);

    expect(monthIsDisabled(monthPreviousYear, monthNextYear, 2022, 1)).toBe(true);
    expect(monthIsDisabled(monthPreviousYear, monthNextYear, 2023, 11)).toBe(true);
  });

  it('Year Is Disabled', () => {
    const datetimeBefore = datetime.minus({ year: 1 });
    const datetimeAfter = datetime.plus({ year: 1 });

    // obvious true statements
    expect(yearIsDisabled(undefined, undefined, year)).toBe(false);
    expect(yearIsDisabled(datetimeBefore, undefined, year)).toBe(false);
    expect(yearIsDisabled(undefined, datetimeAfter, year)).toBe(false);
    expect(yearIsDisabled(datetimeBefore, datetimeAfter, year)).toBe(false);

    // obvious false
    expect(yearIsDisabled(datetimeAfter, undefined, year)).toBe(true);
    expect(yearIsDisabled(undefined, datetimeBefore, year)).toBe(true);
    expect(yearIsDisabled(datetimeAfter, datetimeBefore, year)).toBe(true);

    const yearBegin = DateTime.fromObject({ ...datetimeObject, month: 1, day: 1 });
    const yearEnd = DateTime.fromObject({ ...datetimeObject, month: 12, day: 31 });
    expect(yearIsDisabled(yearBegin, undefined, year)).toBe(false);
    expect(yearIsDisabled(undefined, yearBegin, year)).toBe(false);
    expect(yearIsDisabled(yearEnd, undefined, year)).toBe(false);
    expect(yearIsDisabled(undefined, yearEnd, year)).toBe(false);
    expect(yearIsDisabled(yearBegin, yearEnd, year)).toBe(false);
    expect(yearIsDisabled(yearEnd, yearBegin, year)).toBe(true);
  });

  it('Valid Datetime Range', () => {
    const datetimeBefore = datetime.minus({ year: 1 });
    const datetimeAfter = datetime.plus({ year: 1 });

    expect(validDatetimeRange(undefined, undefined)).toBe(true);
    expect(validDatetimeRange(datetimeBefore, undefined)).toBe(true);
    expect(validDatetimeRange(undefined, datetimeAfter)).toBe(true);
    expect(validDatetimeRange(datetimeBefore, datetimeAfter)).toBe(true);
    expect(validDatetimeRange(datetimeAfter, datetimeBefore)).toBe(false);
  });

  it('Time Component Is Disabled', () => {
    const component: number = 7;

    const lower: number = component - 1;
    const higher: number = component + 1;

    // obvious true
    expect(timeComponentIsDisabled(null, null, component)).toBe(false);
    expect(timeComponentIsDisabled(lower, null, component)).toBe(false);
    expect(timeComponentIsDisabled(null, higher, component)).toBe(false);
    expect(timeComponentIsDisabled(lower, higher, component)).toBe(false);

    // obvious false
    expect(timeComponentIsDisabled(higher, null, component)).toBe(true);
    expect(timeComponentIsDisabled(null, lower, component)).toBe(true);
    expect(timeComponentIsDisabled(higher, lower, component)).toBe(true);
  });

  it('Month Days', () => {
    // TODO: write in-depth test for this
    // @ts-ignore
    expectTypeOf(monthDays(year, month, weekstart)).toEqualTypeOf<number[]>();
    // @ts-ignore
    expectTypeOf(monthDays(-1, -1, weekstart)).toEqualTypeOf<null>();

    expect(monthDays(year, month, weekstart).length).toEqual(42);
    expect(monthDays(2023, 5, weekstart).length).toEqual(42);
  });

  it('Calculate Week Start', () => {
    // @ts-ignore
    expectTypeOf(calculateWeekStart()).toEqualTypeOf<number>();
    expectTypeOf(calculateWeekStart()).toEqualTypeOf<WeekdayNumbers>();
    expect(calculateWeekStart()).toBeLessThanOrEqual(7);
    expect(calculateWeekStart()).toBeGreaterThanOrEqual(1);
  });
});
