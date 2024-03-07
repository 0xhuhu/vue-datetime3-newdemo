import { shallowMount, VueWrapper } from '@vue/test-utils';
import { DateTime } from 'luxon';

import DatetimeMonthPicker from './DatetimeMonthPicker.vue';

describe('DatetimeMonthPicker', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = shallowMount(DatetimeMonthPicker, {
      props: {
        year: 2023,
        month: 2,
        minDate: DateTime.fromISO('2023-01-01'),
        maxDate: DateTime.fromISO('2023-09-30'),
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  // let tmp: VueWrapper;
  test('Renders The Correct Month', () => {
    const yearLabel = wrapper.find('.selected');
    expect(yearLabel.text()).toBe('February');
  });

  test('Renders The Correct Range of Months', () => {
    const allOptions = wrapper.findAll('.item');
    expect(allOptions.length).toBe(12); // Number of years between 2000 and 2030 (inclusive)
    const options = wrapper.findAll('.item:not(.disabled)');
    expect(options.length).toBe(9);

    const firstMonth = allOptions[0].text();
    const lastMonth = allOptions[allOptions.length - 1].text();
    expect(firstMonth).toBe('January');
    expect(lastMonth).toBe('December');

    const firstEnabledMonth = options[0].text();
    const lastEnabledMonth = options[options.length - 1].text();
    expect(firstEnabledMonth).toBe('January');
    expect(lastEnabledMonth).toBe('September');

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    allOptions.forEach((option, index) => {
      expect(option.text()).toBe(months[index]);
    });
    options.forEach((option, index) => {
      expect(option.text()).toBe(months[index]);
    });
  });

  test('Emits the Selected Month When Clicked', async () => {
    const yearOption = wrapper.find('.item:not(.disabled)');
    await yearOption.trigger('click');
    expect(wrapper.emitted('change')).toBeTruthy();
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe(1); // assuming January (1 index) is selected
  });

  test('Clicking Disabled Month Should Not Emit', async () => {
    const disabledOption = wrapper.find('.item.disabled');
    await disabledOption.trigger('click');
    expect(wrapper.emitted('change')).toBeUndefined();
  });
});
