<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import name from '@/assets/img/name.png'
import { BellIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import ProfileModal from '@/modals/ProfileModal.vue'
import useTheme from '@/config/useTheme'
import departments from '@/data/departments.js'
import { useSidebarStore } from '@/stores/sidebarStore'
import { useAuthStore } from '@/stores/authStore'
import { Menu } from 'lucide-vue-next'

const { isDark } = useTheme();

const route = useRoute();
const router = useRouter();
const profileModal = ref(false);
const sidebar = useSidebarStore();
const auth = useAuthStore();

const toggleModal = () => (profileModal.value = !profileModal.value);
const currentUserName = computed(() => auth.user?.name || 'HR Manager');
const currentUserRole = computed(() => auth.user?.role || 'HR Manager');

const props = defineProps({
  department: {
    type: Object,
    default: null
  }
});



const memberId = computed(() => route.params.id);

const member = computed(() => {
  return departments
    .flatMap(dep => dep.members)
    .find(m => m.id === memberId.value)
});



// Map of base routes to title/greeting
const routeMeta = {
  '/employees': {
    title: 'Employees',
    greeting: 'All Employees',
    linkText: 'All Employees',
    linkTo: '/employees'
  },
  '/departments': {
    title: 'All Departments',
    greeting: 'All Departments Information',
    linkText: 'All Departments',
    linkTo: '/departments'
  },
  '/attendance': {
    title: 'Attendance',
    greeting: 'All Employee Attendance'
  },
  '/holidays': {
    title: 'Holidays',
    greeting: 'Company Holidays'
  },
  '/candidates': {
    title: 'Candidates',
    greeting: 'All Candidate Records'
  },
  '/payroll': {
    title: 'Payroll',
    greeting: 'All Employee Records'
  },
  '/jobs': {
    title: 'Jobs',
    greeting: 'Show All Jobs'
  },
  '/notifications': {
    title: 'Notifications',
    greeting: 'All Notifications'
  },
  '/settings': {
    title: 'Settings',
    greeting: 'All System Settings'
  }
};

const basePath = computed(() => {
  const segments = route.path.split('/')
  return '/' + (segments[1] || '')
});

const title = computed(() => {
  // Department case
  if (route.path.startsWith('/departments/') && props.department) {
    return `${props.department.name} Department`
  };

  // Add-new-employee case
  if (route.path === '/employees/add-new-employee') {
    return 'Add New Employee'
  };

   // employee profile case
 if (route.name === 'employee-profile' && member.value) {
    return member.value.name
  };

  // Default mapping
  return routeMeta[basePath.value]?.title || `Hello ${currentUserName.value}`
});

const greeting = computed(() => {
  // Department breadcrumb
  if (route.path.startsWith('/departments/') && props.department) {
    return {
      clickablePart: routeMeta['/departments'].linkText,
      clickableTo: routeMeta['/departments'].linkTo,
      staticPart: ` >  ${props.department.name} Department`
    }
  };

  // Add-new-employee breadcrumb
  if (route.path === '/employees/add-new-employee') {
    return {
      clickablePart: routeMeta['/employees'].linkText,
      clickableTo: routeMeta['/employees'].linkTo,
      staticPart: ' >  Add New Employee'
    }
  };

   // employee-profile breadcrumb
  if (route.name === 'employee-profile' && member.value) {
    return {
      clickablePart: routeMeta['/employees'].linkText,
      clickableTo: routeMeta['/employees'].linkTo,
      staticPart: ` > ${member.value.name}`
    }
  };
  // Default text
  return routeMeta[basePath.value]?.greeting || 'Good Morning'
});

const navigateTo = (path) => {
  router.push(path)
};
</script>


<template>
  <section 
    class="sticky top-0 w-full z-40 flex items-center px-3 pt-4 pb-3"
    :class="{
      'bg-[#16151C] text-[#FFFFFF]': isDark,
      'bg-[#FFFFFF] text-[#16151C]': !isDark
    }"
  >
    <button
      class="md:hidden p-2 rounded-md hover:bg-gray-200 mr-2 flex-shrink-0"
      @click="sidebar.toggleSidebar"
    >
     <Menu class="h-7 w-7  transition-transform duration-200 group-hover:scale-110" /> 
    </button>

    <div class="font-semibold text-lg min-w-0">
      <h2 class="truncate">{{ title }}</h2>
      <h4 class="text-sm text-gray-500 font-light truncate">
        <template v-if="typeof greeting === 'object'">
          <span class="cursor-pointer hover:text-[#7152F3] transition-colors" @click="navigateTo(greeting.clickableTo)">
            {{ greeting.clickablePart }}
          </span>
          <span> {{ greeting.staticPart }}</span>
        </template>
        <template v-else>{{ greeting }}</template>
      </h4>
    </div>

    <div class="ml-auto flex items-center space-x-2 flex-shrink-0">
      <!-- Search — desktop only -->
      <div class="hidden lg:relative lg:flex items-center">
        <MagnifyingGlassIcon class="h-6 w-6 absolute ml-2 mt-2" />
        <input
          type="text"
          placeholder="Search..."
          class="pl-10 pr-2 py-2 w-60 border border-gray-300 rounded-lg bg-transparent focus:outline-none placeholder:text-[#8A8D91] text-base focus:border-[#7152F3] focus:ring-2 focus:ring-[#7152F3] transition duration-200"
        />
      </div>

      <!-- Notification -->
      <RouterLink to="/notifications" class="border border-gray-300 rounded-lg px-2 py-2 bg-[#A2A1A81A]">
        <BellIcon class="h-6 w-6 cursor-pointer" />
      </RouterLink>

      <!-- Profile — hide text on mobile, show avatar only -->
      <div
        @click="toggleModal()"
        class="flex items-center border border-gray-300 rounded-lg px-2 py-1 space-x-2 cursor-pointer"
      >
        <img :src="name" alt="Employee" class="w-8 h-8 rounded-full flex-shrink-0" />
        <!-- Hide name on mobile -->
        <div class="hidden md:block">
          <h3 class="text-base font-medium">{{ currentUserName }}</h3>
          <p class="text-xs text-gray-500 font-light">{{ currentUserRole }}</p>
        </div>
        <ChevronDownIcon class="h-4 w-4" />
      </div>
    </div>

    <ProfileModal 
    :visible="profileModal" 
    @close="toggleModal" />
  </section>

  <!-- Mobile search bar — full width, no side margins -->
   <div class="lg:hidden px-3    mt-3 flex items-center  space-x-1 ml-auto flex-shrink-0 relative ">
        <MagnifyingGlassIcon class="h-6 w-6  ml-2 mt-2 absolute" />
        <input 
          type="text"
          placeholder="Search..."
          class="pl-10 pr-2 px-2 py-2 w-full border border-gray-300 rounded-lg bg-neutral-200/10 focus:outline-none placeholder:text-[#8A8D91] text-base focus:border-[#7152F3] focus:ring-2 focus:ring-[#7152F3] transition duration-200"
        />
      </div>
</template>
