import { onMounted, onUpdated, Ref } from 'vue';

import type { ListElement } from '../namespace';

export default function useListScroller(list: Ref<HTMLElement | null>, pickedClass: string) {
  const scrollFunc = () => {
    if (list.value) {
      const selectedHour: ListElement | null = list.value?.querySelector(pickedClass);
      list.value.scrollTo?.({ top: selectedHour ? selectedHour.offsetTop - 152 : 0, behavior: 'auto' });
    }
  };

  onMounted(scrollFunc);
  onUpdated(scrollFunc);

  return scrollFunc;
}
