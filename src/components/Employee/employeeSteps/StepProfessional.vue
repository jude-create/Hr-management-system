<script setup>
import CustomSelect from '@/components/CustomSelect.vue'

const model = defineModel({ default: () => ({}) })
</script>

<template>
  <div class="grid grid-cols-2 gap-4">

    <!-- Inputs -->
    <input type="text" placeholder="Employee ID" v-model="model.employeeId" class="input" />
    <input type="text" placeholder="Username" v-model="model.userName" class="input" />
     <CustomSelect v-model="model.employeeType" placeholder="Select Employee Type" :options="['Office', 'Remote', 'Full Time', 'Contract']" />
    <input type="email" placeholder="Email Address" v-model="model.email" class="input" />
   

    <!-- Custom dropdowns -->
    <CustomSelect v-model="model.department" placeholder="Select Department" :options="['Design', 'Development', 'Human Resource', 'Sales', 'Project Manager']" />
     <input type="text" placeholder="Enter Designation" v-model="model.designation" class="input" />
    <CustomSelect v-model="model.workingDays" placeholder="Select Working Days" :options="['Monday - Friday', 'Monday - Saturday', 'Flexible']"  />
     <input
  type="text"
  placeholder="Select Joining Date"
  class="input text-[#8A8D91]"
  onfocus="(this.type='date')"
  onblur="if(!this.value) this.type='text'"
  v-model="model.joiningDate"
/>

    

    <!-- Address -->
    <textarea placeholder="Select Office Location" v-model="model.officeLocation" class="input col-span-2  "></textarea>

  
  </div>
</template>



