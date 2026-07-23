<script setup>
import Header from '@/components/Header.vue';
import Navbar from '@/components/Navbar.vue';
import { ref, computed, onMounted } from 'vue';
import name from '@/assets/img/name.png'
import user from '@/assets/img/user.png'
import Image2 from '@/assets/img/image2.png'
import lock from '@/assets/img/lock.png'
import useTheme from '@/config/useTheme'
import RequestState from '@/components/RequestState.vue'
import AppToast from '@/components/AppToast.vue'
import { useNotificationsStore } from '@/stores/notificationsStore'



const {  isDark } = useTheme()
const notificationsStore = useNotificationsStore()

// Sort option
const sortOption = ref('newest');

const iconMap = {
  leave: name,
  attendance: user,
  candidate: Image2,
  default: lock,
}

// Sorted notifications
const sortedNotifications = computed(() => {
  const notificationsToSort = [...notificationsStore.items];
  
  switch (sortOption.value) {
    case 'newest':
      return notificationsToSort.sort((a, b) => b.timestamp - a.timestamp);
    case 'oldest':
      return notificationsToSort.sort((a, b) => a.timestamp - b.timestamp);
    default:
      return notificationsToSort;
  }
});

function fetchNotifications() {
  notificationsStore.fetchAll().catch(() => {})
}

function updateRequest(notification, status) {
  notificationsStore.updateStatus(notification.id, status).catch(() => {})
}

onMounted(fetchNotifications)

</script>

<template>
  <div class="flex min-h-screen">
   

    <!-- Main content -->
    <main class="flex-1">
      

      <div class="border border-[#A2A1A833] rounded-lg px-3 pt-5 mt-4 shadow-sm mx-3 mb-9">
        <!-- Notification Controls -->
        <div class="flex flex-row items-center justify-between gap-4 py-4 border-b border-[#A2A1A81A]">
          <div class="flex items-center space-x-4">
            <h2 class="text-lg font-semibold">Notifications</h2>
           
          </div>
          
          <div class="flex flex-col md:flex-row gap-3">

            
            
           
            
            <!-- Sort Dropdown -->
            <div class="relative">
              <select 
                v-model="sortOption"
                class="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7152F3]"
                  :class="{
                  'bg-[#16151C] text-[#FFFFFF]': isDark,
                 'bg-[#FFFFFF] text-[#16151C]': !isDark
                  }"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>

              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <!-- Mark All as Read -->
            <!-- <button
              @click="markAllAsRead"
              class="px-3 py-2 text-sm text-[#7152F3] hover:bg-[#7152F310] rounded-md transition-colors"
            >
              Mark all as read
            </button> -->
          </div>
        </div>

        <!-- Notifications List -->
        <RequestState
          :loading="notificationsStore.loading"
          :error="notificationsStore.error && !notificationsStore.saving ? notificationsStore.error : ''"
          :empty="sortedNotifications.length === 0"
          empty-text="No notifications found."
          @retry="fetchNotifications"
        >
        <div class="divide-y-2 divide-[#A2A1A81A]">
          <!-- Empty State -->
          <div 
            v-if="false"
            class="py-12 text-center text-gray-500"
          >
            No notifications found
          </div>
          
          <!-- Notification Item -->
          <div 
            v-for="notification in sortedNotifications" 
            :key="notification.id"
            class="flex items-center justify-between py-4 cursor-pointer hover:bg-[#7152F310] transition-colors"
          >
            <div class="flex space-x-3">
              <div>
                <img 
                  :src="iconMap[notification.actionType] || iconMap.default" 
                  :alt="notification.title" 
                  class="w-12 h-12 rounded-full" 
                />
              </div>
              <div>
                <h2 class="font-semibold text-sm md:text-base">
                  {{ notification.title }}
                  <span v-if="!notification.read" class="ml-2 inline-block w-2 h-2 rounded-full bg-[#7152F3]"></span>
                </h2>
                <p class="font-light text-sm md:text-base text-[#A2A1A8]">{{ notification.description }}</p>
                <div v-if="notification.status" class="mt-2 flex items-center gap-2">
                  <span class="rounded-lg bg-[#7152F31A] px-2 py-1 text-xs text-[#7152F3]">{{ notification.status }}</span>
                  <template v-if="notification.status === 'Pending'">
                    <button class="rounded-lg border border-[#03A12F] px-3 py-1 text-xs text-[#03A12F]" @click="updateRequest(notification, 'Approved')">Approve</button>
                    <button class="rounded-lg border border-red-500 px-3 py-1 text-xs text-red-500" @click="updateRequest(notification, 'Rejected')">Reject</button>
                  </template>
                </div>
              </div>
            </div>

            <div class="flex flex-col items-end">
              <p class="font-light text-xs md:text-sm text-[#A2A1A8]">{{ notification.time }}</p>
            </div>
          </div>
        </div>
        </RequestState>
        <AppToast
          :message="notificationsStore.success || notificationsStore.error"
          :type="notificationsStore.error ? 'error' : 'success'"
          @close="notificationsStore.clearMessages()"
        />
      </div>
    </main>
  </div>
</template>
