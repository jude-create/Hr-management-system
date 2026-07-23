<script setup>
import { Loader2 } from 'lucide-vue-next'

defineProps({
  loading: Boolean,
  disabled: Boolean,
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' },
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-light transition-colors disabled:cursor-not-allowed disabled:opacity-70"
    :class="variant === 'secondary'
      ? 'border border-[#A2A1A833] hover:bg-[#7152F310]'
      : 'bg-[#7152F3] text-white hover:bg-indigo-700'"
  >
    <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
    <span v-if="loading">Saving...</span>
    <slot v-if="!loading" />
  </button>
</template>
