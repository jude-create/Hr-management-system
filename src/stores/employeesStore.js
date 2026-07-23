import { defineStore } from 'pinia'
import { api } from '@/services/api'
import { createResourceActions, createResourceState } from './createResourceStore'

export const useEmployeesStore = defineStore('employees', {
  state: () => ({
    ...createResourceState(),
  }),

  actions: {
    ...createResourceActions('/employees'),

    async fetchEmployees(params = {}) {
      this.loading = true
      this.error = ''

      try {
        const response = await api.get('/employees', params)
        this.items = response.data || []
        this.meta = response.meta || this.meta
        return response
      } catch (error) {
        this.error = error.message || 'Unable to load employees.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchEmployee(id) {
      this.loading = true
      this.error = ''

      try {
        this.selected = await api.get(`/employees/${id}`)
        return this.selected
      } catch (error) {
        this.error = error.message || 'Unable to load employee.'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
