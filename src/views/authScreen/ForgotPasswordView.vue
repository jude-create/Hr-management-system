<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardImg from '@/components/DashboardImg.vue'
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'
import { useAuthStore } from '@/stores/authStore'

const email = ref('')
const emailError = ref('')
const router = useRouter()
const auth = useAuthStore()

const handleLogin = async () => {
  emailError.value = ''
  auth.error = ''

  if (!email.value) {
    emailError.value = 'Please input an email'
    return
  }

  if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email'
    return
  }

  try {
    await auth.forgotPassword(email.value)
    router.push('/forgot-password/enter-otp')
  } catch (error) {
    emailError.value = auth.error
  }
}
</script>

<template>
  <main class=" w-full min-h-screen justify-between md:p-10 lg:flex">
    
    <!-- Left: Image — hidden on mobile -->
    <div class="hidden lg:block lg:w-1/2">
      <DashboardImg />
    </div>
    <!-- Right: Forgot Password Form -->
    <section class="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-10 py-6 md:py-10">
      <!-- Back Button -->
      <div class="flex items-center space-x-1 mb-6 cursor-pointer" @click="$router.push('/login')">
        <ChevronLeftIcon class="h-6 w-6" />
        <p>Back</p>
      </div>

      <!-- Heading -->
      <div class="mb-6">
        <p class="text-xl font-semibold">Forgot Password</p>
        <p class="text-[#A09B98] text-base font-light">
          Enter your registered email address. We’ll send you a code to reset your password.
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="w-full space-y-6">
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
            class="absolute left-4 top-2 text-[#7152F3] text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-sm peer-focus:text-[#7152F3]"
          >
            Email Address
          </label>
          <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</p>
        </div>

        <button
          type="submit"
          :disabled="auth.loading"
          class="w-full bg-[#7152F3] hover:bg-[#5b41cc] text-white 
          py-3 rounded-lg font-medium mt-2  cursor-pointer 
      transition-colors ease-in-out duration-150 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {{ auth.loading ? 'Sending OTP...' : 'Send OTP' }}
        </button>
      </form>
    </section>
  </main>
</template>
