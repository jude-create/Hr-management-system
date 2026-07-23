<script setup>
import { computed, onMounted, ref } from 'vue'

import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/solid'
import Header from '@/components/Header.vue'
import Navbar from '@/components/Navbar.vue'
import JobModal from '@/modals/JobModal.vue'
import { CirclePlus } from 'lucide-vue-next'
import HolidaySection from '@/components/HolidaySection.vue'
import HolidayModal from '@/modals/HolidayModal.vue'
import RequestState from '@/components/RequestState.vue'
import AppToast from '@/components/AppToast.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useHolidaysStore } from '@/stores/holidaysStore'

const taskModal = ref(false)
const search = ref('')
const holidaysStore = useHolidaysStore()
const editingHoliday = ref(null)
const holidayToDelete = ref(null)
function toggleModal() {
  taskModal.value = !taskModal.value
}

const holidays = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return holidaysStore.items

  return holidaysStore.items.filter((holiday) =>
    holiday.holiday.toLowerCase().includes(query)
      || holiday.date.toLowerCase().includes(query)
      || holiday.day.toLowerCase().includes(query),
  )
})

function fetchHolidays() {
  holidaysStore.fetchAll().catch(() => {})
}

async function saveHoliday(payload) {
  const request = payload.id
    ? holidaysStore.update(payload.id, payload)
    : holidaysStore.create(payload)

  await request.catch(() => {})
  if (!holidaysStore.error) {
    taskModal.value = false
    editingHoliday.value = null
    fetchHolidays()
  }
}

function openEditHoliday(holiday) {
  editingHoliday.value = holiday
  taskModal.value = true
}

function closeHolidayModal() {
  taskModal.value = false
  editingHoliday.value = null
}

async function deleteHoliday() {
  if (!holidayToDelete.value) return

  await holidaysStore.remove(holidayToDelete.value.id).catch(() => {})
  if (!holidaysStore.error) {
    holidayToDelete.value = null
    fetchHolidays()
  }
}

onMounted(fetchHolidays)
</script>

<template>
   <div class="flex min-h-screen ">
   

    <!-- Main content -->
    <main class="flex-1">

      <div class=" border border-[#A2A1A833] rounded-lg px-3 pt-5 mt-4 shadow-sm mx-3 mb-9">
      <!-- Search -->

    <div class="flex justify-between">
       <div class=" relative hidden md:block ">
        <MagnifyingGlassIcon class="h-6 w-6  absolute ml-2 mt-2" />
       <input
       v-model="search"
       type="text"
        placeholder="Search..."
       class="pl-10 pr-2 px-2 py-3 w-80 bg-transparent placeholder:text-[#8A8D91] text-base border border-gray-300 rounded-lg 
         focus:outline-none focus:border-[#7152F3] focus:ring-2 focus:ring-[#7152F3] transition duration-200"
      />
    </div>

    <button v-on:click="toggleModal" class="flex space-x-3 border border-[#7152F3] bg-[#7152F3] 
    text-[#FFFFFF] rounded-lg p-3 font-light shadow-sm cursor-pointer hover:bg-[#5b41cc]
    transition-colors ease-in-out duration-200">
        <CirclePlus />

        <div>
          Add New Holiday
       </div>
    </button>
    </div>
    
     
     <div class=" w-full mt-3">
      <RequestState
        :loading="holidaysStore.loading"
        :error="holidaysStore.error && !holidaysStore.saving ? holidaysStore.error : ''"
        :empty="holidays.length === 0"
        empty-text="No holidays match your current search."
        @retry="fetchHolidays"
      >
    <HolidaySection
    :holidays="holidays"
    @edit="openEditHoliday"
    @delete="holidayToDelete = $event"
    />
      </RequestState>
    </div>
    
    <div class="flex items-center space-x-5 mt-6 mb-5">
        <div class="flex items-center space-x-2">
            <div class="border border-[#7152F3] bg-[#7152F3] rounded-full w-4 h-4" />
            <p class="font-semibold text-sm">Upcoming</p>
        </div>

         <div class="flex items-center space-x-2">
            <div class="border border-[#A2A1A833] bg-[#A2A1A833] rounded-full w-4 h-4" />
            <p class="font-semibold text-sm">Past Holidays</p>
        </div>
    </div>
    <HolidayModal
      :visible="taskModal"
      :saving="holidaysStore.saving"
      :error="holidaysStore.error"
      :validation-errors="holidaysStore.validationErrors"
      :holiday="editingHoliday"
      @close="closeHolidayModal"
      @save="saveHoliday"
    />
    <ConfirmDialog
      :visible="Boolean(holidayToDelete)"
      title="Delete Holiday"
      :message="`Delete ${holidayToDelete?.holiday || 'this holiday'}? This will be sent to the backend.`"
      confirm-text="Delete"
      :loading="holidaysStore.saving"
      @cancel="holidayToDelete = null"
      @confirm="deleteHoliday"
    />
    <AppToast
      :message="holidaysStore.success || holidaysStore.error"
      :type="holidaysStore.error ? 'error' : 'success'"
      @close="holidaysStore.clearMessages()"
    />
  </div>

    </main>
    </div>
</template>
