<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import TablePagination from '@/components/TablePagination.vue'
import RequestState from '@/components/RequestState.vue'
import AppToast from '@/components/AppToast.vue'
import { useCandidatesStore } from '@/stores/candidatesStore'

const perPage            = ref(10)
const currentPage        = ref(1)
const selectedCandidates = ref([])
const selectAll          = ref(false)
const candidatesStore = useCandidatesStore()
const statuses = ['Selected', 'In Progress', 'Rejected']

const props = defineProps({
  search: { type: String, default: '' },
})

const totalPages = computed(() => candidatesStore.meta.totalPages)
const paginatedCandidates = computed(() => candidatesStore.items)
const totalItems = computed(() => candidatesStore.meta.total)

function fetchCandidates() {
  candidatesStore.fetchAll({
    search: props.search,
    page: currentPage.value,
    limit: perPage.value,
  }).catch(() => {})
}

async function updateCandidateStatus(candidate, status) {
  await candidatesStore.updateStatus(candidate.id, status).catch(() => {})
}

// Keep selectAll in sync when page or perPage changes
watch([currentPage, perPage], () => {
  fetchCandidates()
  selectAll.value = false
})

watch(() => props.search, () => {
  currentPage.value = 1
  fetchCandidates()
})

const isSelected = (c) => selectedCandidates.value.some(s => s.id === c.id)

const toggleOne = (candidate) => {
  const idx = selectedCandidates.value.findIndex(c => c.id === candidate.id)
  idx > -1
    ? selectedCandidates.value.splice(idx, 1)
    : selectedCandidates.value.push(candidate)
  selectAll.value = paginatedCandidates.value.every(c => isSelected(c))
}

const toggleAll = () => {
  if (selectAll.value) {
    selectedCandidates.value = selectedCandidates.value.filter(
      c => !paginatedCandidates.value.some(p => p.name === c.name)
    )
  } else {
    paginatedCandidates.value.forEach(c => {
      if (!isSelected(c)) selectedCandidates.value.push(c)
    })
  }
  selectAll.value = !selectAll.value
}

onMounted(fetchCandidates)
</script>

<template>
  <div class="space-y-4">

    <RequestState
      :loading="candidatesStore.loading"
      :error="candidatesStore.error && !candidatesStore.saving ? candidatesStore.error : ''"
      :empty="paginatedCandidates.length === 0"
      empty-text="No candidates found."
      @retry="fetchCandidates"
    >
    <!-- DESKTOP TABLE -->
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full">

        <div class="lg:grid hidden grid-cols-15 border-b-2 border-[#A2A1A81A] pb-3 font-light text-[#A2A1A8] items-center">
          <div class="col-span-1 px-2">
            <input type="checkbox" :checked="selectAll" @change="toggleAll"
              class="h-4 w-4 rounded border-gray-300 text-[#7152F3] focus:ring-[#7152F3]" />
          </div>
          <div class="col-span-3 px-2">Candidate Name</div>
          <div class="col-span-2 px-2">Applied For</div>
          <div class="col-span-2 px-2">Applied Date</div>
          <div class="col-span-3 px-2">Email Address</div>
          <div class="col-span-2 px-2">Mobile Number</div>
          <div class="col-span-1 px-2 text-right">Status</div>
        </div>

        <div class="divide-y-2 divide-[#A2A1A81A] hidden lg:block">
          <div
            v-for="(candidate, index) in paginatedCandidates"
            :key="index"
            class="grid grid-cols-15 py-2 items-center hover:bg-[#7152F310] transition-colors"
          >
            <div class="col-span-1 px-2">
              <input type="checkbox" :checked="isSelected(candidate)" @change="toggleOne(candidate)"
                class="h-4 w-4 rounded border-gray-300 text-[#7152F3] focus:ring-[#7152F3]" />
            </div>
            <div class="col-span-3 px-2 flex items-center space-x-2 min-w-[220px]">
              <img :src="candidate.image" alt="" class="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              <p class="font-light text-sm truncate">{{ candidate.name }}</p>
            </div>
            <div class="col-span-2 px-2 font-light text-sm truncate min-w-[150px]">{{ candidate.appliedFor }}</div>
            <div class="col-span-2 px-2 font-light text-sm min-w-[110px]">{{ candidate.appliedDate }}</div>
            <div class="col-span-3 px-2 font-light text-sm truncate min-w-[170px]">{{ candidate.email }}</div>
            <div class="col-span-2 px-2 font-light text-sm truncate min-w-[120px]">{{ candidate.number }}</div>
            <div class="col-span-1 px-2 min-w-[90px]">
              <select
                :value="candidate.status"
                class="rounded-lg border border-transparent px-2 py-1 text-xs font-light focus:border-[#7152F3] focus:outline-none"
                :style="{ color: candidate.statusColor, backgroundColor: `${candidate.statusColor}1A` }"
                :disabled="candidatesStore.saving"
                @change="updateCandidateStatus(candidate, $event.target.value)"
              >
                <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- MOBILE CARDS -->
        <div class="lg:hidden divide-y-2 divide-[#A2A1A81A]">
          <div
            v-for="(candidate, index) in paginatedCandidates"
            :key="'m-' + index"
            class="py-3 px-2 hover:bg-[#7152F310] transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-3">
                <input type="checkbox" :checked="isSelected(candidate)" @change="toggleOne(candidate)"
                  class="mt-1 h-4 w-4 rounded border-gray-300 text-[#7152F3]" />
                <img :src="candidate.image" class="w-10 h-10 rounded-full object-cover" alt="" />
                <div>
                  <p class="text-sm font-medium">{{ candidate.name }}</p>
                  <p class="text-xs text-[#A2A1A8]">{{ candidate.appliedFor }}</p>
                </div>
              </div>
              <select
                :value="candidate.status"
                class="rounded-lg border border-transparent px-2 py-1 text-xs"
                :style="{ color: candidate.statusColor, backgroundColor: `${candidate.statusColor}1A` }"
                :disabled="candidatesStore.saving"
                @change="updateCandidateStatus(candidate, $event.target.value)"
              >
                <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
              </select>
            </div>
            <div class="mt-3 space-y-1 text-xs text-[#A2A1A8] pl-9">
              <p><span class="font-medium text-gray-500">Date:</span> {{ candidate.appliedDate }}</p>
              <p class="truncate"><span class="font-medium text-gray-500">Email:</span> {{ candidate.email }}</p>
              <p><span class="font-medium text-gray-500">Phone:</span> {{ candidate.number }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Selection count -->
    <p v-if="selectedCandidates.length" class="text-sm text-gray-600 px-2">
      {{ selectedCandidates.length }} candidate(s) selected
    </p>

    <!-- ↓ REPLACED: was ~35 lines of pagination markup, now 7 ↓ -->
    <TablePagination
      v-model:currentPage="currentPage"
      v-model:perPage="perPage"
      :totalPages="totalPages"
      :totalItems="totalItems"
    />
    </RequestState>
    <AppToast
      :message="candidatesStore.success || candidatesStore.error"
      :type="candidatesStore.error ? 'error' : 'success'"
      @close="candidatesStore.clearMessages()"
    />

  </div>
</template>
