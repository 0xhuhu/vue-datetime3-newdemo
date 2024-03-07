<template>
  <div class="container">
    <div ref="yearList" class="list">
      <div
        v-for="yearElement in years"
        :key="yearElement.key"
        class="item"
        :class="{
          selected: yearElement.selected,
          disabled: yearElement.disabled,
        }"
        @click="select(yearElement)"
      >
        {{ yearElement.number }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import { computed, ref } from 'vue';

import useListScroller from './composables/ListScroller';
import type { TimeElement } from './namespace';
import { yearIsDisabled } from './utils/datetime';
import { yearsGenerator } from './utils/generators';

interface Props {
  year: number
  minDate?: DateTime
  maxDate?: DateTime
}

const props = defineProps<Props>();

const years = computed<TimeElement[]>(() => (yearsGenerator(props.year).map((year: number): TimeElement => ({
  key: year,
  number: year,
  selected: year === props.year,
  disabled: !year || yearIsDisabled(props.minDate, props.maxDate, year),
}))));

const yearList = ref<HTMLElement | null>(null);

useListScroller(yearList, '.selected');

const emits = defineEmits(['change']);

const select = (year: TimeElement) => {
  if (!year.disabled) {
    emits('change', year.number, 10);
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
  user-select: none;

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
