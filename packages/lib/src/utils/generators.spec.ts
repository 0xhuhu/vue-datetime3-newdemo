import { expectTypeOf } from 'vitest';

import { hoursGenerator, minutesGenerator, monthsGenerator, weekdaysGenerator, yearsGenerator } from './generators';

describe('Generators', () => {
  it('Weekdays Generator', () => {
    expectTypeOf(weekdaysGenerator(1)).toMatchTypeOf<string[]>();

    expect(weekdaysGenerator(1).length).toBe(7);
    expect(weekdaysGenerator(1).length).toBe(weekdaysGenerator(3).length);

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    expect(weekdaysGenerator(1)).toEqual(weekDays);
    expect(weekdaysGenerator(3)).toEqual(weekDays.concat(weekDays.splice(0, 2)));
  });

  it('Month Generator', () => {
    expectTypeOf(monthsGenerator()).toMatchTypeOf<string[]>();

    expect(monthsGenerator().length).toBe(12);

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    expect(monthsGenerator()).toEqual(months);
  });

  it('Hours Generator', () => {
    expectTypeOf(hoursGenerator(1)).toMatchTypeOf<number[]>();

    expect(hoursGenerator(1)).toHaveLength(24);
    expect(hoursGenerator(2)).toHaveLength(12);

    hoursGenerator(1).forEach((element: number) => {
      expect(element).toBeGreaterThanOrEqual(0);
      expect(element).toBeLessThanOrEqual(24);
    });
  });

  it('Minutes Generator', () => {
    expectTypeOf(minutesGenerator(1)).toMatchTypeOf<number[]>();

    expect(minutesGenerator(1)).toHaveLength(60);
    expect(minutesGenerator(2)).toHaveLength(30);
    expect(minutesGenerator(5)).toHaveLength(12);

    minutesGenerator(1).forEach((element: number) => {
      expect(element).toBeGreaterThanOrEqual(0);
      expect(element).toBeLessThanOrEqual(60);
    });
  });

  it('Years Generator', () => {
    expectTypeOf(yearsGenerator(2023)).toMatchTypeOf<number[]>();

    expect(yearsGenerator(2023)).toHaveLength(201);
    expect(yearsGenerator(2023)).toContain(2023);
  });
});
