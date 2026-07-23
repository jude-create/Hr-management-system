<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import TablePagination from '@/components/TablePagination.vue'
import RequestState from '@/components/RequestState.vue'
import AppToast from '@/components/AppToast.vue'
import { useAttendanceStore } from '@/stores/attendanceStore'

const props = defineProps({
  showPagination: { type: Boolean, default: false },
  limit: { type: Number, default: 10 },
  search: { type: String, default: '' },
  date: { type: String, default: '' },
})

const attendanceStore = useAttendanceStore()
const perPage = ref(10)
const currentPage = ref(1)
const correctionReason = ref('')
const correctionTarget = ref(null)

const records = computed(() => attendanceStore.items)
const totalPages = computed(() => attendanceStore.meta.totalPages)
const totalItems = computed(() => attendanceStore.meta.total)
const visibleRecords = computed(() => props.showPagination ? records.value : records.value.slice(0, props.limit))

function fetchAttendance() {
  attendanceStore.fetchAll({
    search: props.search,
    date: props.date,
    page: currentPage.value,
    limit: perPage.value,
  }).catch(() => {})
}

function openCorrection(record) {
  correctionTarget.value = record
  correctionReason.value = record.status === 'Late' ? 'Late check-in requires HR review.' : ''
}

async function submitCorrection() {
  if (!correctionTarget.value) return

  await attendanceStore.requestCorrection(correctionTarget.value.id, correctionReason.value).catch(() => {})
  if (!attendanceStore.error) {
    correctionTarget.value = null
    correctionReason.value = ''
  }
}

onMounted(fetchAttendance)
watch(() => [props.search, props.date], () => {
  currentPage.value = 1
  fetchAttendance()
})
watch([currentPage, perPage], fetchAttendance)
</script>

<template>
  <div class="space-y-4">
    <RequestState
      :loading="attendanceStore.loading"
      :error="attendanceStore.error && !attendanceStore.saving ? attendanceStore.error : ''"
      :empty="records.length === 0"
      empty-text="No attendance records match the current filters."
      @retry="fetchAttendance"
    >
      <div class="hidden md:block overflow-x-auto">
        <div class="grid grid-cols-6 border-b-2 border-[#A2A1A81A] pb-3 font-light text-[#A2A1A8] text-sm">
          <div class="px-4">Employee Name</div>
          <div class="px-4">Designation</div>
          <div class="px-4">Type</div>
          <div class="px-4">Check In Time</div>
          <div class="px-4">Status</div>
          <div class="px-4 text-right">Action</div>
        </div>
        <div class="divide-y-2 divide-[#A2A1A81A]">
          <div
            v-for="record in visibleRecords"
            :key="record.id"
            class="grid grid-cols-6 py-2 items-center hover:bg-[#7152F310] transition-colors text-sm"
          >
            <div class="px-4 flex items-center space-x-3">
              <img :src="record.image" alt="" class="w-10 h-10 rounded-full object-cover" />
              <p class="font-light">{{ record.name }}</p>
            </div>
            <div class="px-4 font-light">{{ record.designation }}</div>
            <div class="px-4 font-light">{{ record.type }}</div>
            <div class="px-4 font-light">{{ record.checkIn }}</div>
            <div class="px-4">
              <span
                class="inline-flex items-center justify-center font-light text-xs px-3 py-1.5 rounded-lg"
                :style="{ color: record.statusColor, backgroundColor: `${record.statusColor}1A` }"
              >
                {{ record.correctionStatus || record.status }}
              </span>
            </div>
            <div class="px-4 text-right">
              <button
                class="rounded-lg border border-[#7152F3] px-3 py-1.5 text-xs text-[#7152F3] hover:bg-[#7152F310]"
                :disabled="attendanceStore.saving || record.correctionStatus === 'Requested'"
                @click="openCorrection(record)"
              >
                {{ record.correctionStatus === 'Requested' ? 'Requested' : 'Correction' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="md:hidden divide-y-2 divide-[#A2A1A81A]">
        <div v-for="record in visibleRecords" :key="`m-${record.id}`" class="py-3 px-2">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-3">
              <img :src="record.image" alt="" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <p class="text-sm font-medium">{{ record.name }}</p>
                <p class="text-xs text-[#A2A1A8] font-light">{{ record.designation }}</p>
              </div>
            </div>
            <span
              class="text-xs px-3 py-1 rounded-lg"
              :style="{ color: record.statusColor, backgroundColor: `${record.statusColor}1A` }"
            >
              {{ record.correctionStatus || record.status }}
            </span>
          </div>
          <div class="flex items-center justify-between text-xs text-[#A2A1A8]">
            <span>{{ record.type }}</span>
            <span>{{ record.checkIn }}</span>
            <button class="text-[#7152F3]" @click="openCorrection(record)">Correction</button>
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

    <div v-if="correctionTarget" class="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4">
      <div class="w-full max-w-md rounded-lg bg-white p-5 shadow-xl text-[#16151C]">
        <h2 class="text-lg font-semibold">Request Correction</h2>
        <p class="mt-1 text-sm text-[#8A8D91]">{{ correctionTarget.name }} - {{ correctionTarget.checkIn }}</p>
        <textarea
          v-model="correctionReason"
          class="mt-4 w-full rounded-lg border border-[#A2A1A833] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7152F3]"
          rows="4"
          placeholder="Reason for correction"
        />
        <div class="mt-4 flex justify-end gap-3">
          <button class="rounded-lg border px-4 py-2 text-sm" @click="correctionTarget = null">Cancel</button>
          <button
            class="rounded-lg bg-[#7152F3] px-4 py-2 text-sm text-white disabled:opacity-70"
            :disabled="attendanceStore.saving"
            @click="submitCorrection"
          >
            {{ attendanceStore.saving ? 'Sending...' : 'Send Request' }}
          </button>
        </div>
      </div>
    </div>

    <AppToast
      :message="attendanceStore.success || attendanceStore.error"
      :type="attendanceStore.error ? 'error' : 'success'"
      @close="attendanceStore.clearMessages()"
    />
  </div>
</template>
