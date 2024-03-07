<template>
  <div class="container">
    <div ref="monthList" class="list">
      <div
        v-for="monthElement in months"
        :key="monthElement.key"
        class="item"
        :class="{
          selected: monthElement.selected,
          disabled: monthElement.disabled,
        }"
        @click="select(monthElement)"
      >
        {{ monthElement.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import { computed, ref } from 'vue';

import useListScroller from './composables/ListScroller';
import type { TimeElement } from './namespace';
import { monthIsDisabled } from './utils/datetime';
import { monthsGenerator } from './utils/generators';

interface Props {
  year: number
  month: number
  minDate?: DateTime
  maxDate?: DateTime
}

const props = defineProps<Props>();

const months = computed<TimeElement[]>(() => (
  monthsGenerator().map((month: string, index: number): TimeElement => ({
    key: index,
    // eslint-disable-next-line no-param-reassign
    number: ++index,
    label: month,
    selected: index === props.month,
    disabled: !(index + 1) || monthIsDisabled(props.minDate, props.maxDate, props.year, index),
  }))
));

const monthList = ref<HTMLElement | null>(null);

useListScroller(monthList, '.selected');

const emits = defineEmits(['change']);

const select = (month: TimeElement) => {
  if (!month.disabled) {
    emits('change', month.number, 10);
  }
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
  width: 100%;
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

.item {
  padding: 10px 0;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  transition: font-size .3s;

  :hover {
    font-size: 32px;
  }
}

.selected {
  color: var(--primary-color);
  font-size: 32px;
}

.disabled {
  opacity: 0.4;
  cursor: default;

  &:hover {
    color: inherit;
    background: transparent;
  }
}
</style>
