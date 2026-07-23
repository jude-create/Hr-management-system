<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { AdjustmentsHorizontalIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { ChevronLeftIcon, ChevronRightIcon, CirclePlus } from 'lucide-vue-next'
import useTheme from '@/config/useTheme'
import EmployeeFilter from '@/modals/EmployeeFilter.vue'
import RequestState from '@/components/RequestState.vue'
import { useDepartmentsStore } from '@/stores/departmentsStore'

const { isDark } = useTheme()
const route = useRoute()
const departmentsStore = useDepartmentsStore()
const departmentSlug = route.params.slug

const taskModal = ref(false)
function toggleModal() {
  taskModal.value = !taskModal.value
}

const setHeaderDepartment = inject('setHeaderDepartment');

onMounted(async () => {
  await fetchDepartment()
  setHeaderDepartment(department.value)
})
onUnmounted(() => setHeaderDepartment(null))

const department = computed(() => departmentsStore.selected)

const search = ref('')

// Pagination variables
const perPage = ref(10)
const currentPage = ref(1)

// Computed properties for pagination
const filteredMembers = computed(() => {
  if (!search.value) return department.value?.members || []
  return department.value?.members.filter(member =>
    member.name.toLowerCase().includes(search.value.toLowerCase())
  ) || []
})

const totalPages = computed(() => {
  return Math.ceil(filteredMembers.value.length / perPage.value)
})

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredMembers.value.slice(start, end)
})

const showingRange = computed(() => {
  const start = (currentPage.value - 1) * perPage.value + 1
  const end = Math.min(start + perPage.value - 1, filteredMembers.value.length)
  return `Showing ${start} to ${end} of ${filteredMembers.value.length} members`
})

const visiblePages = computed(() => {
  const maxVisible = 5
  const half = Math.floor(maxVisible / 2)
  let start = Math.max(currentPage.value - half, 1)
  let end = Math.min(start + maxVisible - 1, totalPages.value)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(end - maxVisible + 1, 1)
  }
  
  return Array.from({length: end - start + 1}, (_, i) => start + i);

 
})

function fetchDepartment() {
  return departmentsStore.fetchDepartment(departmentSlug).catch(() => {})
}
</script>

<template>
  <div class="flex min-h-screen "> 
  
  
    <!-- Main content -->
    <main class="flex-1 overflow-hidden">
      
      
      <div class="border border-[#A2A1A833] rounded-lg md:px-3 pt-5 mt-4 shadow-sm mx-3 md:mb-9">
        <div class="flex justify-between">
        <!-- Search -->
        <div class="relative hidden md:block">
          <MagnifyingGlassIcon class="h-6 w-6  absolute ml-2 mt-2" />
          <input
            type="text"
            placeholder="Search..."
            class="pl-10 pr-2 px-2 py-2 w-80 bg-transparent placeholder:text-[#8A8D91] text-base border border-gray-300 rounded-lg 
              focus:outline-none focus:border-[#7152F3] focus:ring-2 focus:ring-[#7152F3] transition duration-200"
            v-model="search"
          />
        </div>
        <div class="flex space-x-4">
           <RouterLink
           to="/employees/add-new-employee"
            class="flex space-x-3 border border-[#7152F3] bg-[#7152F3] text-[#FFFFFF] 
            rounded-lg p-3 font-light cursor-pointer shadow-sm r-pointer hover:bg-[#5b41cc]
    transition-colors ease-in-out duration-200">
            <CirclePlus />

             <div>
             Add New Employee
          </div>
         </RouterLink>
          
         


          <button
          v-on:click="toggleModal"
          class="flex items-center justify-center space-x-3 border border-[#A2A1A833] 
           rounded-lg py-3 px-7 font-light cursor-pointer shadow-sm">
            <AdjustmentsHorizontalIcon class="h-5 w-5 " />
            <div>
                 Filter
            </div>
           
          </button>
         
        </div>
           

        </div>


        <RequestState
          :loading="departmentsStore.loading"
          :error="departmentsStore.error"
          :empty="filteredMembers.length === 0"
          empty-text="No members found in this department."
          @retry="fetchDepartment"
        >
        <div class="pt-8 hidden md:block">
         
          <!-- Header -->
          <div class="flex border-b-2 border-[#A2A1A81A] pb-3 font-light text-[#A2A1A8] text-base">
            <div class="w-[18%] px-3">Employee ID</div>
            <div class="w-[32%] px-3">Employee Name</div>
            <div class="w-[25%] px-3">Designation</div>
            <div class="w-[15%] px-3">Type</div>
            <div class="w-[15%] px-3">Status</div>
            <div class="w-[15%] px-3">Action</div>
          </div>

          <!-- Rows -->
          <div class="divide-y-2 divide-[#A2A1A81A]">
            <div
              v-for="member in paginatedMembers"
              :key="member.id"
              class="flex py-3 items-center hover:bg-[#7152F310] transition-colors text-base"
            >
              <!-- Employee ID -->
              <div class="w-[18%] px-3 font-light ">
                {{ member.id }}
              </div>
              <!-- Name + Avatar -->
              <div class="w-[32%] px-3 flex items-center space-x-4">
                <img
                  :src="member.avatar"
                  alt="Employee"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <p class="font-medium ">{{ member.name }}</p>
              </div>

              <!-- Designation -->
              <div class="w-[25%] px-3 font-light ">
                {{ member.title }}
              </div>

              <!-- Type -->
              <div class="w-[15%] px-3 font-light ">
                {{ member.type || 'Full Time' }}
              </div>

              <!-- Status -->
              <div class="w-[15%] px-3">
                <span
                  class="inline-flex items-center justify-center font-light text-sm px-2 py-2 rounded-lg"
                  :style="{ color: member.statusColor || '#7152F3', backgroundColor: (member.statusColor || '#7152F3') + '1A' }"
                >
                  {{ member.status || 'Active' }}
                </span>
              </div>

              <!-- Actions -->
              <div class="w-[15%] px-3 font-light  flex items-center space-x-2">
                <EyeIcon class="h-5 w-5  cursor-pointer" />
                <PencilIcon class="h-5 w-5  cursor-pointer" />
                <TrashIcon class="h-5 w-5  cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

       <!-- MOBILE CARDS — hidden on desktop -->
    <div class="md:hidden divide-y-2 divide-[#A2A1A81A] ">
      <div
        v-for="member in paginatedMembers"
        :key=" member.id"
        class="py-3 px-3 hover:bg-[#7152F310] transition-colors"
      >
        <!-- Top row: date + status badge -->
        <div class="flex items-center justify-between mb-2">
          
            <p class="font-light">{{ member.id }}</p>
           <span
                  class="inline-flex items-center justify-center font-light text-sm px-2 py-2 rounded-lg"
                  :style="{ color: member.statusColor || '#7152F3', backgroundColor: (member.statusColor || '#7152F3') + '1A' }"
                >
                  {{ member.status || 'Active' }}
                </span>
        </div>

        <!-- Info grid: 2x2 -->
        <div class="">
          <div class=" flex items-center  space-x-4">
                <img
                  :src="member.avatar"
                  alt="Employee"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                <p class="font-medium ">{{ member.name }}</p>
                <p class="text-sm">{{ member.title }}</p>
                </div>
              </div>

          
            
             <div class=" px-3 font-light  flex items-center justify-end space-x-2">
                <EyeIcon class="h-5 w-5  cursor-pointer" />
                <PencilIcon class="h-5 w-5  cursor-pointer" />
                <TrashIcon class="h-5 w-5  cursor-pointer" />
              </div>
          

          <div class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-[#A2A1A8] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              
              <p class="text-sm font-medium"> {{ member.type || 'Full Time' }}</p>
            </div>
          </div>

          
          </div>
        </div>
      </div>
        <!-- Pagination -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 px-2 py-4">
          <!-- Rows per page selector -->
          <div class="flex items-center space-x-2">
            <label class="text-xs sm:text-sm text-[#A2A1A8]">Showing</label>
            <select 
              v-model="perPage" 
              class="border rounded px-2 py-1 text-xs sm:text-sm "
              :class="{
                'bg-[#16151C] text-[#FFFFFF]': isDark,
                'bg-[#FFFFFF] text-[#16151C]': !isDark
              }"
              @change="currentPage = 1"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="15">15</option>
            </select>
          </div>

          <!-- Pagination controls -->
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">{{ showingRange }}</div>
            
            <button
              :disabled="currentPage === 1"
              @click="currentPage--"
              class="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeftIcon class="h-5 w-5" />
            </button>

            <div class="flex space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-3 py-1 rounded text-sm',
                  currentPage === page 
                  ? 'border border-[#7152F3] text-[#7152F3] font-semibold' : 'hover:bg-gray-100'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              :disabled="currentPage === totalPages || totalPages === 0"
              @click="currentPage++"
              class="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
        </RequestState>
      </div>
    </main>
    <EmployeeFilter :visible="taskModal" @close="toggleModal" />
  </div>
</template>
