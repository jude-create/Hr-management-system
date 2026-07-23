import { defineStore } from 'pinia'
import { api } from '@/services/api'
import { createResourceActions, createResourceState } from './createResourceStore'

export const useCandidatesStore = defineStore('candidates', {
  state: createResourceState,
  actions: {
    ...createResourceActions('/candidates'),

    async updateStatus(id, status) {
      this.saving = true
      this.clearMessages()

      try {
        const response = await api.patch(`/candidates/${id}`, { status })
        this.success = response.message || 'Candidate status updated successfully.'
        const index = this.items.findIndex((candidate) => candidate.id === id)
        if (index !== -1) this.items[index] = response
        return response
      } catch (error) {
        this.error = error.message || 'Unable to update candidate status.'
        throw error
      } finally {
        this.saving = false
      }
    },
  },
})
