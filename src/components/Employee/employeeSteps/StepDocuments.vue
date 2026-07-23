<script setup>
import { CircleArrowOutUpLeft, FileText } from 'lucide-vue-next'
import { ref } from 'vue'

const uploadedFiles = ref({})
const fileErrors = ref({})
const uploadProgress = ref({})
const model = defineModel({ default: () => ({}) })

const acceptedTypes = ['application/pdf', 'image/jpeg']

function setProgress(doc) {
  uploadProgress.value[doc] = 20

  const timer = window.setInterval(() => {
    uploadProgress.value[doc] = Math.min((uploadProgress.value[doc] || 0) + 20, 100)
    if (uploadProgress.value[doc] === 100) window.clearInterval(timer)
  }, 140)
}

const handleFileUpload = (file, doc) => {
  if (!file) return

  // Validate file type
  if (!acceptedTypes.includes(file.type)) {
    fileErrors.value[doc] = 'Only JPG and PDF files are allowed.'
    return
  }
  fileErrors.value[doc] = ''

  // Save file object with preview or direct link
  uploadedFiles.value[doc] = {
    file,
    preview: file.type === 'image/jpeg' ? URL.createObjectURL(file) : null,
    pdfUrl: file.type === 'application/pdf' ? URL.createObjectURL(file) : null,
    isPdf: file.type === 'application/pdf'
  }
  model.value[doc] = file.name
  setProgress(doc)
}

const handleDrop = (event, doc) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  handleFileUpload(file, doc)
}

const handleDragOver = (event) => {
  event.preventDefault()
}
</script>

<template>
  <div class="grid grid-cols-2 gap-6">
    <div
      v-for="doc in ['Appointment Letter', 'Salary Slips', 'Relieving Letter', 'Experience Letter']"
      :key="doc"
    >
      <h2 class="font-light text-base pb-3">Upload {{ doc }}</h2>

      <div
        class="border-2 border-dashed border-[#7152F3] rounded-lg p-6 flex flex-col items-center justify-center text-center  font-light relative"
        @drop="e => handleDrop(e, doc)"
        @dragover="handleDragOver"
      >
        <!-- Icon / Preview -->
        <div class="relative w-14 h-14 mb-4">
          <div class="bg-[#7152F3] p-2 rounded-xl text-white w-full h-full flex items-center justify-center">
            <!-- Default icon -->
            <CircleArrowOutUpLeft
              class="rotate-45"
              v-if="!uploadedFiles[doc]"
            />
            <!-- Image preview -->
            <img
              v-else-if="uploadedFiles[doc].preview"
              :src="uploadedFiles[doc].preview"
              alt="Preview"
              class="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
            <!-- PDF icon with click to open -->
            <a
              v-else-if="uploadedFiles[doc].isPdf"
              :href="uploadedFiles[doc].pdfUrl"
              target="_blank"
              rel="noopener noreferrer"
              title="View PDF"
            >
              <FileText class="w-8 h-8 cursor-pointer" />
            </a>
          </div>
        </div>

        <p class="mb-1">
          Drag & Drop or 
          <label class="text-purple-600 underline cursor-pointer">
            choose file
            <input
              type="file"
              accept=".jpg,.jpeg,.pdf"
              class="hidden"
              @change="e => handleFileUpload(e.target.files[0], doc)"
            />
          </label>
          to upload
        </p>

        <!-- File name -->
        <p v-if="uploadedFiles[doc]?.file" class="mt-2 text-sm text-green-600 truncate w-40">
          {{ uploadedFiles[doc].file.name }}
        </p>

        <div v-if="uploadProgress[doc]" class="mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-[#A2A1A833]">
          <div class="h-full rounded-full bg-[#7152F3] transition-all" :style="{ width: `${uploadProgress[doc]}%` }" />
        </div>

        <p class="text-xs">Supported formats: .jpg, .pdf</p>
        <p v-if="fileErrors[doc]" class="mt-2 text-xs text-red-500">{{ fileErrors[doc] }}</p>
      </div>
    </div>
  </div>
</template>
