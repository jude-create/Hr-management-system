import { defineStore } from 'pinia'
import { api } from '@/services/api'
import { createResourceActions, createResourceState } from './createResourceStore'

export const useAttendanceStore = defineStore('attendance', {
  state: createResourceState,
  actions: {
    ...createResourceActions('/attendance'),

    async requestCorrection(id, reason) {
      this.saving = true
      this.clearMessages()

      try {
        const response = await api.post(`/attendance/${id}/correction`, { reason })
        this.success = response.message || 'Attendance correction request sent.'
        const index = this.items.findIndex((record) => record.id === id)
        if (index !== -1) this.items[index] = response
        return response
      } catch (error) {
        this.error = error.message || 'Unable to request attendance correction.'
        throw error
      } finally {
        this.saving = false
      }
    },
  },
})
