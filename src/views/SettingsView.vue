<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/vue/24/solid'
import useTheme from '@/config/useTheme'
import AppToast from '@/components/AppToast.vue'
import RequestState from '@/components/RequestState.vue'
import { useAuthStore } from '@/stores/authStore'
import { useSettingsStore } from '@/stores/settingsStore'

const { theme, isDark, setTheme } = useTheme()
const auth = useAuthStore()
const settingsStore = useSettingsStore()

const appearanceOptions = [
  { id: 'light', name: 'Light', icon: SunIcon },
  { id: 'dark', name: 'Dark', icon: MoonIcon },
  { id: 'system', name: 'System', icon: ComputerDesktopIcon },
]

const languageOptions = [
  { id: 'en', name: 'English' },
  { id: 'fr', name: 'French' },
  { id: 'es', name: 'Spanish' },
]

const roleOptions = ['Admin', 'HR Manager', 'Recruiter', 'Payroll']
const permissionLabels = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  departments: 'Departments',
  attendance: 'Attendance',
  payroll: 'Payroll',
  jobs: 'Jobs',
  candidates: 'Candidates',
  notifications: 'Leaves',
  holidays: 'Holidays',
  settings: 'Settings',
}

const form = ref({
  appearance: theme.value,
  language: 'en',
  twoFactor: true,
  mobilePush: true,
  desktopNotifications: true,
  emailNotifications: true,
  role: auth.user?.role || 'HR Manager',
  permissions: auth.user?.permissions || [],
})

const profile = ref({
  name: auth.user?.name || '',
  email: auth.user?.email || '',
  role: auth.user?.role || 'HR Manager',
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
})

const allMessages = computed(() => settingsStore.success || settingsStore.error || auth.message || auth.error)
const messageType = computed(() => settingsStore.error || auth.error ? 'error' : 'success')

function applySettings(settings) {
  if (!settings) return
  form.value = {
    ...form.value,
    ...settings,
  }
  profile.value.role = settings.role || profile.value.role
  setTheme(settings.appearance || 'system')
}

async function fetchSettings() {
  const settings = await settingsStore.fetchSettings().catch(() => null)
  applySettings(settings)
}

async function savePreferences() {
  const response = await settingsStore.saveSettings(form.value).catch(() => null)
  if (response) {
    applySettings(response)
    await auth.updateProfile({
      ...profile.value,
      role: response.role,
      permissions: response.permissions,
    }).catch(() => {})
  }
}

async function saveProfile() {
  await auth.updateProfile(profile.value).catch(() => {})
}

async function savePassword() {
  await auth.updatePassword(passwordForm.value).catch(() => {})
  if (!auth.error) {
    passwordForm.value = { currentPassword: '', newPassword: '' }
  }
}

function closeToast() {
  settingsStore.clearMessages()
  auth.error = ''
  auth.message = ''
}

watch(() => form.value.appearance, (value) => setTheme(value))
watch(() => form.value.role, (role) => {
  profile.value.role = role
})

onMounted(fetchSettings)
</script>

<template>
  <div class="flex min-h-screen">
    <main class="flex-1">
      <div class="border border-[#A2A1A833] rounded-lg px-3 pt-5 mt-4 shadow-sm mx-3 mb-9">
        <RequestState
          :loading="settingsStore.loading"
          :error="settingsStore.error && !settingsStore.saving ? settingsStore.error : ''"
          :empty="false"
          @retry="fetchSettings"
        >
          <div class="grid gap-6 lg:grid-cols-2">
            <section class="space-y-4">
              <div>
                <h2 class="text-base font-semibold">Preferences</h2>
                <p class="text-sm text-[#A2A1A8]">Saved through the settings API contract.</p>
              </div>

              <div class="grid gap-4 rounded-lg border border-[#A2A1A833] p-4">
                <label class="grid gap-2 text-sm">
                  Appearance
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="option in appearanceOptions"
                      :key="option.id"
                      class="flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm"
                      :class="form.appearance === option.id ? 'border-[#7152F3] bg-[#7152F310] text-[#7152F3]' : 'border-[#A2A1A833]'"
                      @click="form.appearance = option.id"
                    >
                      <component :is="option.icon" class="h-4 w-4" />
                      {{ option.name }}
                    </button>
                  </div>
                </label>

                <label class="grid gap-2 text-sm">
                  Language
                  <select v-model="form.language" class="rounded-lg border border-[#A2A1A833] bg-transparent px-3 py-2">
                    <option v-for="option in languageOptions" :key="option.id" :value="option.id">
                      {{ option.name }}
                    </option>
                  </select>
                </label>

                <div class="grid gap-3">
                  <label class="flex items-center justify-between gap-4 text-sm">
                    Two-factor Authentication
                    <input v-model="form.twoFactor" type="checkbox" class="h-5 w-5 accent-[#7152F3]" />
                  </label>
                  <label class="flex items-center justify-between gap-4 text-sm">
                    Mobile Push Notifications
                    <input v-model="form.mobilePush" type="checkbox" class="h-5 w-5 accent-[#7152F3]" />
                  </label>
                  <label class="flex items-center justify-between gap-4 text-sm">
                    Desktop Notifications
                    <input v-model="form.desktopNotifications" type="checkbox" class="h-5 w-5 accent-[#7152F3]" />
                  </label>
                  <label class="flex items-center justify-between gap-4 text-sm">
                    Email Notifications
                    <input v-model="form.emailNotifications" type="checkbox" class="h-5 w-5 accent-[#7152F3]" />
                  </label>
                </div>
              </div>
            </section>

            <section class="space-y-4">
              <div>
                <h2 class="text-base font-semibold">Profile & Security</h2>
                <p class="text-sm text-[#A2A1A8]">Updates the authenticated user contract.</p>
              </div>

              <div class="grid gap-4 rounded-lg border border-[#A2A1A833] p-4">
                <input v-model="profile.name" type="text" placeholder="Full name" class="rounded-lg border border-[#A2A1A833] bg-transparent px-3 py-2" />
                <input v-model="profile.email" type="email" placeholder="Email address" class="rounded-lg border border-[#A2A1A833] bg-transparent px-3 py-2" />
                <button
                  :disabled="auth.loading"
                  class="w-fit rounded-lg bg-[#7152F3] px-4 py-2 text-sm text-white disabled:opacity-70"
                  @click="saveProfile"
                >
                  {{ auth.loading ? 'Saving...' : 'Save Profile' }}
                </button>
              </div>

              <div class="grid gap-4 rounded-lg border border-[#A2A1A833] p-4">
                <input v-model="passwordForm.currentPassword" type="password" placeholder="Current password" class="rounded-lg border border-[#A2A1A833] bg-transparent px-3 py-2" />
                <input v-model="passwordForm.newPassword" type="password" placeholder="New password" class="rounded-lg border border-[#A2A1A833] bg-transparent px-3 py-2" />
                <button
                  :disabled="auth.loading"
                  class="w-fit rounded-lg border border-[#7152F3] px-4 py-2 text-sm text-[#7152F3] disabled:opacity-70"
                  @click="savePassword"
                >
                  {{ auth.loading ? 'Updating...' : 'Update Password' }}
                </button>
              </div>
            </section>
          </div>

          <section class="mt-6 space-y-4 rounded-lg border border-[#A2A1A833] p-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 class="text-base font-semibold">Roles & Permissions</h2>
                <p class="text-sm text-[#A2A1A8]">Controls which modules appear in the sidebar.</p>
              </div>
              <select v-model="form.role" class="rounded-lg border border-[#A2A1A833] bg-transparent px-3 py-2 text-sm">
                <option v-for="role in roleOptions" :key="role" :value="role">{{ role }}</option>
              </select>
            </div>

            <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              <label
                v-for="(label, permission) in permissionLabels"
                :key="permission"
                class="flex items-center gap-2 rounded-lg border border-[#A2A1A833] px-3 py-2 text-sm"
              >
                <input v-model="form.permissions" type="checkbox" :value="permission" class="h-4 w-4 accent-[#7152F3]" />
                {{ label }}
              </label>
            </div>
          </section>

          <div class="mt-6 flex justify-end">
            <button
              :disabled="settingsStore.saving"
              class="rounded-lg bg-[#7152F3] px-5 py-2.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-70"
              @click="savePreferences"
            >
              {{ settingsStore.saving ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </RequestState>
      </div>
    </main>

    <AppToast
      :message="allMessages"
      :type="messageType"
      @close="closeToast"
    />
  </div>
</template>
