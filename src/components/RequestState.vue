<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  empty: { type: Boolean, default: false },
  emptyText: { type: String, default: 'No records found.' },
})

defineEmits(['retry'])
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-10 text-sm text-[#8A8D91]">
    Loading...
  </div>

  <div v-else-if="error" class="flex flex-col items-center justify-center gap-3 py-10 text-center">
    <p class="text-sm text-red-500">{{ error }}</p>
    <button
      class="rounded-lg border border-[#7152F3] px-4 py-2 text-sm text-[#7152F3] hover:bg-[#7152F310]"
      @click="$emit('retry')"
    >
      Retry
    </button>
  </div>

  <div v-else-if="empty" class="flex items-center justify-center py-10 text-sm text-[#8A8D91]">
    {{ emptyText }}
  </div>

  <slot v-else />
</template>
