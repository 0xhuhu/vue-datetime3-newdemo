<template>
  <div class="vdatetime" :class="$attrs.class" :style="theme">
    <slot name="before"/>
    <input
      :id="inputId"
      class="vdatetime-input"
      :class="inputClass"
      :style="inputStyle"
      type="text"
      :value="inputValue"
      v-bind="$attrs"
      @click="open"
      @focus="open"
    >
    <slot name="after"/>
    <transition-group name="vdatetime-fade" tag="div">
      <div v-if="isOpen && !hideBackdrop" key="overlay" class="vdatetime-overlay" @click.self="clickOutside"/>
      <datetime-popup
        v-if="isOpen"
        key="popup"
        :type="flowType"
        :datetime="popupDate"
        :phrases="phrases"
        :use12-hour="use12Hour"
        :hour-step="hourStep"
        :minute-step="minuteStep"
        :min-datetime="popupMinDatetime"
        :max-datetime="popupMaxDatetime"
        :auto="auto"
        :week-start="weekStart"
        :flow="flow"
        :title="title"
        @confirm="confirm"
        @cancel="close"
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { DateTime, WeekdayNumbers } from 'luxon';
import { computed, onMounted, ref, watch } from 'vue';

import DatetimePopup from './DatetimePopup.vue';
import { FlowStep, FlowType } from './flow/namespace';
import type { Actions } from './namespace';
import { datetimeFromISO, calculateWeekStart } from './utils/datetime';

interface Props {
  modelValue?: string
  valueZone?: string
  inputId?: string
  inputClass?: object | any[] | string
  inputStyle?: object | any[] | string
  hiddenName?: string
  zone?: string
  format?: Object | string
  type?: FlowType
  color?: string
  phrases? : Actions
  use12Hour?: boolean
  hourStep?: number
  minuteStep?: number
  minDatetime?: string
  maxDatetime?: string
  auto?: boolean
  weekStart?: WeekdayNumbers
  flow?: FlowStep[]
  title?: string
  hideBackdrop?: boolean
  backdropClick?: boolean
  fixedDate?: boolean
  fixedTime?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  valueZone: 'UTC',
  inputId: undefined,
  inputClass: '',
  inputStyle: '',
  hiddenName: '',
  zone: 'local',
  format: undefined,
  type: 'date',
  color: '#3f51b5',
  phrases: () => ({ cancel: 'Cancel', ok: 'Ok' }),
  use12Hour: false,
  hourStep: 1,
  minuteStep: 1,
  minDatetime: undefined,
  maxDatetime: undefined,
  auto: false,
  weekStart: calculateWeekStart,
  flow: undefined,
  title: '',
  hideBackdrop: false,
  backdropClick: true,
  fixedDate: false,
  fixedTime: false,
});

const theme = computed(() => ({ '--primary-color': props.color }));

const emits = defineEmits<{
  (e: 'input', value: string): void,
  (e: 'close'): void,
  (e: 'update:modelValue', value: string | null): void,
}>();

const flowType = computed<FlowType>(() => {
  if (props.type === 'datetime') {
    if (props.fixedDate) return 'time';
    if (props.fixedTime) return 'date';
  }
  return props.type;
});

const isOpen = ref<boolean>(false);
const datetime = computed<DateTime | undefined>({
  get() { return datetimeFromISO(props.modelValue); },
  set(newValue: DateTime | undefined) {
    if (newValue) {
      emits('update:modelValue', newValue.toISO());
    }
  },
});

const inputValue = computed(() => {
  let format = props.format;

  if (!format) {
    switch (props.type) {
    case 'date':
      format = DateTime.DATE_MED;
      break;
    case 'time':
      format = DateTime.TIME_24_SIMPLE;
      break;
    case 'datetime':
      format = DateTime.DATETIME_MED;
      break;
    default:
      return '';
    }
  }
  if (typeof format === 'string') {
    return datetime.value ? DateTime.fromISO(props.modelValue).setZone(props.zone).toFormat(format) : '';
  }
  return datetime.value ? datetime.value.setZone(props.zone).toLocaleString(format) : '';
});

const popupMinDatetime = computed<DateTime | undefined>(() => (
  props.minDatetime ? DateTime.fromISO(props.minDatetime).setZone(props.zone) : undefined
));

const popupMaxDatetime = computed<DateTime | undefined>(() => (
  props.maxDatetime ? DateTime.fromISO(props.maxDatetime).setZone(props.zone) : undefined
));

const newPopupDatetime = () => {
  let datetime = DateTime.utc().setZone(props.zone).set({ second: 0, millisecond: 0 });

  if (popupMinDatetime.value && datetime < popupMinDatetime.value) {
    datetime = popupMinDatetime.value.set({ second: 0, millisecond: 0 });
  }

  if (popupMaxDatetime.value && datetime > popupMaxDatetime.value) {
    datetime = popupMaxDatetime.value.set({ second: 0, millisecond: 0 });
  }

  if (props.minuteStep === 1) {
    return datetime;
  }

  const roundedMinute = Math.round(datetime.minute / props.minuteStep) * props.minuteStep;

  if (roundedMinute === 60) {
    return datetime.plus({ hours: 1 }).set({ minute: 0 });
  }

  return datetime.set({ minute: roundedMinute });
};

const popupDate = computed(() => (datetime.value ? datetime.value.setZone(props.zone) : newPopupDatetime()));

const emitInput = () => {
  let innerValue = datetime.value;

  if (innerValue && props.type === 'date') {
    innerValue = innerValue.startOf('day');
  }

  emits('input', innerValue?.toISO() ?? '');
};

onMounted(() => {
  emitInput();
});

const open = (event: any) => {
  event.target.blur();
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
  emits('close');
};

const confirm = (newValue: DateTime) => {
  datetime.value = newValue.toUTC();
  emitInput();
  close();
};

const clickOutside = () => {
  if (props.backdropClick) { close(); }
};

watch(() => props.modelValue, ((value: string) => {
  datetime.value = datetimeFromISO(value);
}));

</script>

<script lang="ts">
export default { inheritAttrs: false };
</script>

<style scoped lang="scss">
.vdatetime-fade-enter-active,
.vdatetime-fade-leave-active {
  transition: opacity .4s;
}

.vdatetime-fade-enter,
.vdatetime-fade-leave-to {
  opacity: 0;
}

.vdatetime-overlay {
  z-index: 999;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity .5s;
}
</style>
