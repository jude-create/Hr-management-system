<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'

ChartJS.register(Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  records: { type: Array, default: () => [] },
})

const fallbackRecords = [
  { date: '2026-07-20', status: 'On Time' },
  { date: '2026-07-20', status: 'On Time' },
  { date: '2026-07-21', status: 'Late' },
  { date: '2026-07-22', status: 'On Time' },
  { date: '2026-07-22', status: 'Requested' },
  { date: '2026-07-23', status: 'On Time' },
  { date: '2026-07-23', status: 'Late' },
]

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const dailyCounts = computed(() => {
  const source = props.records.length ? props.records : fallbackRecords
  const counts = weekDays.map((day) => ({ day, onTime: 0, late: 0, corrections: 0 }))

  source.forEach((record) => {
    const date = record.date ? new Date(record.date) : new Date()
    const index = (date.getDay() + 6) % 7
    const bucket = counts[index]

    if (record.correctionStatus === 'Requested' || record.status === 'Requested') {
      bucket.corrections += 1
    } else if (record.status === 'Late') {
      bucket.late += 1
    } else {
      bucket.onTime += 1
    }
  })

  return counts
})

const chartData = computed(() => ({
  labels: dailyCounts.value.map((item) => item.day),
  datasets: [
    {
      label: 'On time',
      data: dailyCounts.value.map((item) => item.onTime),
      backgroundColor: '#3FC28A',
      borderRadius: 6,
      barThickness: 12,
    },
    {
      label: 'Late',
      data: dailyCounts.value.map((item) => item.late),
      backgroundColor: '#F45B69',
      borderRadius: 6,
      barThickness: 12,
    },
    {
      label: 'Corrections',
      data: dailyCounts.value.map((item) => item.corrections),
      backgroundColor: '#7152F3',
      borderRadius: 6,
      barThickness: 12,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
        stepSize: 1,
        color: '#8A8D91',
        font: { size: 12 },
      },
      grid: {
        drawBorder: false,
        color: '#A2A1A833',
      },
    },
    x: {
      ticks: {
        color: '#8A8D91',
        font: { size: 12 },
      },
      grid: { display: false },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#16151C',
      padding: 10,
      displayColors: true,
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
      },
    },
  },
}
</script>

<template>
  <div class="h-[220px] w-full md:h-[280px]">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
