import { defineStore } from 'pinia'
import { api } from '@/services/api'
import { createResourceActions, createResourceState } from './createResourceStore'

export const useDepartmentsStore = defineStore('departments', {
  state: () => ({
    ...createResourceState(),
  }),

  actions: {
    ...createResourceActions('/departments'),

    async fetchDepartments() {
      this.loading = true
      this.error = ''

      try {
        const response = await api.get('/departments')
        this.items = response.data || []
        this.meta = response.meta || this.meta
        return response
      } catch (error) {
        this.error = error.message || 'Unable to load departments.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchDepartment(slug) {
      this.loading = true
      this.error = ''

      try {
        this.selected = await api.get(`/departments/${slug}`)
        return this.selected
      } catch (error) {
        this.error = error.message || 'Unable to load department.'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
