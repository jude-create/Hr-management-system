<script setup>
import DepartmentCard from '@/components/Department/DepartmentCard.vue'
import Header from '@/components/Header.vue'
import Navbar from '@/components/Navbar.vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { computed, onMounted, ref } from 'vue'
import RequestState from '@/components/RequestState.vue'
import { useDepartmentsStore } from '@/stores/departmentsStore'

const departmentsStore = useDepartmentsStore()
const search = ref('')

const filteredDepartments = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return departmentsStore.items

  return departmentsStore.items.filter((department) =>
    department.name.toLowerCase().includes(query)
      || department.members.some((member) => member.name.toLowerCase().includes(query)),
  )
})

function fetchDepartments() {
  departmentsStore.fetchDepartments().catch(() => {})
}

onMounted(fetchDepartments)
</script>

<template>
  <div class="flex min-h-screen">
   


    <main class="flex-1">
      

      <div class="border border-[#A2A1A833] rounded-lg px-3 pt-5 mt-4 shadow-sm mx-3 mb-9 ">
        <div class="relative hidden md:block">
          <MagnifyingGlassIcon class="h-6 w-6  absolute ml-2 mt-2" />
          <input
            v-model="search"
            type="text"
            placeholder="Search..."
            class="pl-10 pr-2 px-2 py-2 w-80 bg-transparent placeholder:text-[#8A8D91] text-base border border-gray-300 rounded-lg 
              focus:outline-none focus:border-[#7152F3] focus:ring-2 focus:ring-[#7152F3] transition duration-200"
          />
        </div>

        <RequestState
          :loading="departmentsStore.loading"
          :error="departmentsStore.error"
          :empty="filteredDepartments.length === 0"
          empty-text="No departments match your current search."
          @retry="fetchDepartments"
        >
        <div class="md:mt-7 mt-3 mb-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
          <DepartmentCard
            v-for="department in filteredDepartments"
            :key="department.slug"
            :department="department"
          />
        </div>
        </RequestState>
      </div>
    </main>
  </div>
</template>
