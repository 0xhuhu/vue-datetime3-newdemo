import { shallowMount, VueWrapper } from '@vue/test-utils';
import { DateTime } from 'luxon';

import DatetimeYearPicker from './DatetimeYearPicker.vue';

describe('DatetimeYearPicker', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    const minDate = DateTime.fromObject({ year: 2000 });
    const maxDate = DateTime.fromObject({ year: 2030 });

    wrapper = shallowMount(DatetimeYearPicker, {
      props: {
        year: 2023,
        minDate,
        maxDate,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  // let tmp: VueWrapper;
  test('Renders The Correct Year', () => {
    const yearLabel = wrapper.find('.selected');
    expect(yearLabel.text()).toBe('2023');
  });

  test('renders the correct range of years', () => {
    const allOptions = wrapper.findAll('.item');
    expect(allOptions.length).toBe(201); // Number of years between 2000 and 2030 (inclusive)
    const options = wrapper.findAll('.item:not(.disabled)');
    expect(options.length).toBe(31);

    const firstYear = options[0].text();
    const lastYear = options[options.length - 1].text();
    expect(firstYear).toBe('2000');
    expect(lastYear).toBe('2030');
  });

  test('emits the selected year when clicked', async () => {
    const yearOption = wrapper.find('.item:not(.disabled)');
    await yearOption.trigger('click');
    expect(wrapper.emitted('change')).toBeTruthy();
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe(2000); // Assuming the first year is selected
  });

  test('clicking disabled element should not emit', async () => {
    const disabledOption = wrapper.find('.item.disabled');
    await disabledOption.trigger('click');
    expect(wrapper.emitted('change')).toBeUndefined();
  });
});
