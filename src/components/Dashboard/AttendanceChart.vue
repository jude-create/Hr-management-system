<script setup>
import { computed, onMounted, ref } from 'vue'
import { ChevronDown, Clock3, UserCheck, UserX } from 'lucide-vue-next'
import Chart from './Chart.vue'
import RequestState from '@/components/RequestState.vue'
import { useAttendanceStore } from '@/stores/attendanceStore'

const attendanceStore = useAttendanceStore()
const period = ref('This Week')
const periods = ['This Week', 'Today']

const records = computed(() => attendanceStore.items)
const chartRecords = computed(() => {
  if (period.value !== 'Today') return records.value

  const today = new Date().toISOString().slice(0, 10)
  return records.value.filter((record) => record.date === today)
})
const total = computed(() => chartRecords.value.length)
const onTime = computed(() => chartRecords.value.filter((record) => record.status === 'On Time').length)
const late = computed(() => chartRecords.value.filter((record) => record.status === 'Late').length)
const corrections = computed(() => chartRecords.value.filter((record) => record.correctionStatus === 'Requested').length)
const attendanceRate = computed(() => {
  if (!total.value) return 0
  return Math.round((onTime.value / total.value) * 100)
})

const summaryCards = computed(() => [
  { label: 'On time', value: onTime.value, icon: UserCheck, color: '#3FC28A' },
  { label: 'Late', value: late.value, icon: Clock3, color: '#F45B69' },
  { label: 'Corrections', value: corrections.value, icon: UserX, color: '#7152F3' },
])

function fetchAttendance() {
  attendanceStore.fetchAll({ limit: 100 }).catch(() => {})
}

onMounted(() => {
  if (!attendanceStore.items.length) fetchAttendance()
})
</script>

<template>
  <main class="mt-4 w-full rounded-lg border border-[#A2A1A833] p-4 shadow-sm">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 class="text-base font-semibold md:text-lg">Attendance Overview</h1>
        <p class="mt-1 text-sm font-light text-[#8A8D91]">
          {{ attendanceRate }}% on-time rate across {{ total }} tracked records
        </p>
      </div>

      <label class="relative w-full sm:w-40">
        <select
          v-model="period"
          class="w-full appearance-none rounded-lg border border-[#A2A1A833] bg-transparent px-3 py-2 pr-9 text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#7152F3]"
        >
          <option v-for="item in periods" :key="item" :value="item">{{ item }}</option>
        </select>
        <ChevronDown class="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-[#8A8D91]" />
      </label>
    </div>

    <div class="mt-5 grid gap-3 sm:grid-cols-3">
      <div
        v-for="card in summaryCards"
        :key="card.label"
        class="flex items-center justify-between rounded-lg border border-[#A2A1A833] px-3 py-3"
      >
        <div>
          <p class="text-xs font-light text-[#8A8D91]">{{ card.label }}</p>
          <p class="mt-1 text-xl font-semibold">{{ card.value }}</p>
        </div>
        <span class="rounded-lg p-2" :style="{ color: card.color, backgroundColor: `${card.color}1A` }">
          <component :is="card.icon" class="h-5 w-5" />
        </span>
      </div>
    </div>

    <RequestState
      :loading="attendanceStore.loading"
      :error="attendanceStore.error"
      :empty="chartRecords.length === 0"
      empty-text="No attendance data is available for this period."
      @retry="fetchAttendance"
    >
      <div class="mt-5">
        <div class="mb-3 flex flex-wrap gap-4 text-xs text-[#8A8D91]">
          <span class="inline-flex items-center gap-2"><i class="h-2.5 w-2.5 rounded-full bg-[#3FC28A]" />On time</span>
          <span class="inline-flex items-center gap-2"><i class="h-2.5 w-2.5 rounded-full bg-[#F45B69]" />Late</span>
          <span class="inline-flex items-center gap-2"><i class="h-2.5 w-2.5 rounded-full bg-[#7152F3]" />Corrections</span>
        </div>
        <Chart :records="chartRecords" />
      </div>
    </RequestState>
  </main>
</template>
