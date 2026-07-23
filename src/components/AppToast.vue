<script setup>
import { onBeforeUnmount, watch } from 'vue'
import { CheckCircle, CircleAlert, X } from 'lucide-vue-next'

const props = defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'success' },
  duration: { type: Number, default: 4000 },
})

const emit = defineEmits(['close'])
let timeoutId

watch(
  () => props.message,
  (message) => {
    window.clearTimeout(timeoutId)
    if (message && props.duration > 0) {
      timeoutId = window.setTimeout(() => emit('close'), props.duration)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => window.clearTimeout(timeoutId))
</script>

<template>
  <div
    v-if="message"
    class="fixed right-4 top-4 z-[120] flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-lg"
    :class="type === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700'"
  >
    <component :is="type === 'error' ? CircleAlert : CheckCircle" class="mt-0.5 h-5 w-5 flex-shrink-0" />
    <p class="text-sm font-light">{{ message }}</p>
    <button class="ml-2 rounded p-0.5 hover:bg-black/5" @click="$emit('close')">
      <X class="h-4 w-4" />
    </button>
  </div>
</template>
