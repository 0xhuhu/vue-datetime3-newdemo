<template>
  <div class="container" :class="{ 'with-suffix': use12Hour }">
    <div ref="hourList" class="list list--hour">
      <div
        v-for="hourElement in hours"
        :key="hourElement.key"
        class="item"
        :class="{
          selected: hourElement.selected,
          disabled: hourElement.disabled,
        }"
        @click="selectHour(hourElement)"
      >
        {{ pad(formatHour(hourElement.number)) }}
      </div>
    </div>
    <div ref="minuteList" class="list list--minute">
      <div
        v-for="minuteElement in minutes"
        :key="minuteElement.key"
        class="item"
        :class="{
          selected: minuteElement.selected,
          disabled: minuteElement.disabled,
        }"
        @click="selectMinute(minuteElement)"
      >
        {{ minuteElement.label }}
      </div>
    </div>
    <div v-if="use12Hour" ref="suffixList" class="list list--suffix">
      <div
        class="item"
        :class="{ selected: hour < 12 }"
        @click="selectSuffix('am')"
      >
        am
      </div>
      <div
        class="item"
        :class="{ selected: hour >= 12 }"
        @click="selectSuffix('pm')"
      >
        pm
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import useListScroller from './composables/ListScroller';
import type { ChangeEvent, TimeElement } from './namespace';
import { pad } from './utils';
import { timeComponentIsDisabled } from './utils/datetime';
import { hoursGenerator, minutesGenerator } from './utils/generators';

interface Props {
  hour: number
  minute: number
  use12Hour?: boolean
  hourStep?: number
  minuteStep?: number
  minTime?: string
  maxTime?: string
}

const props = withDefaults(defineProps<Props>(), {
  use12Hour: false,
  hourStep: 1,
  minuteStep: 1,
  minTime: undefined,
  maxTime: undefined,
});

const minHour = computed<number | null>(() => (props.minTime ? parseInt(props.minTime.split(':')[0], 10) : null));
const maxHour = computed<number | null>(() => (props.maxTime ? parseInt(props.maxTime.split(':')[0], 10) : null));

const hours = computed<TimeElement[]>(() => hoursGenerator(props.hourStep).filter((hour: number) => {
  if (!props.use12Hour) {
    return true;
  } if (props.hour < 12) {
    return hour < 12;
  }
  return hour >= 12;
}).map((hour: number): TimeElement => ({
  key: hour,
  number: hour,
  label: pad(hour),
  selected: hour === props.hour,
  disabled: timeComponentIsDisabled(minHour.value, maxHour.value, hour),
})));

const minMinute = computed<number | null>(
  () => (props.minTime && minHour.value === props.hour ? parseInt(props.minTime.split(':')[1], 10) : null),
);
const maxMinute = computed<number | null>(
  () => (props.maxTime && maxHour.value === props.hour ? parseInt(props.maxTime.split(':')[1], 10) : null),
);

const minutes = computed<TimeElement[]>(() => minutesGenerator(props.minuteStep).map((minute: number): TimeElement => ({
  key: minute,
  number: minute,
  label: pad(minute),
  selected: minute === props.minute,
  disabled: timeComponentIsDisabled(minMinute.value, maxMinute.value, minute),
})));

const hourList = ref<HTMLInputElement | null>(null);
const minuteList = ref<HTMLInputElement | null>(null);

useListScroller(hourList, '.selected');
useListScroller(minuteList, '.selected');

const emits = defineEmits<{
  change: ChangeEvent[],
}>();

const selectHour = (hour: TimeElement) => {
  if (!hour.disabled) {
    emits('change', { hour: hour.number });
  }
};

const selectMinute = (minute: TimeElement) => {
  if (!minute.disabled) {
    emits('change', { minute: minute.number });
  }
};

const selectSuffix = (suffix: 'am' | 'pm') => {
  if (suffix === 'am') {
    if (props.hour >= 12) {
      emits('change', { hour: props.hour - 12, suffixTouched: true });
    }
  }
  if (suffix === 'pm') {
    if (props.hour < 12) {
      emits('change', { hour: props.hour + 12, suffixTouched: true });
    }
  }
};

const formatHour = (hour: number) => {
  if (props.use12Hour) {
    return hour % 12 ? hour % 12 : 12;
  }
  return hour;
};
</script>

<style scoped lang="scss">
.container {
  box-sizing: border-box;

  &::after {
    content: '';
    display: table;
    clear: both;
  }

  & * {
    box-sizing: border-box;
  }
}

.list {
  float: left;
  width: 50%;
  height: 305px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: #efefef;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
  }
}

.with-suffix .list {
  width: 33.3%;
}

.item {
  padding: 10px 0;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  transition: font-size .3s;
}

.item:hover {
  font-size: 32px;
}

.selected {
  color: var(--primary-color);
  font-size: 32px;
}

.disabled {
  opacity: 0.4;
  cursor: default;
  font-size: 20px !important;
}
</style>
