<template>
  <div class="popup">
    <div class="header">
      <div v-if="title" class="title">{{ title }}</div>
      <div v-if="type !== 'time'" class="year" @click="showYear">{{ year }}</div>
      <div v-if="type !== 'time'" class="month" @click="showMonth">{{ dateFormatted }}</div>
    </div>
    <div class="popup__body">
      <datetime-year-picker
        v-if="step === 'year'"
        :min-date="minDatetime"
        :max-date="maxDatetime"
        :year="year"
        @change="onChangeYear"
      />
      <datetime-month-picker
        v-if="step === 'month'"
        :min-date="minDatetime"
        :max-date="maxDatetime"
        :year="year"
        :month="month"
        @change="onChangeMonth"
      />
      <datetime-calendar
        v-if="step === 'date'"
        :year="year"
        :month="month"
        :day="day"
        :min-date="minDatetime"
        :max-date="maxDatetime"
        :week-start="weekStart"
        @change="onChangeDate"
      />
      <datetime-time-picker
        v-if="step === 'time'"
        :hour="hour"
        :minute="minute"
        :use12-hour="use12Hour"
        :hour-step="hourStep"
        :minute-step="minuteStep"
        :min-time="minTime"
        :max-time="maxTime"
        @change="onChangeTime"
      />
    </div>
    <div class="actions">
      <div class="actions__button cancel" @click="emits('cancel')">
        <slot name="button-cancel__internal" :step="step">{{ phrases.cancel }}</slot>
      </div>
      <div class="actions__button confirm" @click="nextStep()">
        <slot name="button-confirm__internal" :step="step">{{ phrases.ok }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime, WeekdayNumbers } from 'luxon';
import { computed, ref } from 'vue';

import useKeyPressListener from './composables/KeyPress';
import DatetimeCalendar from './DatetimeCalendar.vue';
import DatetimeMonthPicker from './DatetimeMonthPicker.vue';
import DatetimeTimePicker from './DatetimeTimePicker.vue';
import DatetimeYearPicker from './DatetimeYearPicker.vue';
import { createFlowManager, createFlowManagerFromType, flowEndStatus } from './flow';
import { FlowStep, FlowType, StepType } from './flow/namespace';
import type { Actions, ChangeEvent } from './namespace';

interface Props {
  datetime: DateTime
  phrases?: Actions
  type?: FlowType
  use12Hour?: boolean
  hourStep?: number
  minuteStep?: number
  minDatetime?: DateTime
  maxDatetime?: DateTime
  auto?: boolean
  weekStart?: WeekdayNumbers
  flow?: FlowStep[]
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  phrases: () => ({ cancel: 'Cancel', ok: 'Ok' }),
  type: 'date',
  use12Hour: false,
  hourStep: 1,
  minuteStep: 1,
  minDatetime: undefined,
  maxDatetime: undefined,
  auto: false,
  weekStart: 1,
  flow: undefined,
  title: '',
});

const emits = defineEmits(['cancel', 'confirm']);

interface TimeParts {
  year?: boolean,
  month?: boolean,
  day?: boolean,
  hour?: boolean,
  minutes?: boolean,
  suffix?: boolean,
}

const flowManager = props.flow ? createFlowManager(props.flow) : createFlowManagerFromType(props.type);
const newDateTime = ref<DateTime>(props.datetime ?? DateTime.now());
const step = ref<StepType>(flowManager.first());
let timePartsTouched: TimeParts = {};

const nextStep = () => {
  step.value = flowManager.next(step.value);
  timePartsTouched = {};

  if (step.value === flowEndStatus) {
    emits('confirm', newDateTime.value);
  }
};

useKeyPressListener((event: KeyboardEvent) => {
  switch (event.key) {
  case 'Escape':
  case 'Tab':
    emits('cancel');
    break;

  case 'Enter':
    nextStep();
    break;
  default:
    break;
  }
});

const year = computed<number>(() => newDateTime.value.year);
const month = computed<number>(() => newDateTime.value.month);
const day = computed<number>(() => newDateTime.value.day);
const hour = computed<number>(() => newDateTime.value.hour);
const minute = computed<number>(() => newDateTime.value.minute);
const dateFormatted = computed<string>(() => newDateTime.value.toLocaleString({
  month: 'long',
  day: 'numeric',
}));

const minTime = computed<string | undefined>(() => ((
  props.minDatetime &&
  props.minDatetime.year === year.value &&
  props.minDatetime.month === month.value &&
  props.minDatetime.day === day.value
) ? props.minDatetime.toFormat('HH:mm') : undefined));

const maxTime = computed<string | undefined>(() => ((
  props.maxDatetime &&
  props.maxDatetime.year === year.value &&
  props.maxDatetime.month === month.value &&
  props.maxDatetime.day === day.value
) ? props.maxDatetime.toFormat('HH:mm') : undefined));

const showYear = () => {
  step.value = 'year';
  flowManager.diversion('date');
};

const showMonth = () => {
  step.value = 'month';
  flowManager.diversion('date');
};

const onChangeYear = (_year: number) => {
  newDateTime.value = newDateTime.value.set({ year: _year });

  if (props.auto) {
    nextStep();
  }
};

const onChangeMonth = (newValue: number) => {
  newDateTime.value = newDateTime.value.set({ month: newValue });

  if (props.auto) {
    nextStep();
  }
};

const onChangeDate = (changeEvent: ChangeEvent) => {
  newDateTime.value = newDateTime.value.set({
    year: changeEvent?.year,
    month: changeEvent?.month,
    day: changeEvent?.day,
  });

  if (props.auto) {
    nextStep();
  }
};

const onChangeTime = (changeEvent: ChangeEvent) => {
  if (changeEvent.suffixTouched) {
    timePartsTouched.suffix = true;
  }

  if (Number.isInteger(changeEvent.hour)) {
    newDateTime.value = newDateTime.value.set({ hour: changeEvent?.hour });
    timePartsTouched.hour = true;
  }

  if (Number.isInteger(changeEvent.minute)) {
    newDateTime.value = newDateTime.value.set({ minute: changeEvent?.minute });
    timePartsTouched.minutes = true;
  }
};

</script>

<style scoped lang="scss">
.popup {
  box-sizing: border-box;
  z-index: 1000;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 340px;
  max-width: calc(100% - 30px);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  color: #444;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  line-height: 1.18;
  background: #fff;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  & * {
    box-sizing: border-box;
  }
}

.header {
  padding: 18px 30px;
  background: var(--primary-color);
  color: #fff;
  font-size: 32px;
  overflow: hidden;
}

.title {
  margin-bottom: 8px;
  font-size: 21px;
  font-weight: 300;
}

.year {
  font-weight: 300;
  font-size: 14px;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity .3s;

  &:hover {
    opacity: 1;
  }
}

.month {
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
}

.actions {
  padding: 0 20px 10px 30px;
  text-align: right;
}

.actions__button {
  display: inline-block;
  border: none;
  padding: 10px 20px;
  background: transparent;
  font-size: 16px;
  color: var(--primary-color);
  cursor: pointer;
  transition: color .3s;

  &:hover {
    color: #444;
  }
}
</style>
