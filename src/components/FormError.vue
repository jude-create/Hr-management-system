<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: { type: [String, Array], default: '' },
})

const displayMessage = computed(() => (
  Array.isArray(props.message) ? props.message[0] : props.message
))
</script>

<template>
  <p v-if="displayMessage" class="mt-1 text-xs text-red-500">
    {{ displayMessage }}
  </p>
</template>
