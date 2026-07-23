import { api } from '@/services/api'

export function createResourceState() {
  return {
    items: [],
    selected: null,
    meta: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
    loading: false,
    saving: false,
    error: '',
    success: '',
    validationErrors: {},
  }
}

export function createResourceActions(endpoint) {
  return {
    clearMessages() {
      this.error = ''
      this.success = ''
      this.validationErrors = {}
    },

    async fetchAll(params = {}) {
      this.loading = true
      this.clearMessages()

      try {
        const response = await api.get(endpoint, params)
        this.items = response.data || []
        this.meta = response.meta || this.meta
        return response
      } catch (error) {
        this.error = error.message || 'Unable to load records.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchOne(id) {
      this.loading = true
      this.clearMessages()

      try {
        this.selected = await api.get(`${endpoint}/${id}`)
        return this.selected
      } catch (error) {
        this.error = error.message || 'Unable to load record.'
        throw error
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      this.saving = true
      this.clearMessages()

      try {
        const response = await api.post(endpoint, payload)
        this.success = response.message || 'Record saved successfully.'
        return response
      } catch (error) {
        this.error = error.message || 'Unable to save record.'
        this.validationErrors = error.details || {}
        throw error
      } finally {
        this.saving = false
      }
    },

    async update(id, payload) {
      this.saving = true
      this.clearMessages()

      try {
        const response = await api.put(`${endpoint}/${id}`, payload)
        this.success = response.message || 'Record updated successfully.'
        return response
      } catch (error) {
        this.error = error.message || 'Unable to update record.'
        this.validationErrors = error.details || {}
        throw error
      } finally {
        this.saving = false
      }
    },

    async remove(id) {
      this.saving = true
      this.clearMessages()

      try {
        const response = await api.delete(`${endpoint}/${id}`)
        this.success = response.message || 'Record deleted successfully.'
        return response
      } catch (error) {
        this.error = error.message || 'Unable to delete record.'
        throw error
      } finally {
        this.saving = false
      }
    },
  }
}
