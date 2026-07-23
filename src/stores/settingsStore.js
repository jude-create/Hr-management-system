import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: null,
    loading: false,
    saving: false,
    error: '',
    success: '',
    validationErrors: {},
  }),

  actions: {
    clearMessages() {
      this.error = ''
      this.success = ''
      this.validationErrors = {}
    },

    async fetchSettings() {
      this.loading = true
      this.clearMessages()

      try {
        this.settings = await api.get('/settings')
        return this.settings
      } catch (error) {
        this.error = error.message || 'Unable to load settings.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async saveSettings(payload) {
      this.saving = true
      this.clearMessages()

      try {
        const response = await api.put('/settings', payload)
        this.settings = response
        this.success = response.message || 'Settings saved successfully.'
        return response
      } catch (error) {
        this.error = error.message || 'Unable to save settings.'
        this.validationErrors = error.details || {}
        throw error
      } finally {
        this.saving = false
      }
    },
  },
})
