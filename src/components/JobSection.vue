<script setup>
import { defineProps, defineEmits } from 'vue'
import { BriefcaseBusiness, MapPin, Pencil, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  tasks: Array,
  title: String,
  color: String,
  sectionKey: String
})

defineEmits(['edit', 'delete', 'status'])
</script>

<template>
  <div class="w-full lg:w-1/3 flex flex-col gap-2 border border-[#A2A1A833] px-3 py-5 rounded-lg my-3">
    
    <!-- Section header -->
    <div class="flex items-center gap-2 mb-2">
      <div class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: color }" />
      <p class="font-semibold">{{ title }}</p>
      <span class="ml-auto text-xs text-[#A2A1A8] font-light">{{ tasks.length }} jobs</span>
    </div>

    <!-- Cards -->
    <div class="space-y-4 min-h-[100px]">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="bg-[#A2A1A80D] p-3 rounded-lg hover:shadow-md transition-all"
      >
        <!-- Title row -->
        <div class="flex items-start space-x-3">
          <div class="bg-[#A2A1A81A] p-2.5 rounded-lg flex-shrink-0">
            <BriefcaseBusiness class="h-5 w-5 text-gray-500" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-sm leading-snug">{{ task.title }}</p>
            <p class="text-xs font-light text-[#A2A1A8] mt-0.5">{{ task.description }}</p>
          </div>
          <div class="flex items-center gap-1">
            <button class="rounded p-1 hover:bg-[#7152F310]" title="Edit job" @click="$emit('edit', task)">
              <Pencil class="h-4 w-4 text-[#7152F3]" />
            </button>
            <button class="rounded p-1 hover:bg-red-50" title="Delete job" @click="$emit('delete', task)">
              <Trash2 class="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>

        <!-- Role badges -->
        <div class="flex flex-wrap gap-1.5 mt-3">
          <span
            v-for="(role, index) in task.roles"
            :key="index"
            class="bg-[#7152F3] px-2 py-0.5 text-white rounded-lg text-xs font-light"
          >
            {{ role }}
          </span>
        </div>

        <!-- Location + salary -->
        <div class="flex items-center justify-between mt-4 text-sm">
          <div class="flex items-center gap-1 text-[#A2A1A8] min-w-0">
            <MapPin class="h-4 w-4 flex-shrink-0" />
            <span class="font-light text-xs truncate">{{ task.location }}</span>
          </div>
          <div class="flex items-baseline gap-0.5 flex-shrink-0 ml-2">
            <span class="font-semibold text-sm">{{ task.salary }}</span>
            <span class="text-xs text-[#A2A1A8]">/mo</span>
          </div>
        </div>
        <div class="mt-3 flex justify-end gap-2">
          <button
            v-if="task.status !== 'active'"
            class="rounded-lg border border-[#7152F3] px-3 py-1.5 text-xs text-[#7152F3] hover:bg-[#7152F310]"
            @click="$emit('status', { job: task, status: 'active' })"
          >
            Publish
          </button>
          <button
            v-if="task.status === 'active'"
            class="rounded-lg border border-[#D89E07] px-3 py-1.5 text-xs text-[#D89E07] hover:bg-[#D89E071A]"
            @click="$emit('status', { job: task, status: 'inactive' })"
          >
            Unpublish
          </button>
          <button
            v-if="task.status !== 'completed'"
            class="rounded-lg border border-[#03A12F] px-3 py-1.5 text-xs text-[#03A12F] hover:bg-[#03A12F1A]"
            @click="$emit('status', { job: task, status: 'completed' })"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
