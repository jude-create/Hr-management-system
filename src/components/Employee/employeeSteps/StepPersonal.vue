<script setup>
import CustomSelect from '@/components/CustomSelect.vue'
import { CameraIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'

const model = defineModel({ default: () => ({}) })

// Image upload state
const photo = ref(null)       // Will hold the preview URL
const fileInput = ref(null)   // Hidden file input reference
const uploadProgress = ref(0)
const uploadingPhoto = ref(false)

const photoPreview = computed(() => photo.value || model.value.photo)

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    photo.value = URL.createObjectURL(file)
    model.value.photo = photo.value
    model.value.photoFileName = file.name
    uploadingPhoto.value = true
    uploadProgress.value = 15

    const timer = window.setInterval(() => {
      uploadProgress.value = Math.min(uploadProgress.value + 25, 100)
      if (uploadProgress.value === 100) {
        uploadingPhoto.value = false
        window.clearInterval(timer)
      }
    }, 160)
  }
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <!-- Upload Photo -->
    <div class="col-span-2 flex items-center space-x-4 mb-3">
      <div
        class="w-20 h-20 flex items-center justify-center border border-[#A2A1A80D] bg-[#A2A1A80D] rounded-lg shadow-sm overflow-hidden cursor-pointer"
        @click="fileInput.click()"
      >
        <img
          v-if="photoPreview"
          :src="photoPreview"
          alt="Profile Preview"
          class="w-full h-full object-cover"
        />
        <CameraIcon v-else class="text-gray-400" />
      </div>
      <div class="min-w-0">
        <p class="text-gray-500 text-sm cursor-pointer" @click="fileInput.click()">Upload Photo</p>
        <p v-if="model.photoFileName" class="mt-1 max-w-48 truncate text-xs text-[#7152F3]">
          {{ model.photoFileName }}
        </p>
        <div v-if="uploadingPhoto || uploadProgress === 100" class="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-[#A2A1A833]">
          <div class="h-full rounded-full bg-[#7152F3] transition-all" :style="{ width: `${uploadProgress}%` }" />
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        ref="fileInput"
        class="hidden"
        @change="handleImageUpload"
      />
    </div>

    <!-- Inputs -->
    <input type="text" placeholder="First Name" v-model="model.firstName" class="input" />
    <input type="text" placeholder="Last Name" v-model="model.lastName" class="input" />
    <input type="text" placeholder="Mobile Number" v-model="model.mobile" class="input" />
    <input type="email" placeholder="Email Address" v-model="model.email" class="input" />
    <input type="date" v-model="model.dob" class="input text-[#8A8D91]" />

    <!-- Custom dropdowns -->
    <CustomSelect v-model="model.maritalStatus" placeholder="Marital Status" :options="['Single', 'Married']" />
    <CustomSelect v-model="model.gender" placeholder="Gender" :options="['Male', 'Female']" />
    <CustomSelect v-model="model.nationality" placeholder="Nationality" :options="['Nigerian']" />

    <!-- Address -->
    <textarea placeholder="Address" v-model="model.address" class="input col-span-2"></textarea>

    <!-- City, State, ZIP in one line -->
    <div class="col-span-2 flex space-x-4">
      <CustomSelect v-model="model.city" placeholder="City" :options="['Lagos', 'Abuja', 'Port Harcourt']" class="flex-1" />
      <CustomSelect v-model="model.state" placeholder="State" :options="['Lagos State', 'FCT', 'Rivers State']" class="flex-1" />
      <input type="text" placeholder="ZIP Code" v-model="model.zip" class="input flex-1" />
    </div>
  </div>
</template>



