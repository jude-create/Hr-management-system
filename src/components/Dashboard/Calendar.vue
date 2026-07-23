<script setup>
import { computed, onMounted, ref } from 'vue'
import { CalendarDays, Clock3, Plane, UserRoundCheck } from 'lucide-vue-next'
import { useAttendanceStore } from '@/stores/attendanceStore'
import { useHolidaysStore } from '@/stores/holidaysStore'

const selectedColor = ref('purple')
const selectedDate = ref(new Date())
const attendanceStore = useAttendanceStore()
const holidaysStore = useHolidaysStore()

const todayIso = computed(() => new Date().toISOString().slice(0, 10))
const lateRecords = computed(() => attendanceStore.items.filter((record) => record.status === 'Late').slice(0, 3))

const scheduleItems = computed(() => {
  const holidayItems = holidaysStore.items.slice(0, 3).map((holiday) => ({
    id: `holiday-${holiday.id}`,
    date: holiday.date,
    time: 'All day',
    title: holiday.holiday || holiday.name,
    subtitle: holiday.type || 'Company holiday',
    icon: Plane,
    color: '#7152F3',
  }))

  const attendanceItems = lateRecords.value.map((record) => ({
    id: `attendance-${record.id}`,
    date: record.date || todayIso.value,
    time: record.checkIn,
    title: `${record.name} check-in review`,
    subtitle: record.designation,
    icon: Clock3,
    color: '#F45B69',
  }))

  const fallbackItems = [
    {
      id: 'fallback-standup',
      date: todayIso.value,
      time: '09:30',
      title: 'Daily HR attendance review',
      subtitle: 'Operations check-in',
      icon: UserRoundCheck,
      color: '#3FC28A',
    },
  ]

  return [...attendanceItems, ...holidayItems, ...fallbackItems]
})

const attrs = computed(() => scheduleItems.value.map((item) => ({
  key: item.id,
  dates: new Date(item.date),
  dot: { color: item.color },
  popover: {
    label: `${item.time} - ${item.title}`,
  },
})))

const selectedDateLabel = computed(() => selectedDate.value.toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}))

const visibleSchedule = computed(() => {
  const selectedIso = selectedDate.value.toISOString().slice(0, 10)
  const selectedItems = scheduleItems.value.filter((item) => item.date === selectedIso)
  return selectedItems.length ? selectedItems : scheduleItems.value.slice(0, 4)
})

function fetchDashboardSchedule() {
  if (!attendanceStore.items.length) attendanceStore.fetchAll({ limit: 100 }).catch(() => {})
  if (!holidaysStore.items.length) holidaysStore.fetchAll().catch(() => {})
}

function selectDate(day) {
  selectedDate.value = day.date
}

onMounted(fetchDashboardSchedule)
</script>

<template>
  <div class="mt-4 w-full rounded-lg border border-[#A2A1A833] p-3 shadow-sm md:w-80">
    <div class="mb-4 flex items-center justify-between px-1">
      <div>
        <h1 class="text-lg font-semibold">My Schedule</h1>
        <p class="mt-1 text-xs font-light text-[#8A8D91]">{{ selectedDateLabel }}</p>
      </div>
      <span class="rounded-lg bg-[#7152F31A] p-3">
        <CalendarDays color="#7152F3" size="24" />
      </span>
    </div>

    <VCalendar
      v-model="selectedDate"
      expanded
      transparent
      borderless
      :color="selectedColor"
      :attributes="attrs"
      @dayclick="selectDate"
    />

    <section class="mt-4 space-y-3 px-1">
      <div
        v-for="item in visibleSchedule"
        :key="item.id"
        class="flex gap-3 rounded-lg border border-[#A2A1A833] p-3"
      >
        <span class="mt-0.5 h-9 w-9 flex-shrink-0 rounded-lg p-2" :style="{ color: item.color, backgroundColor: `${item.color}1A` }">
          <component :is="item.icon" class="h-5 w-5" />
        </span>
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <p class="text-sm font-semibold">{{ item.time }}</p>
            <span class="h-1 w-1 rounded-full bg-[#A2A1A8]" />
            <p class="truncate text-xs text-[#8A8D91]">{{ item.date }}</p>
          </div>
          <p class="mt-1 truncate text-sm font-medium">{{ item.title }}</p>
          <p class="truncate text-xs font-light text-[#8A8D91]">{{ item.subtitle }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
.vc-container .vc-day {
  color: #A2A1A8;
}
</style>
