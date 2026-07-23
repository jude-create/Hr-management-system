<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import TablePagination from '@/components/TablePagination.vue'
import RequestState from '@/components/RequestState.vue'
import { usePayrollStore } from '@/stores/payrollStore'

const props = defineProps({
  showPagination: { type: Boolean, default: true },
  limit: { type: Number, default: 10 },
  period: { type: String, default: 'July 2026' },
})

const payrollStore = usePayrollStore()
const perPage = ref(10)
const currentPage = ref(1)

const rows = computed(() => payrollStore.items)
const totalPages = computed(() => payrollStore.meta.totalPages)
const totalItems = computed(() => payrollStore.meta.total)
const visibleRows = computed(() => props.showPagination ? rows.value : rows.value.slice(0, props.limit))

function fetchPayroll() {
  payrollStore.fetchAll({
    period: props.period,
    page: currentPage.value,
    limit: perPage.value,
  }).catch(() => {})
}

onMounted(fetchPayroll)
watch(() => props.period, () => {
  currentPage.value = 1
  fetchPayroll()
})
watch([currentPage, perPage], fetchPayroll)
</script>

<template>
  <div class="overflow-x-auto space-y-4">
    <RequestState
      :loading="payrollStore.loading"
      :error="payrollStore.error && !payrollStore.saving ? payrollStore.error : ''"
      :empty="rows.length === 0"
      empty-text="No payroll records found for this period."
      @retry="fetchPayroll"
    >
      <div class="hidden md:block">
        <div class="grid grid-cols-5 border-b-2 border-[#A2A1A81A] pb-3 font-light text-[#A2A1A8] text-sm">
          <div class="px-4">Employee Name</div>
          <div class="px-4">CTC</div>
          <div class="px-4">Salary Per Month</div>
          <div class="px-4">Deduction</div>
          <div class="px-4">Status</div>
        </div>
        <div class="divide-y-2 divide-[#A2A1A81A]">
          <div
            v-for="row in visibleRows"
            :key="row.id"
            class="grid grid-cols-5 py-2 items-center hover:bg-[#7152F310] transition-colors text-sm"
          >
            <div class="px-4 flex items-center gap-3">
              <img :src="row.image" alt="" class="w-10 h-10 rounded-full object-cover" />
              <p class="font-light">{{ row.name }}</p>
            </div>
            <div class="px-4 font-light">{{ row.ctc }}</div>
            <div class="px-4 font-light">{{ row.salary }}</div>
            <div class="px-4 font-light">{{ row.deduction }}</div>
            <div class="px-4">
              <span
                class="inline-flex items-center justify-center font-light text-xs px-3 py-1.5 rounded-lg"
                :style="{ color: row.statusColor, backgroundColor: `${row.statusColor}1A` }"
              >
                {{ row.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="md:hidden divide-y-2 divide-[#A2A1A81A]">
        <div v-for="row in visibleRows" :key="`m-${row.id}`" class="py-3 px-2">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <img :src="row.image" alt="" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <p class="text-sm font-medium">{{ row.name }}</p>
                <p class="text-xs text-[#A2A1A8]">{{ row.salary }}</p>
              </div>
            </div>
            <span
              class="text-xs px-3 py-1 rounded-lg"
              :style="{ color: row.statusColor, backgroundColor: `${row.statusColor}1A` }"
            >
              {{ row.status }}
            </span>
          </div>
          <div class="flex items-center gap-10 px-2">
            <div>
              <p class="text-xs text-[#A2A1A8] font-light">CTC</p>
              <p class="text-xs font-bold text-[#A2A1A8]">{{ row.ctc }}</p>
            </div>
            <div>
              <p class="text-xs text-[#A2A1A8] font-light">Deduction</p>
              <p class="text-xs font-bold text-[#A2A1A8]">{{ row.deduction }}</p>
            </div>
          </div>
        </div>
      </div>

      <TablePagination
        v-if="showPagination"
        v-model:currentPage="currentPage"
        v-model:perPage="perPage"
        :totalPages="totalPages"
        :totalItems="totalItems"
      />
    </RequestState>
  </div>
</template>
