import { shallowMount, VueWrapper, enableAutoUnmount, mount } from '@vue/test-utils';
import { DateTime } from 'luxon';

import { DatetimePopup } from './index';

describe('Datetime Popup', () => {
  let wrapper: VueWrapper;
  const defaultProps = {
    datetime: DateTime.fromObject({ year: 2023, month: 9, day: 21 }),
    type: 'datetime',
  };

  beforeEach(() => {
    wrapper = shallowMount(DatetimePopup, { props: defaultProps });
  });

  enableAutoUnmount(afterEach);

  it('Check flow type rendering correctly', () => {
    // flowtype == 'datetime'
    expect(wrapper.find('datetime-calendar-stub').exists()).toBe(true);

    expect(wrapper.find('datetime-year-picker-stub').exists()).toBe(false);
    expect(wrapper.find('datetime-month-picker-stub').exists()).toBe(false);
    expect(wrapper.find('datetime-time-picker-stub').exists()).toBe(false);

    // flowtype == 'date'
    const dateWrapper = shallowMount(DatetimePopup, {
      props: {
        ...defaultProps,
        type: 'date',
      },
    });

    expect(dateWrapper.find('datetime-calendar-stub').exists()).toBe(true);

    expect(dateWrapper.find('datetime-year-picker-stub').exists()).toBe(false);
    expect(dateWrapper.find('datetime-month-picker-stub').exists()).toBe(false);
    expect(dateWrapper.find('datetime-time-picker-stub').exists()).toBe(false);

    // flowtype == 'time'
    const timeWrapper = shallowMount(DatetimePopup, {
      props: {
        ...defaultProps,
        type: 'time',
      },
    });

    expect(timeWrapper.find('datetime-time-picker-stub').exists()).toBe(true);

    expect(timeWrapper.find('datetime-calendar-stub').exists()).toBe(false);
    expect(timeWrapper.find('datetime-year-picker-stub').exists()).toBe(false);
    expect(timeWrapper.find('datetime-month-picker-stub').exists()).toBe(false);
  });

  it('Test flow for each type', async () => {
    // datetime -> [date, time, end]
    let confirmButton = wrapper.find('.confirm');
    await confirmButton.trigger('click');

    expect(wrapper.find('datetime-calendar-stub').exists()).toBe(false);
    expect(wrapper.find('datetime-time-picker-stub').exists()).toBe(true);
    expect(wrapper.find('datetime-year-picker-stub').exists()).toBe(false);
    expect(wrapper.find('datetime-month-picker-stub').exists()).toBe(false);

    await confirmButton.trigger('click');

    expect(wrapper.find('datetime-calendar-stub').exists()).toBe(false);
    expect(wrapper.find('datetime-time-picker-stub').exists()).toBe(false);
    expect(wrapper.find('datetime-year-picker-stub').exists()).toBe(false);
    expect(wrapper.find('datetime-month-picker-stub').exists()).toBe(false);

    expect(wrapper.emitted('confirm')?.[0]).not.toBeUndefined();

    // date -> [date, end]
    const dateWrapper = shallowMount(DatetimePopup, {
      props: {
        ...defaultProps,
        type: 'date',
      },
    });

    confirmButton = dateWrapper.find('.confirm');
    await confirmButton.trigger('click');

    expect(dateWrapper.find('datetime-calendar-stub').exists()).toBe(false);
    expect(dateWrapper.find('datetime-time-picker-stub').exists()).toBe(false);
    expect(dateWrapper.find('datetime-year-picker-stub').exists()).toBe(false);
    expect(dateWrapper.find('datetime-month-picker-stub').exists()).toBe(false);

    expect(dateWrapper.emitted('confirm')?.[0]).not.toBeUndefined();

    // time -> [time, end]
    const timeWrapper = shallowMount(DatetimePopup, {
      props: {
        ...defaultProps,
        type: 'time',
      },
    });

    confirmButton = timeWrapper.find('.confirm');
    await confirmButton.trigger('click');

    expect(timeWrapper.find('datetime-calendar-stub').exists()).toBe(false);
    expect(timeWrapper.find('datetime-time-picker-stub').exists()).toBe(false);
    expect(timeWrapper.find('datetime-year-picker-stub').exists()).toBe(false);
    expect(timeWrapper.find('datetime-month-picker-stub').exists()).toBe(false);

    expect(timeWrapper.emitted('confirm')?.[0]).not.toBeUndefined();
  });

  it('Pressing cancel button should emit cancel event', async () => {
    const cancelButton = wrapper.find('.cancel');
    await cancelButton.trigger('click');

    expect(wrapper.emitted('confirm')?.[0]).toBeUndefined();
    expect(wrapper.emitted('cancel')?.[0]).not.toBeUndefined();
  });

  it('Clicking on Month should open month picker', async () => {
    const monthButton = wrapper.find('.month');
    await monthButton.trigger('click');

    expect(wrapper.find('datetime-calendar-stub').exists()).toBe(false);
    expect(wrapper.find('datetime-time-picker-stub').exists()).toBe(false);
    expect(wrapper.find('datetime-year-picker-stub').exists()).toBe(false);
    expect(wrapper.find('datetime-month-picker-stub').exists()).toBe(true);
  });

  it('Clicking on Year should open month picker', async () => {
    const yearButton = wrapper.find('.year');
    await yearButton.trigger('click');

    expect(wrapper.find('datetime-calendar-stub').exists()).toBe(false);
    expect(wrapper.find('datetime-time-picker-stub').exists()).toBe(false);
    expect(wrapper.find('datetime-year-picker-stub').exists()).toBe(true);
    expect(wrapper.find('datetime-month-picker-stub').exists()).toBe(false);
  });

  it('Boundaries for datetime', () => {
    const mindate = DateTime.fromObject({ year: 2023, month: 9, day: 21, hour: 21, minute: 20 });
    const maxdate = DateTime.fromObject({ year: 2023, month: 9, day: 21, hour: 23, minute: 20 });
    const dateWrapper = shallowMount(DatetimePopup, {
      props: {
        ...defaultProps,
        minDatetime: mindate,
        maxDatetime: maxdate,
      },
    });

    const calendar = dateWrapper.find('datetime-calendar-stub');
    expect(calendar.attributes('mindate')).toBe(mindate.toISO());
    expect(calendar.attributes('maxdate')).toBe(maxdate.toISO());

    const timeWrapper = shallowMount(DatetimePopup, {
      props: {
        ...defaultProps,
        type: 'time',
        minDatetime: mindate,
        maxDatetime: maxdate,
      },
    });

    const timePicker = timeWrapper.find('datetime-time-picker-stub');
    expect(timePicker.attributes('mintime')).toBe(mindate.toFormat('HH:mm'));
    expect(timePicker.attributes('maxtime')).toBe(maxdate.toFormat('HH:mm'));
  });

  it('Change Year', async () => {
    const mountWrapper = mount(DatetimePopup, { props: { ...defaultProps, auto: true } });
    const yearButton = mountWrapper.find('.year');
    await yearButton.trigger('click');

    const yearOption = mountWrapper.find('.list .item');
    await yearOption.trigger('click');

    expect(yearButton.text()).toBe(yearOption.text());
  });

  it('Change Month', async () => {
    const mountWrapper = mount(DatetimePopup, { props: { ...defaultProps, auto: true } });
    const monthButton = mountWrapper.find('.month');
    await monthButton.trigger('click');

    const monthOption = mountWrapper.find('.list .item');
    await monthOption.trigger('click');

    expect(monthButton.text()).toBe(`${monthOption.text()} 21`);
  });

  it('Change Date', async () => {
    const mountWrapper = mount(DatetimePopup, { props: { ...defaultProps, auto: true } });

    const dateOption = mountWrapper.find('.month__day:not(.disabled)');
    await dateOption.trigger('click');

    const monthButton = mountWrapper.find('.month');
    expect(monthButton.text()).toEqual(`September ${dateOption.text()}`);
  });

  it('Change Time', async () => {
    const mountWrapper = mount(DatetimePopup, {
      props: {
        ...defaultProps,
        auto: true,
        type: 'time',
        use12Hour: true,
      },
    });

    const hourElement = mountWrapper.find('.list--hour .item:not(.selected)');
    const minuteElement = mountWrapper.find('.list--minute .item:not(.selected)');
    const suffixElement = mountWrapper.find('.list--suffix .item:not(.selected)');

    await hourElement.trigger('click');
    expect(mountWrapper.find('.list--hour .item.selected').text()).toBe(hourElement.text());

    await minuteElement.trigger('click');
    expect(mountWrapper.find('.list--minute .item.selected').text()).toBe(minuteElement.text());

    await suffixElement.trigger('click');
    expect(mountWrapper.find('.list--suffix .item.selected').text()).toBe(suffixElement.text());

    expect(mountWrapper.emitted('change')?.[0]).toBeUndefined();
  });
});
