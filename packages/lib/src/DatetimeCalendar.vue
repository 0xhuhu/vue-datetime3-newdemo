<template>
  <div class="calendar">
    <div class="navigation">
      <div class="navigation--previous" @click="previousMonth">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3 102.8">
          <path fill="none" stroke="#444" stroke-width="14" stroke-miterlimit="10" d="M56.3 97.8L9.9 51.4 56.3 5"/>
        </svg>
      </div>
      <div class="current--month">{{ monthName }} {{ newYear }}</div>
      <div class="navigation--next" @click="nextMonth">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3 102.8">
          <path fill="none" stroke="#444" stroke-width="14" stroke-miterlimit="10" d="M56.3 97.8L9.9 51.4 56.3 5"/>
        </svg>
      </div>
    </div>
    <div class="month">
      <div
        v-for="weekday in weekdays"
        :key="weekday"
        class="month__weekday"
      >
        {{ weekday }}
      </div>
      <div
        v-for="dayElement in days"
        :key="dayElement.key"
        class="month__day"
        :class="{
          selected: dayElement.selected,
          disabled: dayElement.disabled,
        }"
        @click="selectDay(dayElement)"
      >
        <span>
          <span>
            {{ dayElement.number }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime, WeekdayNumbers } from 'luxon';
import { computed, ref } from 'vue';

import type { ChangeEvent, DateElement, TimeElement } from './namespace';
import { dateIsDisabled, monthDays } from './utils/datetime';
import { monthsGenerator, weekdaysGenerator } from './utils/generators';

interface Props {
  year: number
  month: number
  day?: number
  disabled?: number[]
  minDate?: DateTime
  maxDate?: DateTime
  weekStart?: WeekdayNumbers
}

const props = withDefaults(defineProps<Props>(), {
  day: undefined,
  disabled: () => [],
  minDate: undefined,
  maxDate: undefined,
  weekStart: 1,
});

const emits = defineEmits<{
  change: ChangeEvent[],
}>();

const newDate = ref<DateTime>(
  DateTime.fromObject({ year: props.year.valueOf(), month: props.month.valueOf() }, { zone: 'UTC' }),
);
const weekdays = weekdaysGenerator(props.weekStart);
const months = monthsGenerator();

const newYear = computed<number>(() => newDate.value.year);
const newMonth = computed<number>(() => newDate.value.month);
const monthName = computed<string>(() => months[newMonth.value - 1]);
const days = computed<TimeElement[]>(() => monthDays(newYear.value, newMonth.value, props.weekStart)
  .map((date: DateElement, index): TimeElement => ({
    key: index,
    number: date.day,
    selected: props.year === date.year &&
      props.month === date.month && props.day === date.day,
    disabled: date.month !== newMonth.value || props.disabled.includes(date.day) ||
      dateIsDisabled(props.minDate, props.maxDate, newYear.value, newMonth.value, date.day),
  })));

const selectDay = (day: TimeElement) => {
  if (!day.disabled) {
    emits('change', { year: newYear.value, month: newMonth.value, day: day.number });
  }
};
const previousMonth = () => {
  newDate.value = newDate.value.minus({ month: 1 });
};
const nextMonth = () => {
  newDate.value = newDate.value.plus({ month: 1 });
};
</script>

<style scoped lang="scss">
.navigation {
  position: relative;
  margin: 15px 0;
  padding: 0 30px;
  width: 100%;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }
}

.navigation--previous,
.navigation--next {
  position: absolute;
  top: 0;
  padding: 0 5px;
  width: 18px;
  cursor: pointer;

  & svg {
    width: 8px;
    height: 13px;

    & path {
      transition: stroke .3s;
    }
  }

  &:hover svg path {
    stroke: #888;
  }
}

.navigation--previous {
  left: 25px;
}

.navigation--next {
  right: 25px;
  transform: scaleX(-1);
}

.current--month {
  text-align: center;
  text-transform: capitalize;
}

.month {
  padding: 0 20px;
  transition: height .2s;
}

.month__weekday,
.month__day {
  display: inline-block;
  width: calc(100% / 7);
  line-height: 36px;
  text-align: center;
  font-size: 15px;
  font-weight: 300;
  cursor: pointer;

  & > span {
    display: block;
    width: 100%;
    position: relative;
    height: 0;
    padding: 0 0 100%;
    overflow: hidden;

    & > span {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border: 0;
      border-radius: 50%;
      transition: background-color .3s, color .3s;
    }
  }
}

.month__weekday {
  font-weight: bold;
}

.month__day:hover > span > span {
  background: #eee;
}

.selected {
  & > span > span,
  &:hover > span > span {
    color: #fff;
    background: var(--primary-color);
  }
}

.disabled {
  opacity: 0.4;
  cursor: default;

  &:hover > span > span {
    color: inherit;
    background: transparent;
  }
}
</style>
