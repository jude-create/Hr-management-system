import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken'),
    user: JSON.parse(localStorage.getItem('authUser') || 'null'),
    loading: false,
    error: '',
    message: '',
    validationErrors: {},
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },

  actions: {
    setSession({ token, user }) {
      this.token = token
      this.user = user
      localStorage.setItem('authToken', token)
      localStorage.setItem('authUser', JSON.stringify(user))
    },

    clearSession() {
      this.token = null
      this.user = null
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
    },

    async login(payload) {
      this.loading = true
      this.error = ''
      this.validationErrors = {}

      try {
        const session = await api.post('/auth/login', payload)
        this.setSession(session)
        return session
      } catch (error) {
        this.error = error.message || 'Unable to login right now.'
        this.validationErrors = error.details || {}
        throw error
      } finally {
        this.loading = false
      }
    },

    async forgotPassword(email) {
      this.loading = true
      this.error = ''
      this.message = ''
      this.validationErrors = {}

      try {
        const response = await api.post('/auth/forgot-password', { email })
        this.message = response.message
        return response
      } catch (error) {
        this.error = error.message || 'Unable to send OTP right now.'
        this.validationErrors = error.details || {}
        throw error
      } finally {
        this.loading = false
      }
    },

    async verifyOtp(code) {
      this.loading = true
      this.error = ''
      this.message = ''
      this.validationErrors = {}

      try {
        const response = await api.post('/auth/verify-otp', { code })
        this.message = response.message
        return response
      } catch (error) {
        this.error = error.message || 'Unable to verify OTP right now.'
        this.validationErrors = error.details || {}
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProfile(payload) {
      this.loading = true
      this.error = ''
      this.message = ''
      this.validationErrors = {}

      try {
        const response = await api.patch('/auth/profile', payload)
        this.user = response.user
        localStorage.setItem('authUser', JSON.stringify(response.user))
        this.message = response.message
        return response
      } catch (error) {
        this.error = error.message || 'Unable to update profile.'
        this.validationErrors = error.details || {}
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePassword(payload) {
      this.loading = true
      this.error = ''
      this.message = ''
      this.validationErrors = {}

      try {
        const response = await api.put('/auth/password', payload)
        this.message = response.message
        return response
      } catch (error) {
        this.error = error.message || 'Unable to update password.'
        this.validationErrors = error.details || {}
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.clearSession()
    },
  },
})
