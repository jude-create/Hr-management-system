<script setup>
import { ref, watch } from 'vue'
import { CalendarDays } from 'lucide-vue-next'
import useTheme from '@/config/useTheme'
import FormError from '@/components/FormError.vue'
import LoadingButton from '@/components/LoadingButton.vue'

const props = defineProps({
  visible: Boolean,
  saving: Boolean,
  error: String,
  validationErrors: { type: Object, default: () => ({}) },
  holiday: { type: Object, default: null },
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  holiday: '',
  date: '',
})

const { isDark} = useTheme()

function setForm(holiday = null) {
  form.value = {
    holiday: holiday?.holiday || '',
    date: holiday?.date || '',
  }
}

function resetForm() {
  setForm()
}

function closeModal() {
  resetForm()
  emit('close')
}

function saveHoliday() {
  emit('save', { ...form.value, id: props.holiday?.id })
}

watch(
  () => props.holiday,
  (holiday) => setForm(holiday),
  { immediate: true },
)
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-100 flex items-center justify-center bg-[#A2A1A833] backdrop-blur-sm ">
    <div 
     :class="{
      'bg-[#16151C] text-[#FFFFFF]': isDark,
      'bg-[#FFFFFF] text-[#16151C]': !isDark
    }"
    class=" w-full max-w-sm rounded-xl shadow-xl p-6 relative"
    >

      <h2 class="text-lg font-semibold  mb-4">{{ holiday ? 'Edit Holiday' : 'Add New Holiday' }}</h2>
      <div class="space-y-4">
        <!-- Inputs -->
        
        <div>
          <input v-model="form.holiday" type="text" placeholder="Holiday Name" class="w-full border border-[#A2A1A833] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <FormError :message="validationErrors.holiday" />
        </div>

        <div class="relative">
          <input v-model="form.date" type="date" class="w-full border border-[#A2A1A833] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
           <CalendarDays class="absolute right-3 top-3 h-7 w-7" />
          <FormError :message="validationErrors.date" />
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
       
        <div class="flex items-center space-x-4 mt-2">
          <LoadingButton variant="secondary" :disabled="saving" class="mt-4 w-full" @click="closeModal">
            Cancel
          </LoadingButton>

          <LoadingButton :loading="saving" class="mt-4 w-full" @click="saveHoliday">
            {{ holiday ? 'Update' : 'Add' }}
          </LoadingButton>
        </div>
       
      </div>
    </div>
  </div>
</template>
