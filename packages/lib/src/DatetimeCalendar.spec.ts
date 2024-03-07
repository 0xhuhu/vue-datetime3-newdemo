import { shallowMount, VueWrapper } from '@vue/test-utils';
import { DateTime } from 'luxon';

import DatetimeCalendar from './DatetimeCalendar.vue';
import { ChangeEvent } from './namespace';

describe('Datetime Calendar', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = shallowMount(DatetimeCalendar, {
      props: {
        year: 2023,
        month: 9,
        day: 21,
        minDate: DateTime.fromISO('2023-01-01'),
        maxDate: DateTime.fromISO('2023-09-30'),
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Renders correct month and year', () => {
    const element = wrapper.find('.current--month');
    expect(element.text()).toBe('September 2023');
  });

  it('Renders weekdays correctly', () => {
    const elements = wrapper.findAll('.month .month__weekday').map((element) => element.text());
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    expect(elements).toEqual(weekDays);
  });

  it('Renders days correctly', () => {
    const elements = wrapper.findAll('.month .month__day');
    expect(elements).toHaveLength(42);
  });

  it('Renders date correctly', () => {
    const selectedDate = wrapper.find('.month .month__day.selected');
    expect(selectedDate.text()).toBe('21');
  });

  it('Clicking on enabled date should trigger change event', () => {
    const dateOption = wrapper.find('.month .month__day:not(.disabled)');
    dateOption.trigger('click');
    expect(wrapper.emitted<ChangeEvent[]>('change')?.[0]?.[0]).toEqual({ year: 2023, month: 9, day: 1 });
  });

  it('Clicking on next month should change month value', async () => {
    const newMonth = wrapper.find('.navigation--next');
    await newMonth.trigger('click');

    const monthYear = wrapper.find('.current--month');
    expect(monthYear.text()).toBe('October 2023');
  });

  it('Clicking on previous month should change month value', async () => {
    const newMonth = wrapper.find('.navigation--previous');
    await newMonth.trigger('click');
    await wrapper.vm.$nextTick();
    const monthYear = wrapper.find('.current--month');
    expect(monthYear.text()).toBe('August 2023');
  });
});
