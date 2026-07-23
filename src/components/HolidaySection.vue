<script setup>
import { defineProps, computed } from 'vue'
import { Pencil, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  holidays: Array,
  date: String,
  day: String,
  holiday: String
})

defineEmits(['edit', 'delete'])

// Helper function to check if a date is upcoming
const isUpcoming = (dateString) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time to compare dates only
  const holidayDate = new Date(dateString)
  return holidayDate >= today
}
</script>

<template>
  <main>
    <div class="space-y-4">
      <!-- Table Container -->
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full">
          <!-- Table Header -->
          <div class="grid md:grid-cols-6 grid-cols-4  border-b-2 border-gray-200 pb-3 font-light text-[#A2A1A8] items-center pt-6">
            <div class="md:col-span-2 col-span-1">Date</div>
            <div class=" col-span-1">Day</div>
            <div class="md:col-span-2 col-span-1">Holiday Name</div>
            <div class="col-span-1 text-right">Action</div>
          </div>

          <div class="divide-y divide-gray-100">
            <div v-for="holiday in holidays" :key="holiday.id" class="grid md:grid-cols-6 grid-cols-4 items-center py-4 font-light">
              <div class="md:col-span-2 col-span-1 flex items-center space-x-2">
                <!-- Updated border color conditional -->
                <div 
                  :class="{
                    'border-[#7152F3] bg-[#7152F3]': isUpcoming(holiday.date),
                    'border-[#A2A1A81A] bg-[#A2A1A81A]': !isUpcoming(holiday.date)
                  }" 
                  class="border-2  h-10 w-1 rounded-xl" 
                ></div>
                <div class="flex items-center text-sm md:text-base space-x-2"> 
                  <span>{{ holiday.date }}</span>
                </div>
              </div>
              <div class="col-span-1 text-sm md:text-base">{{ holiday.day }}</div>
              <div class="md:col-span-2 col-span-1 text-sm md:text-base flex items-center space-x-2">
                <span>{{ holiday.holiday }}</span>
              </div>
              <div class="col-span-1 flex justify-end gap-2">
                <button class="rounded p-1 hover:bg-[#7152F310]" title="Edit holiday" @click="$emit('edit', holiday)">
                  <Pencil class="h-4 w-4 text-[#7152F3]" />
                </button>
                <button class="rounded p-1 hover:bg-red-50" title="Delete holiday" @click="$emit('delete', holiday)">
                  <Trash2 class="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
