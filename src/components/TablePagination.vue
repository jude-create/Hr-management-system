<script setup>
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import useTheme from '@/config/useTheme'

const { isDark } = useTheme()

const props = defineProps({
  currentPage:  { type: Number,  required: true },
  totalPages:   { type: Number,  required: true },
  perPage:      { type: Number,  required: true },
  totalItems:   { type: Number,  required: true },
  perPageOptions: { type: Array, default: () => [5, 10, 15] },
})

const emit = defineEmits(['update:currentPage', 'update:perPage'])

// Windowed page list — never shows more than 5 buttons
const visiblePages = computed(() => {
  const max  = 5
  const half = Math.floor(max / 2)
  let start  = Math.max(props.currentPage - half, 1)
  let end    = Math.min(start + max - 1, props.totalPages)
  if (end - start + 1 < max) start = Math.max(end - max + 1, 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const showingRange = computed(() => {
  if (!props.totalItems) return 'Showing 0 of 0'
  const start = (props.currentPage - 1) * props.perPage + 1
  const end   = Math.min(start + props.perPage - 1, props.totalItems)
  return `Showing ${start}-${end} of ${props.totalItems}`
})

const prev = () => { if (props.currentPage > 1) emit('update:currentPage', props.currentPage - 1) }
const next = () => { if (props.currentPage < props.totalPages) emit('update:currentPage', props.currentPage + 1) }
const goTo = (page) => emit('update:currentPage', page)
const changePerPage = (e) => {
  emit('update:perPage', Number(e.target.value))
  emit('update:currentPage', 1)  // reset to page 1 on page-size change
}
</script>

<template>
  <div class="flex flex-col sm:flex-row justify-between items-center gap-4 px-2 py-4">

    <!-- Per-page selector -->
    <div class="flex items-center gap-2">
      <label class="text-xs sm:text-sm text-[#A2A1A8] whitespace-nowrap">Rows per page</label>
      <select
        :value="perPage"
        @change="changePerPage"
        class="border rounded-md px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#7152F3]"
        :class="isDark ? 'bg-[#16151C] text-white border-[#333]' : 'bg-white text-[#16151C]'"
      >
        <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
    </div>

    <!-- Range + nav -->
    <div class="flex items-center gap-3 flex-wrap justify-center">
      <span class="text-xs sm:text-sm text-[#A2A1A8] whitespace-nowrap">{{ showingRange }}</span>

      <!-- Prev -->
      <button
        :disabled="currentPage === 1"
        @click="prev"
        class="p-1.5 rounded-lg hover:bg-[#7152F310] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeftIcon class="h-4 w-4" />
      </button>

      <!-- Page numbers -->
      <div class="flex gap-1">
        <!-- Leading ellipsis -->
        <span v-if="visiblePages[0] > 1" class="px-2 py-1 text-sm text-[#A2A1A8]">…</span>

        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goTo(page)"
          :class="[
            'min-w-[32px] px-2 py-1 rounded-lg text-sm transition-colors',
            page === currentPage
              ? 'border border-[#7152F3] text-[#7152F3] font-semibold bg-[#7152F310]'
              : 'hover:bg-[#7152F310] text-[#A2A1A8]'
          ]"
          :aria-current="page === currentPage ? 'page' : undefined"
        >
          {{ page }}
        </button>

        <!-- Trailing ellipsis -->
        <span v-if="visiblePages[visiblePages.length - 1] < totalPages" class="px-2 py-1 text-sm text-[#A2A1A8]">…</span>
      </div>

      <!-- Next -->
      <button
        :disabled="currentPage >= totalPages || totalPages === 0"
        @click="next"
        class="p-1.5 rounded-lg hover:bg-[#7152F310] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRightIcon class="h-4 w-4" />
      </button>
    </div>

  </div>
</template>
