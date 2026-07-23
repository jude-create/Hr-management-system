<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebarStore'
import { useAuthStore } from '@/stores/authStore'
import logo from '@/assets/img/logo.png'
import useTheme from '@/config/useTheme'
import { LayoutGrid, CalendarCheck, BriefcaseBusiness,
   Users, ClipboardList, CalendarDays, Settings,
    Layers, SunMedium, Book } from 'lucide-vue-next'
import { 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  MoonIcon,
} from '@heroicons/vue/24/outline'
import { 
  Squares2X2Icon as LayoutGridSolid,
  BriefcaseIcon as BriefcaseBusinessSolid,
  UsersIcon as UsersSolid,
  ClipboardDocumentListIcon as ClipboardListSolid,
  CalendarDaysIcon as CalendarDaysSolid,
  Cog6ToothIcon as SettingsSolid,
  Square3Stack3DIcon as LayersSolid,
  UserGroupIcon as UserGroupIconSolid,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
} from '@heroicons/vue/24/solid'

const { isDark, toggleTheme } = useTheme()
const route = useRoute()
const sidebar = useSidebarStore()
const auth = useAuthStore()

const isLogoHovered = ref(false)
const MOBILE_BREAKPOINT = 768

const handleResize = () => sidebar.setMobile(window.innerWidth < MOBILE_BREAKPOINT)

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => window.removeEventListener('resize', handleResize))



const navItems = ref([
  { name: 'Dashboard', path: '/', permission: 'dashboard', icon: LayoutGrid, iconSolid: LayoutGridSolid },
  { name: 'All Employees', path: '/employees', permission: 'employees', icon: UserGroupIcon, iconSolid: UserGroupIconSolid },
  { name: 'All Departments', path: '/departments', permission: 'departments', icon: Layers, iconSolid: LayersSolid },
  { name: 'Attendance', path: '/attendance', permission: 'attendance', icon: CalendarCheck, iconSolid: CalendarCheck },
  { name: 'Payroll', path: '/payroll', permission: 'payroll', icon: CurrencyDollarIcon, iconSolid: CurrencyDollarIconSolid },
  { name: 'Jobs', path: '/jobs', permission: 'jobs', icon: BriefcaseBusiness, iconSolid: BriefcaseBusinessSolid },
  { name: 'Candidates', path: '/candidates', permission: 'candidates', icon: Users, iconSolid: UsersSolid },
  { name: 'Leaves', path: '/notifications', permission: 'notifications', icon: ClipboardList, iconSolid: ClipboardListSolid },
  { name: 'Holidays', path: '/holidays', permission: 'holidays', icon: CalendarDays, iconSolid: CalendarDaysSolid },
  { name: 'Settings', path: '/settings', permission: 'settings', icon: Settings, iconSolid: SettingsSolid }
])

const visibleNavItems = computed(() => {
  const permissions = auth.user?.permissions
  if (!permissions?.length) return navItems.value
  return navItems.value.filter((item) => permissions.includes(item.permission))
})

const isActive = (path) => route.path === path || route.path.startsWith(path + '/')
</script>

<template>
  <!-- Overlay (mobile only) -->
  <div
    v-if="sidebar.isMobile && sidebar.isOpen"
    @click="sidebar.closeMobileDrawer"
    class="h-full w-full fixed top-0 left-0 bg-gray-900/40 z-40"
  />

  <!-- Sidebar -->
  <aside
  :class="[
    'fixed top-0 left-0 md:h-screen  flex flex-col  m-0 pt-4 shadow-lg z-50 transition-all duration-300 ease-in-out',
    isDark ? 'bg-[#16151C] text-[#FFFFFF]' : 'bg-[#FFFFFF] text-[#16151C]',
    // Desktop
    !sidebar.isMobile && (sidebar.isCollapsed ? 'w-18 px-3' : 'w-64 px-5'),

    // Mobile — full slide drawer, no margin
    
    sidebar.isMobile && 'w-full px-5 h-[90%] ',
    sidebar.isMobile && (sidebar.isOpen ? 'translate-y-0' : '-translate-y-full')
  ]"
>
    <!-- Logo + Toggle -->
    <div class="flex items-center mb-4 h-12">

      <!-- COLLAPSED -->
      <div
  v-if="sidebar.isCollapsed && !sidebar.isMobile"
  class="relative w-10 h-10 cursor-pointer mx-auto group"
  @mouseenter="isLogoHovered = true"
  @mouseleave="isLogoHovered = false"
  @click="sidebar.toggleSidebar"
>
  <img
    :class="[
      'absolute inset-0 h-10 w-10 object-contain transition-opacity duration-200',
      isLogoHovered ? 'opacity-0' : 'opacity-100'
    ]"
    :src="logo"
    alt="logo"
  />

  <div
    :class="[
      'absolute inset-0 flex items-center justify-center rounded-md hover:bg-gray-200 transition-opacity duration-200',
      isLogoHovered ? 'opacity-100' : 'opacity-0'
    ]"
  >
    <Book class="h-5 w-5 text-[#7152F3] rotate-90 transition-transform duration-200 group-hover:scale-110" />
  </div>
</div>

      <!-- EXPANDED -->
      <template v-else>
        <div class="flex items-center space-x-2">
          <img class="h-10 w-auto" :src="logo" alt="logo" />
          <h1 class="font-bold text-xl">HRMS</h1>
        </div>
        <button @click="sidebar.toggleSidebar" class="hidden md:block ml-auto p-2 rounded-md hover:bg-gray-200 ">
          <Book class="size-5 text-[#7152F3] rotate-90" />
        </button>
      </template>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto pr-1">
      <ul class="lg:space-y-1 space-y-2">
        <li v-for="item in visibleNavItems" :key="item.name">
          <router-link
            :to="item.path"
            :title="sidebar.isCollapsed && !sidebar.isMobile ? item.name : ''"
            @click="() => { if (sidebar.isMobile) sidebar.closeMobileDrawer() }"
            class="flex items-center w-full p-2 rounded-lg transition-colors"
            :class="[
              !sidebar.isMobile && sidebar.isCollapsed ? 'justify-center' : '',
              isActive(item.path)
                ? 'bg-[#F5F3FF] text-[#7152F3] font-semibold border-l-4 border-[#7152F3]'
                : 'hover:bg-[#7152F310] font-light'
            ]"
          >
            <component
              :is="isActive(item.path) ? item.iconSolid : item.icon"
              :class="['size-5', (!sidebar.isCollapsed || sidebar.isMobile) ? 'mr-4' : '', isActive(item.path) ? 'text-[#7152F3]' : '']"
            />
            <h2 v-if="!sidebar.isCollapsed || sidebar.isMobile" class="text-base">
              {{ item.name }}
            </h2>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Theme Toggle -->
    <div class="flex-shrink-0 pb-11 sticky bottom-0">
      <!-- COLLAPSED: stacked icon buttons -->
      <div v-if="sidebar.isCollapsed && !sidebar.isMobile" class="flex flex-col items-center gap-1">
        <button @click="toggleTheme" :class="!isDark ? 'bg-[#7152F3] text-white' : 'hover:bg-gray-100'" class="flex items-center justify-center w-10 h-10 rounded-lg transition-colors" title="Light">
          <SunMedium class="size-5" />
        </button>
        <button @click="toggleTheme" :class="isDark ? 'bg-[#7152F3] text-white' : 'hover:bg-gray-100'" class="flex items-center justify-center w-10 h-10 rounded-lg transition-colors" title="Dark">
          <MoonIcon class="size-5" />
        </button>
      </div>

      <!-- EXPANDED: pill toggle -->
      <div v-else class="flex items-center border rounded-lg w-fit mx-auto shadow-md overflow-hidden">
        <button @click="toggleTheme" :class="{ 'bg-[#7152F3] text-white': !isDark, 'hover:bg-gray-100': isDark }" class="flex items-center justify-center px-4 py-2 font-light space-x-1 text-sm transition-colors">
          <SunMedium class="size-5" /><span>Light</span>
        </button>
        <button @click="toggleTheme" :class="{ 'bg-[#7152F3] text-white': isDark, 'hover:bg-gray-100': !isDark }" class="flex items-center justify-center px-4 py-2 font-light space-x-1 text-sm transition-colors">
          <MoonIcon class="size-5" /><span>Dark</span>
        </button>
      </div>
    </div>
  </aside>
</template>
