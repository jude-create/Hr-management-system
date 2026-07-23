<script setup>
import { computed, onMounted, ref } from 'vue'

import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/solid'
import Header from '@/components/Header.vue'
import Navbar from '@/components/Navbar.vue'
import JobSection from '@/components/JobSection.vue'
import JobModal from '@/modals/JobModal.vue'
import { CirclePlus } from 'lucide-vue-next'
import RequestState from '@/components/RequestState.vue'
import AppToast from '@/components/AppToast.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useJobsStore } from '@/stores/jobsStore'

const taskModal = ref(false)
const jobsStore = useJobsStore()
const editingJob = ref(null)
const jobToDelete = ref(null)
function toggleModal() {
  taskModal.value = !taskModal.value
}

const tasks = computed(() => {
  const grouped = { active: [], inactive: [], completed: [] }
  jobsStore.items.forEach((job) => grouped[job.status || 'active']?.push(job))
  return grouped
})

function fetchJobs() {
  jobsStore.fetchAll().catch(() => {})
}

async function saveJob(payload) {
  const request = payload.id
    ? jobsStore.update(payload.id, payload)
    : jobsStore.create(payload)

  await request.catch(() => {})
  if (!jobsStore.error) {
    taskModal.value = false
    editingJob.value = null
    fetchJobs()
  }
}

function openEditJob(job) {
  editingJob.value = job
  taskModal.value = true
}

async function deleteJob() {
  if (!jobToDelete.value) return

  await jobsStore.remove(jobToDelete.value.id).catch(() => {})
  if (!jobsStore.error) {
    jobToDelete.value = null
    fetchJobs()
  }
}

function closeJobModal() {
  taskModal.value = false
  editingJob.value = null
}

async function updateJobStatus({ job, status }) {
  await jobsStore.updateStatus(job.id, status).catch(() => {})
  if (!jobsStore.error) fetchJobs()
}

onMounted(fetchJobs)
</script>

<template>
  <div class="flex min-h-screen">
    <main class="flex-1 min-w-0">
      <div class="border border-[#A2A1A833] rounded-lg px-3 pt-5 mt-4 shadow-sm mx-3 mb-9">

        <!-- Toolbar -->
        <div class="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center mb-1">
          <div class="relative w-full sm:w-80 hidden md:block">
            <MagnifyingGlassIcon class="h-5 w-5 absolute left-2 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              class="pl-9 pr-2 py-2.5 w-full bg-transparent placeholder:text-[#8A8D91] text-base border border-gray-300 rounded-lg
                focus:outline-none focus:border-[#7152F3] focus:ring-2 focus:ring-[#7152F3] transition duration-200"
            />
          </div>
          <button
            @click="toggleModal"
            class="flex items-center justify-center space-x-2 border border-[#7152F3] bg-[#7152F3]
              text-white rounded-lg px-4 py-2.5 font-light shadow-sm cursor-pointer hover:bg-[#5b41cc]
              transition-colors ease-in-out duration-200 w-full sm:w-auto"
          >
            <CirclePlus class="h-5 w-5" />
            <span>Add New Job</span>
          </button>
        </div>

        <!-- Job columns — stack on mobile, side by side on desktop -->
        <RequestState
          :loading="jobsStore.loading"
          :error="jobsStore.error && !jobsStore.saving ? jobsStore.error : ''"
          :empty="jobsStore.items.length === 0"
          empty-text="No jobs have been created yet."
          @retry="fetchJobs"
        >
        <div class="flex flex-col lg:flex-row lg:space-x-4 w-full mt-3">
          <JobSection 
          title="Active Jobs" 
          :tasks="tasks.active" 
          color="#FF304F" 
          section-key="active" 
          @open-modal="toggleModal"
          @edit="openEditJob"
          @delete="jobToDelete = $event"
          @status="updateJobStatus" />

          <JobSection 
          title="Inactive Jobs" 
          :tasks="tasks.inactive" 
          color="#D89E07" 
          section-key="inactive" 
          @open-modal="toggleModal"
          @edit="openEditJob"
          @delete="jobToDelete = $event"
          @status="updateJobStatus" />

          <JobSection 
          title="Completed Jobs" 
          :tasks="tasks.completed" 
          color="#03A12F" 
          section-key="completed" 
          @open-modal="toggleModal"
          @edit="openEditJob"
          @delete="jobToDelete = $event"
          @status="updateJobStatus" />
        </div>
        </RequestState>

        <JobModal
          :visible="taskModal"
          :saving="jobsStore.saving"
          :error="jobsStore.error"
          :validation-errors="jobsStore.validationErrors"
          :job="editingJob"
          @close="closeJobModal"
          @save="saveJob"
        />
        <ConfirmDialog
          :visible="Boolean(jobToDelete)"
          title="Delete Job"
          :message="`Delete ${jobToDelete?.title || 'this job'}? This will be sent to the backend.`"
          confirm-text="Delete"
          :loading="jobsStore.saving"
          @cancel="jobToDelete = null"
          @confirm="deleteJob"
        />
        <AppToast
          :message="jobsStore.success || jobsStore.error"
          :type="jobsStore.error ? 'error' : 'success'"
          @close="jobsStore.clearMessages()"
        />
      </div>
    </main>
  </div>
</template>
