<script setup>
import { ref } from 'vue'
import logo from '@/assets/img/logo.png'
import DashboardImg from '@/components/DashboardImg.vue'
import { RouterLink, useRouter } from 'vue-router'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)

// Validation state
const emailError = ref('')
const passwordError = ref('')

const handleLogin = async () => {
  emailError.value = ''
  passwordError.value = ''
  auth.error = ''

  let isValid = true

  if (!email.value) {
    emailError.value = 'Please input an email'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email'
    isValid = false
  }

  if (!password.value) {
    passwordError.value = 'Please input a password'
    isValid = false
  }

  if (!isValid) return

  try {
    await auth.login({
      email: email.value,
      password: password.value,
      remember: remember.value,
    })
    router.push('/')
  } catch (error) {
    passwordError.value = auth.error
  }
}
</script>



<template>
  <main class=" w-full min-h-screen justify-between md:p-10 lg:flex">
    
    <!-- Left: Image — hidden on mobile -->
    <div class="hidden lg:block lg:w-1/2">
      <DashboardImg />
    </div>

    <!-- Right: Login Form — full width on mobile, half on desktop -->
    <section class="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-10 py-6 md:py-10">
      <!-- Logo -->
      <div class="flex items-center space-x-2 mb-6">
        <img class="h-12 w-auto" :src="logo" alt="logo" />
        <h1 class="font-bold text-xl">HRMS</h1>
      </div>

      <!-- Greeting -->
      <div class="mb-6">
        <p class="text-xl font-semibold">Welcome 👋</p>
        <p class="text-[#A09B98] text-base font-light">Please login here</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="w-full space-y-6 max-w-md">
        <!-- Email Input -->
        <div class="relative">
          <input
            v-model="email"
            type="email"
            id="email"
            class="peer w-full px-4 pt-5 pb-2 border rounded-lg focus:outline-none focus:ring-2 placeholder-transparent"
            :class="emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#7152F3]'"
            placeholder="Email"
          />
          <label
            for="email"
            class="absolute left-4 top-2 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500"
            :class="emailError ? 'text-red-500' : 'text-[#7152F3] peer-focus:text-[#7152F3]'"
          >
            Email Address
          </label>
          <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</p>
        </div>

        <!-- Password Input -->
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            id="password"
            class="peer w-full px-4 pt-5 pb-2 border rounded-lg focus:outline-none focus:ring-2 placeholder-transparent"
            :class="passwordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#7152F3]'"
            placeholder="Password"
          />
          <label
            for="password"
            class="absolute left-4 top-2 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500"
            :class="passwordError ? 'text-red-500' : 'text-[#7152F3] peer-focus:text-[#7152F3]'"
          >
            Password
          </label>
          <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-3">
            <component :is="showPassword ? EyeIcon : EyeSlashIcon" class="h-6 w-6 text-gray-500 mt-1" />
          </button>
          <p v-if="passwordError" class="text-red-500 text-xs mt-1">{{ passwordError }}</p>
        </div>

        <!-- Remember & Forgot -->
        <div class="flex justify-between items-center text-sm">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" v-model="remember" class="form-checkbox" />
            <span>Remember me</span>
          </label>
          <RouterLink to="/forgot-password" class="text-[#7152F3] hover:underline">Forgot password?</RouterLink>
        </div>

        <button
          type="submit"
          :disabled="auth.loading"
          class="w-full bg-[#7152F3] hover:bg-[#5b41cc] text-white py-3 rounded-lg font-medium
            cursor-pointer transition-colors ease-in-out duration-150 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {{ auth.loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </section>
  </main>
</template>
