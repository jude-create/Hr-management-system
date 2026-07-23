<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Header from '@/components/Header.vue'
import { BriefcaseBusiness, PencilLine } from 'lucide-vue-next'
import { EnvelopeIcon } from '@heroicons/vue/24/outline'
import useTheme from '@/config/useTheme'
import SideBar from '@/components/Employee/Employee-profile/SideBar.vue'
import RequestState from '@/components/RequestState.vue'
import { useEmployeesStore } from '@/stores/employeesStore'

const { isDark } = useTheme()
const route = useRoute()
const employeesStore = useEmployeesStore()
const memberId = route.params.id

const member = computed(() => employeesStore.selected)
const departmentName = computed(() => member.value?.departmentName || 'Unknown Department')

function fetchEmployee() {
  employeesStore.fetchEmployee(memberId).catch(() => {})
}

onMounted(fetchEmployee)
</script>

<template>
  <div class="flex min-h-screen overflow-hidden">
   
    <div class="flex-1 ">
     

      <div class="flex-1 md:overflow-y-auto px-3 mt-4 overflow-hidden">
        <div class="border border-[#A2A1A833] rounded-lg px-3 shadow-sm">
          <RequestState
            :loading="employeesStore.loading"
            :error="employeesStore.error"
            :empty="!member"
            empty-text="Employee profile was not found."
            @retry="fetchEmployee"
          >
          <!-- Employee header -->
          <div class="md:flex md:justify-between border-b-2 border-[#A2A1A833] pb-6   w-full pt-5"
            :class="{ 'bg-[#16151C] text-white': isDark, 
            'bg-white text-[#16151C]': !isDark }">
            <div class="flex items-center space-x-4">
              <img :src="member.avatar" class="w-24 h-24 rounded-md">
              <div class="space-y-2 font-light">
                <p class="font-semibold text-xl">{{ member.name }}</p>
                <div class="flex items-center space-x-2">
                  <BriefcaseBusiness class="w-6 h-6" />
                  <p>{{ member.title }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <EnvelopeIcon class="w-6 h-6" />
                  <p>{{ member.email || `${member.id.toLowerCase()}@example.com` }}</p>
                </div>
              </div>
            </div>
          
             <div class="flex mt-3 items-center justify-end">
            <RouterLink
            :to="{ name: 'employee-edit', params: { id: member.id } }"
              class="flex items-center space-x-2 border border-[#7152F3] bg-[#7152F3] text-white rounded-lg p-3 shadow-sm hover:bg-[#5b41cc] transition"
            >
              <PencilLine />
              <span>Edit Profile</span>
            </RouterLink>

            </div>
          </div>

          <!-- Profile content area -->
          <div class="md:flex  min-h-[400px] pt-3">
            <!-- Employee profile sidebar -->
             <div class="mb-4   "
    :class="{
      'bg-[#16151C] text-[#FFFFFF]': isDark,
      'bg-[#FFFFFF] text-[#16151C]': !isDark
    }"
    >
      <SideBar />
    </div>

            <!-- Dynamic content area -->
            <div class="flex-1 md:overflow-y-auto md:ml-3 mt-2 ">
              <RouterView :employee="member" :department="departmentName" />
            </div>
          </div>
          </RequestState>
        </div>
      </div>
    </div>
  </div>
</template>
