import { defineStore } from 'pinia'
import { api } from '@/services/api'
import { createResourceActions, createResourceState } from './createResourceStore'

export const useNotificationsStore = defineStore('notifications', {
  state: createResourceState,
  actions: {
    ...createResourceActions('/notifications'),

    async updateStatus(id, status) {
      this.saving = true
      this.clearMessages()

      try {
        const response = await api.patch(`/notifications/${id}`, { status })
        this.success = response.message || 'Request updated successfully.'
        const index = this.items.findIndex((item) => item.id === id)
        if (index !== -1) this.items[index] = response
        return response
      } catch (error) {
        this.error = error.message || 'Unable to update request.'
        throw error
      } finally {
        this.saving = false
      }
    },
  },
})
