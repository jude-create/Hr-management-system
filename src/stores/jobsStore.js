import { defineStore } from 'pinia'
import { api } from '@/services/api'
import { createResourceActions, createResourceState } from './createResourceStore'

export const useJobsStore = defineStore('jobs', {
  state: createResourceState,
  actions: {
    ...createResourceActions('/jobs'),

    async updateStatus(id, status) {
      this.saving = true
      this.clearMessages()

      try {
        const response = await api.patch(`/jobs/${id}`, { status })
        this.success = response.message || 'Job status updated successfully.'
        const index = this.items.findIndex((job) => job.id === id)
        if (index !== -1) this.items[index] = response
        return response
      } catch (error) {
        this.error = error.message || 'Unable to update job status.'
        throw error
      } finally {
        this.saving = false
      }
    },
  },
})
