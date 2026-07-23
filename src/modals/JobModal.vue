<script setup>
import { ref, watch } from 'vue'
import useTheme from '@/config/useTheme'
import FormError from '@/components/FormError.vue'
import LoadingButton from '@/components/LoadingButton.vue'

const props = defineProps({
  visible: Boolean,
  saving: Boolean,
  error: String,
  validationErrors: { type: Object, default: () => ({}) },
  job: { type: Object, default: null },
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  department: '',
  title: '',
  location: '',
  salary: '',
  roles: [],
})

const { isDark} = useTheme()

function setForm(job = null) {
  form.value = {
    department: job?.department || job?.description || '',
    title: job?.title || '',
    location: job?.location || '',
    salary: job?.salary || '',
    roles: [...(job?.roles || [])],
  }
}

function resetForm() {
  setForm()
}

function saveJob() {
  emit('save', { ...form.value, roles: [...form.value.roles], id: props.job?.id })
}

function closeModal() {
  resetForm()
  emit('close')
}

watch(
  () => props.job,
  (job) => setForm(job),
  { immediate: true },
)
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-100 flex items-center justify-center bg-[#A2A1A833] backdrop-blur-sm">
    <div 
     :class="{
      'bg-[#16151C] text-[#FFFFFF]': isDark,
      'bg-[#FFFFFF] text-[#16151C]': !isDark
    }"
    class=" w-full max-w-sm rounded-xl shadow-xl p-6 relative"
    >

      <h2 class="text-lg font-semibold  mb-4">{{ job ? 'Edit Job' : 'Add New Job' }}</h2>
      <div class="space-y-4">
        <!-- Inputs -->
        <div class="relative">
          <input v-model="form.department" type="text" placeholder="Department" class="w-full border border-[#A2A1A833] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <FormError :message="validationErrors.department" />
        </div>

        <div>
          <input v-model="form.title" type="text" placeholder="Job Title" class="w-full border border-[#A2A1A833] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <FormError :message="validationErrors.title" />
        </div>

        <div class="relative">
          <input v-model="form.location" type="text" placeholder="Location" class="w-full border border-[#A2A1A833] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <FormError :message="validationErrors.location" />
        </div>

        <div>
          <input v-model="form.salary" type="text" placeholder="Salary" class="w-full border border-[#A2A1A833] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <FormError :message="validationErrors.salary" />
        </div>

        <!-- Checkbox Group -->
        <div>
          <p>Select Type</p>
          <div class="flex items-center space-x-4 mt-2">
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                value="Office"
                v-model="form.roles"
                class="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2">Office</span>
            </label>

            <label class="inline-flex items-center">
              <input
                type="checkbox"
                value="Work from Home"
                v-model="form.roles"
                class="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2">Work from Home</span>
            </label>
          </div>
        </div>
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
       
        <div class="flex items-center space-x-4 mt-2">
          <LoadingButton variant="secondary" :disabled="saving" class="mt-4 w-full" @click="closeModal">
            Cancel
          </LoadingButton>

          <LoadingButton :loading="saving" class="mt-4 w-full" @click="saveJob">
            {{ job ? 'Update Job' : 'Save Job' }}
          </LoadingButton>
        </div>
       
      </div>
    </div>
  </div>
</template>
