<script setup>
import useTheme from '@/config/useTheme'

defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: 'Confirm action' },
  message: { type: String, default: 'Are you sure you want to continue?' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  loading: { type: Boolean, default: false },
})

defineEmits(['cancel', 'confirm'])

const { isDark } = useTheme()
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4">
    <div
      class="w-full max-w-md rounded-lg border p-5 shadow-xl"
      :class="isDark ? 'border-[#2C2B34] bg-[#16151C] text-white' : 'border-gray-200 bg-white text-[#16151C]'"
    >
      <h2 class="text-lg font-semibold">{{ title }}</h2>
      <p class="mt-2 text-sm font-light text-[#8A8D91]">{{ message }}</p>

      <div class="mt-6 flex justify-end gap-3">
        <button
          class="rounded-lg border border-[#A2A1A833] px-4 py-2 text-sm hover:bg-[#7152F310]"
          :disabled="loading"
          @click="$emit('cancel')"
        >
          {{ cancelText }}
        </button>
        <button
          class="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="loading"
          @click="$emit('confirm')"
        >
          {{ loading ? 'Working...' : confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
