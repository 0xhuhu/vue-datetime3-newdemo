import { shallowMount, VueWrapper } from '@vue/test-utils';

import DatetimeTimePicker from './DatetimeTimePicker.vue';
import type { ChangeEvent } from './namespace';

describe('Datetime Time Picker Rendering', () => {
  let wrapper: VueWrapper;
  const defaultProps = {
    hour: 12,
    minute: 30,
    minTime: '5:00',
    maxTime: '23:00',
  };

  beforeEach(() => {
    wrapper = shallowMount(DatetimeTimePicker, { props: defaultProps });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Renders Correct Time', () => {
    const selected = wrapper.findAll('.selected');
    expect(selected[0].text()).toBe('12');
    expect(selected[1].text()).toBe('30');

    let selectedHour = wrapper.find('.list--hour .selected');
    expect(selectedHour.text()).toBe('12');

    const selectedMinute = wrapper.find('.list--minute .selected');
    expect(selectedMinute.text()).toBe('30');

    // test for 12hours
    const hour12wrapper = shallowMount(DatetimeTimePicker, {
      props: {
        ...defaultProps,
        use12Hour: true,
      },
    });
    selectedHour = hour12wrapper.find('.list--hour .selected');
    expect(selectedHour.text()).toBe('12');

    let selectedSuffix = hour12wrapper.find('.list--suffix .selected');
    expect(selectedSuffix.text()).toBe('pm');

    const hour12wrapperAm = shallowMount(DatetimeTimePicker, {
      props: {
        ...defaultProps,
        hour: 9,
        use12Hour: true,
      },
    });

    selectedHour = hour12wrapperAm.find('.list--hour .selected');
    expect(selectedHour.text()).toBe('09');

    selectedSuffix = hour12wrapperAm.find('.list--suffix .selected');
    expect(selectedSuffix.text()).toBe('am');
  });

  it('Correct Number Of Rendered Hours', () => {
    let hourOptions = wrapper.findAll('.list--hour .item');
    expect(hourOptions).toHaveLength(24);

    expect(hourOptions[0].text()).toBe('00');
    expect(hourOptions[hourOptions.length - 1].text()).toBe('23');

    // test for 12hour format as well
    const hour12Wrapper = shallowMount(DatetimeTimePicker, {
      props: {
        ...defaultProps,
        use12Hour: true,
      },
    });

    hourOptions = hour12Wrapper.findAll('.list--hour .item');
    expect(hourOptions).toHaveLength(12);

    expect(hourOptions[0].text()).toBe('12');
    expect(hourOptions[hourOptions.length - 1].text()).toBe('11');

    // test for step configuration
    const step2Wrapper = shallowMount(DatetimeTimePicker, {
      props: {
        ...defaultProps,
        hourStep: 2,
      },
    });

    hourOptions = step2Wrapper.findAll('.list--hour .item');
    expect(hourOptions).toHaveLength(12);

    expect(hourOptions[0].text()).toBe('00');
    expect(hourOptions[hourOptions.length - 1].text()).toBe('22');

    // test step for 12 hour configuration
    const step212Wrapper = shallowMount(DatetimeTimePicker, {
      props: {
        ...defaultProps,
        use12Hour: true,
        hourStep: 2,
      },
    });

    hourOptions = step212Wrapper.findAll('.list--hour .item');
    expect(hourOptions).toHaveLength(6);

    expect(hourOptions[0].text()).toBe('12');
    expect(hourOptions[hourOptions.length - 1].text()).toBe('10');
  });

  it('Correct Render Min/Max time', () => {
    const nonLimitedTimeWrapper = shallowMount(DatetimeTimePicker, {
      props: {
        ...defaultProps,
        minTime: undefined,
        maxTime: undefined,
      },
    });

    const hourOptions = nonLimitedTimeWrapper.findAll('.list--hour .item:not(.disabled)');
    expect(hourOptions).toHaveLength(24);

    let minuteOptions = nonLimitedTimeWrapper.findAll('.list--minute .item:not(.disabled)');
    expect(minuteOptions).toHaveLength(60);

    const limitedMinutesWrapper = shallowMount(DatetimeTimePicker, {
      props: {
        ...defaultProps,
        minTime: '12:00',
        maxTime: '12:40',
      },
    });

    minuteOptions = limitedMinutesWrapper.findAll('.list--minute .item:not(.disabled)');
    expect(minuteOptions).toHaveLength(41);
  });

  it('Correct Number Of Rendered Minutes', () => {
    let minuteOptions = wrapper.findAll('.list--minute .item');
    expect(minuteOptions).toHaveLength(60);

    expect(minuteOptions[0].text()).toBe('00');
    expect(minuteOptions[minuteOptions.length - 1].text()).toBe('59');

    // test 12 hours
    const hour12Wrapper = shallowMount(DatetimeTimePicker, {
      props: {
        ...defaultProps,
        use12Hour: true,
      },
    });
    minuteOptions = hour12Wrapper.findAll('.list--minute .item');
    expect(minuteOptions).toHaveLength(60);

    expect(minuteOptions[0].text()).toBe('00');
    expect(minuteOptions[minuteOptions.length - 1].text()).toBe('59');

    // test steps
    const step2Wrapper = shallowMount(DatetimeTimePicker, {
      props: {
        ...defaultProps,
        minuteStep: 2,
      },
    });
    minuteOptions = step2Wrapper.findAll('.list--minute .item');
    expect(minuteOptions).toHaveLength(30);

    expect(minuteOptions[0].text()).toBe('00');
    expect(minuteOptions[minuteOptions.length - 1].text()).toBe('58');
  });

  it('Clicking on Time Emits Change Event', () => {
    const hourOptions = wrapper.findAll('.list--hour .item:not(.disabled)');
    hourOptions.forEach((element, index) => {
      element.trigger('click');
      const events = wrapper.emitted<ChangeEvent[]>('change');
      const event = events?.at(-1)?.[0];
      expect(event?.hour).toBe(index + 5);
    });

    const minuteOptions = wrapper.findAll('.list--minute .item:not(.disabled)');
    minuteOptions.forEach((element, index) => {
      element.trigger('click');
      const events = wrapper.emitted<ChangeEvent[]>('change');
      const event = events?.at(-1)?.[0];
      expect(event?.minute).toBe(index);
    });
  });

  it('Clicking on Unselected Time Suffix Emits Change Event', () => {
    const hour12wrapper = shallowMount(DatetimeTimePicker, {
      props: {
        ...defaultProps,
        use12Hour: true,
        hour: 10,
      },
    });

    let element = hour12wrapper.find('.list--suffix .item:not(.selected)');
    (() => {
      element.trigger('click');
      const events = hour12wrapper.emitted<ChangeEvent[]>('change');
      const event = events?.at(-1)?.[0];
      expect(event).toEqual({ hour: 22, suffixTouched: true });
    })();

    const hour12wrapperPm = shallowMount(DatetimeTimePicker, {
      props: {
        ...defaultProps,
        use12Hour: true,
        hour: 22,
      },
    });
    element = hour12wrapperPm.find('.list--suffix .item:not(.selected)');
    (() => {
      element.trigger('click');
      const events = hour12wrapperPm.emitted<ChangeEvent[]>('change');
      const event = events?.at(-1)?.[0];
      expect(event).toEqual({ hour: 10, suffixTouched: true });
    })();
  });

  it('Clicking on Selected Time Suffix Does Not Emit Change Event', () => {
    const hour12wrapper = shallowMount(DatetimeTimePicker, {
      props: {
        ...defaultProps,
        use12Hour: true,
        hour: 10,
      },
    });

    let element = hour12wrapper.find('.list--suffix .item.selected');
    (() => {
      element.trigger('click');
      const events = hour12wrapper.emitted<ChangeEvent[]>('change');
      const event = events?.at(-1)?.[0];
      expect(event).toBeUndefined();
    })();

    const hour12wrapperPm = shallowMount(DatetimeTimePicker, {
      props: {
        ...defaultProps,
        use12Hour: true,
        hour: 22,
      },
    });
    element = hour12wrapperPm.find('.list--suffix .item.selected');
    (() => {
      element.trigger('click');
      const events = hour12wrapperPm.emitted<ChangeEvent[]>('change');
      const event = events?.at(-1)?.[0];
      expect(event).toBeUndefined();
    })();
  });
});
