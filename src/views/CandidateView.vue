<script setup>
import Candidate from '@/components/Candidate.vue';
import Header from '@/components/Header.vue';
import Navbar from '@/components/Navbar.vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import { ref } from 'vue';

const search = ref('')
</script>

<template>
   <div class="flex min-h-screen ">
   

    <!-- Main content -->
    <main class="flex-1  ">
    

      <div class=" border border-[#A2A1A833] rounded-lg px-3 pt-5 mt-4 shadow-sm mx-3 mb-9">
      <!-- Search -->
     <div class=" relative hidden md:block">
        <MagnifyingGlassIcon class="h-6 w-6 absolute ml-2 mt-2" />
       <input
       v-model="search"
       type="text"
        placeholder="Search..."
       class="pl-10 pr-2 px-2 py-2 w-80 bg-transparent placeholder:text-[#8A8D91] text-base border border-gray-300 rounded-lg 
         focus:outline-none focus:border-[#7152F3] focus:ring-2 focus:ring-[#7152F3] transition duration-200"
      />
    </div>
     
    <div class="md:mt-8 mb-5">
      <Candidate :search="search" />
    </div>
      
      </div>
    </main>
    </div>
</template>
