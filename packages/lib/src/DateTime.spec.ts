import { mount, shallowMount, VueWrapper } from '@vue/test-utils';
import { DateTime } from 'luxon';
import { ref } from 'vue';

import DateTimeVue from './DateTime.vue';

describe('DateTime', () => {
  let wrapper: VueWrapper;
  const dateTime = ref(DateTime.fromObject({ year: 2023, month: 9, day: 12 }));

  const defaultProps = {
    modelValue: dateTime.value.toISO(),
    type: 'datetime',
  };

  beforeEach(() => {
    wrapper = mount(DateTimeVue, { props: defaultProps });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Test if dialog opens on focus', async () => {
    expect(wrapper.find('.popup').exists()).toBe(false);

    const input = wrapper.find('input');
    await input.trigger('focus');

    expect(wrapper.find('.popup').exists()).toBe(true);
  });

  it('Test input event on different types', () => {
    const emit = (vueWrapper: VueWrapper) => (vueWrapper.emitted<string[]>('input')?.[0]?.[0]);
    expect(DateTime.fromISO(emit(wrapper) ?? '')).toEqual(dateTime.value);

    const timeWrapper = shallowMount(DateTimeVue, {
      props: {
        ...defaultProps,
        type: 'time',
      },
    });
    expect(DateTime.fromISO(emit(timeWrapper) ?? '')).toEqual(dateTime.value);

    const dateWrapper = shallowMount(DateTimeVue, {
      props: {
        ...defaultProps,
        zone: 'UTC-8',
        type: 'date',
      },
    });

    expect(DateTime.fromISO(emit(dateWrapper) ?? '')).toEqual(dateTime.value.startOf('day'));

    const fakeWrapper = shallowMount(DateTimeVue, {
      props: {
        ...defaultProps,
        type: 'fakedatainput',
      },
    });
    expect(DateTime.fromISO(emit(fakeWrapper) ?? '')).toEqual(dateTime.value);
  });

  it('Test format on input field value', () => {
    const inputField = (vueWrapper: VueWrapper) => vueWrapper.find('.vdatetime-input');
    // @ts-ignore
    expect(inputField(wrapper).element.value)
      .toBe(dateTime.value.setZone('local').toLocaleString(DateTime.DATETIME_MED));

    const timeWrapper = shallowMount(DateTimeVue, {
      props: {
        ...defaultProps,
        type: 'time',
      },
    });
    // @ts-ignore
    expect(inputField(timeWrapper).element.value)
      .toBe(dateTime.value.setZone('local').toLocaleString(DateTime.TIME_24_SIMPLE));

    const dateWrapper = shallowMount(DateTimeVue, {
      props: {
        ...defaultProps,
        type: 'date',
      },
    });
    // @ts-ignore
    expect(inputField(dateWrapper).element.value)
      .toBe(dateTime.value.toLocaleString(DateTime.DATE_MED));

    const formatWrapper = shallowMount(DateTimeVue, {
      props: {
        ...defaultProps,
        format: 'HH:mm',
      },
    });
    // @ts-ignore
    expect(inputField(formatWrapper).element.value)
      .toBe(dateTime.value.setZone('local').toLocaleString(DateTime.TIME_24_SIMPLE));
  });

  it('Test datetime without a valid datetime', async () => {
    const popupDatetime = async (vueWrapper: VueWrapper) => {
      const input = vueWrapper.find('input');
      await input.trigger('click');
      const popup = vueWrapper.find('datetime-popup-stub');
      return popup.attributes('datetime') ?? '';
    };

    const minDatetime = DateTime.local().plus({ hour: 1 }).set({ minute: 27 });
    const maxDatetime = DateTime.local().minus({ hour: 1 }).set({ minute: 59 });

    const invalidWrapper = shallowMount(DateTimeVue, {
      props: {
        ...defaultProps,
        modelValue: '',
      },
    });

    expect(await popupDatetime(invalidWrapper)).toEqual(DateTime.local().startOf('minute').toISO());

    const invalidMinTime = shallowMount(DateTimeVue, {
      props: {
        ...defaultProps,
        modelValue: '',
        minDatetime: minDatetime.toISO(),
      },
    });

    expect(await popupDatetime(invalidMinTime)).toEqual(minDatetime.startOf('minute').toISO());

    const invalidMaxTime = shallowMount(DateTimeVue, {
      props: {
        ...defaultProps,
        modelValue: '',
        maxDatetime: maxDatetime.toISO(),
      },
    });

    expect(await popupDatetime(invalidMaxTime)).toEqual(maxDatetime.startOf('minute').toISO());

    const invalidMinuteStep = shallowMount(DateTimeVue, {
      props: {
        ...defaultProps,
        modelValue: '',
        maxDatetime: maxDatetime.toISO(),
        minuteStep: 5,
      },
    });

    expect(await popupDatetime(invalidMinuteStep)).toBe(maxDatetime.plus({ hour: 1 }).startOf('hour').toISO());

    const invalidMinuteStep2 = shallowMount(DateTimeVue, {
      props: {
        ...defaultProps,
        modelValue: '',
        minDatetime: minDatetime.toISO(),
        minuteStep: 5,
      },
    });

    expect(await popupDatetime(invalidMinuteStep2)).toBe(minDatetime.set({ minute: 25 }).startOf('minute').toISO());
  });

  it('Test closing popup on cancel button', async () => {
    await wrapper.find('input').trigger('focus');

    await wrapper.find('.cancel').trigger('click');

    expect(wrapper.find('.popup').exists()).toBe(false);
  });

  it('Test pressing confirm should close popup and emit input event', async () => {
    await wrapper.find('input').trigger('focus');

    await wrapper.find('.confirm').trigger('click');
    await wrapper.find('.confirm').trigger('click');

    expect(wrapper.find('.popup').exists()).toBe(false);

    expect(wrapper.emitted('input')).toHaveLength(2);
  });

  it('Test clicking outside', async () => {
    await wrapper.find('input').trigger('focus');

    await wrapper.find('.vdatetime-overlay').trigger('click');

    expect(wrapper.find('.popup').exists()).toBe(false);
  });
});
