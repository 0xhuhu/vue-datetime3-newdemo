import { onMounted, onUnmounted } from 'vue';

export default function useKeyPressListener(eventHandler: (event: KeyboardEvent) => void) {
  onMounted(() => {
    document.addEventListener('keydown', eventHandler);
  });
  onUnmounted(() => {
    document.removeEventListener('keydown', eventHandler);
  });
}
