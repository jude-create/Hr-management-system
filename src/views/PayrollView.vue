<script setup>
import Header from '@/components/Header.vue';
import Navbar from '@/components/Navbar.vue';
import Payroll from '@/components/Payroll.vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import { CircleArrowOutUpLeft } from 'lucide-vue-next';
import { usePayrollStore } from '@/stores/payrollStore';
import { ref } from 'vue';
import AppToast from '@/components/AppToast.vue';

const payrollStore = usePayrollStore()
const period = ref('July 2026')
const periods = ['July 2026', 'August 2026', 'September 2026']

function exportPayroll() {
  payrollStore.exportPayroll({ period: period.value }).catch(() => {})
}

function generatePayroll() {
  payrollStore.generatePayroll({ period: period.value }).catch(() => {})
}
</script>

<template>
   <div class="flex min-h-screen ">
    <!-- Sidebar -->
   

    <!-- Main content -->
    <main class="flex-1">
    

      <div class=" border border-[#A2A1A833] rounded-lg px-3 pt-5 mt-4 shadow-sm mx-3 mb-9">
      <!-- Search -->

    <div class="flex flex-wrap justify-between gap-3">
         <div class=" relative md:block hidden ">
        <MagnifyingGlassIcon class="h-6 w-6  absolute ml-2 mt-2" />
       <input
       type="text"
        placeholder="Search..."
       class="pl-10 pr-2 px-2 py-2 w-80 bg-transparent placeholder:text-[#8A8D91] text-base border border-gray-300 rounded-lg 
         focus:outline-none focus:border-[#7152F3] focus:ring-2 focus:ring-[#7152F3] transition duration-200"
      />
    </div>

     <div class="flex flex-wrap items-center gap-3">
      <select
        v-model="period"
        class="rounded-lg border border-gray-300 bg-transparent px-3 py-3 text-sm focus:border-[#7152F3] focus:outline-none focus:ring-2 focus:ring-[#7152F3]"
      >
        <option v-for="item in periods" :key="item" :value="item">{{ item }}</option>
      </select>

      <button
        :disabled="payrollStore.saving"
        v-on:click="generatePayroll"
        class="rounded-lg border border-[#7152F3] px-4 py-3 text-sm text-[#7152F3] hover:bg-[#7152F310] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {{ payrollStore.saving ? 'Generating...' : 'Generate Payroll' }}
      </button>

     <button
     :disabled="payrollStore.saving"
     v-on:click="exportPayroll"
     class="flex space-x-3 border border-[#7152F3] bg-[#7152F3]
     text-[#FFFFFF] rounded-lg p-3 font-light shadow-sm cursor-pointer hover:bg-[#5b41cc]
      transition-colors ease-in-out duration-200 disabled:cursor-not-allowed disabled:opacity-70">
        <CircleArrowOutUpLeft class="rotate-45 " />

        <div>
          {{ payrollStore.saving ? 'Exporting...' : 'Export' }}
       </div>
    </button>
     </div>
     
    </div>
     
    <div class="mt-8 mb-5">
      <Payroll :period="period" />
    </div>
      
      </div>
    </main>
    <AppToast
      :message="payrollStore.success || payrollStore.error"
      :type="payrollStore.error ? 'error' : 'success'"
      @close="payrollStore.clearMessages()"
    />
    </div>
</template>
