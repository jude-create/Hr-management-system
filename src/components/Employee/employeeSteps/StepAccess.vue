<script setup>
const model = defineModel({ default: () => ({}) })
</script>


<template>
  <div class="grid grid-cols-2 gap-4">
    

    <!-- Inputs -->
    <input type="email" placeholder="Enter Email Address" v-model="model.email" class="input" />
    <input type="text" placeholder="Enter Slack ID" v-model="model.slackId" class="input" />
    <input type="text" placeholder="Enter Skype ID" v-model="model.skypeId" class="input" />
    <input type="text" placeholder="Enter Github ID" v-model="model.githubId" class="input" />
    
    </div>
</template>
