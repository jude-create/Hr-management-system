import { defineStore } from 'pinia'
import { api } from '@/services/api'
import { createResourceActions, createResourceState } from './createResourceStore'

export const usePayrollStore = defineStore('payroll', {
  state: createResourceState,
  actions: {
    ...createResourceActions('/payroll'),

    async exportPayroll(params = {}) {
      this.saving = true
      this.clearMessages()

      try {
        const response = await api.post('/payroll/export', params)
        this.success = response.message || 'Payroll export is ready.'
        return response
      } catch (error) {
        this.error = error.message || 'Unable to export payroll.'
        throw error
      } finally {
        this.saving = false
      }
    },

    async generatePayroll(params = {}) {
      this.saving = true
      this.clearMessages()

      try {
        const response = await api.post('/payroll/generate', params)
        this.success = response.message || 'Payroll generated successfully.'
        return response
      } catch (error) {
        this.error = error.message || 'Unable to generate payroll.'
        throw error
      } finally {
        this.saving = false
      }
    },
  },
})
