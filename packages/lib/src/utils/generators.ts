import { Info, WeekdayNumbers } from 'luxon';

import { capitalize } from '.';

export function weekdaysGenerator(weekStart: WeekdayNumbers): string[] {
  const localWeekStart = weekStart - 1;

  let weekDays = Info.weekdays('short').map((weekday) => capitalize(weekday));

  weekDays = weekDays.concat(weekDays.splice(0, localWeekStart));

  return weekDays;
}

export function monthsGenerator(): string[] {
  return [...Info.months().map((month: string) => capitalize(month))];
}

export function hoursGenerator(step: number): number[] {
  return [...Array(Math.ceil(24 / step))].map((_, index) => index * step);
}

export function minutesGenerator(step: number): number[] {
  return [...Array(Math.ceil(60 / step))].map((_, index) => index * step);
}

export function yearsGenerator(current: number): number[] {
  return [...Array(201)].map((_, index) => current - 100 + index);
}
