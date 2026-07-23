<script setup>
import { useSidebarStore } from '@/stores/sidebarStore'
import Navbar from '@/components/Navbar.vue'
import Header from '@/components/Header.vue'
import { ref, provide, computed } from 'vue'
import { useRoute } from 'vue-router'

const sidebar = useSidebarStore()

const route = useRoute()

const isAuthPage = computed(() => {
  return route.path.startsWith('/login')
    || route.path.startsWith('/auth')
    || route.path.startsWith('/forgot-password')
})


const headerDepartment = ref(null)
provide('setHeaderDepartment', (dep) => { headerDepartment.value = dep })
</script>

<template>
 <div class="flex min-h-screen w-full">

  <!-- Sidebar -->
  <aside
    v-if="!isAuthPage"
    :class="[
      'flex-shrink-0 transition-all duration-300',
      'w-0 md:block',
      sidebar.isCollapsed ? 'md:w-20' : 'md:w-64'
    ]"
  >
    <Navbar />
  </aside>

  <!-- Main -->
  <main class="flex-1 min-w-0 w-full">
    <Header v-if="!isAuthPage" :department="headerDepartment" />
    <router-view />
  </main>

</div>
</template>
