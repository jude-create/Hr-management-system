<script setup>
import { useRouter } from 'vue-router'
import DashboardImg from '@/components/DashboardImg.vue'
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'
import { ref, nextTick } from 'vue'
import Cone from '@/assets/img/cone.png'
import useTheme from '@/config/useTheme'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const otp = ref(['', '', '', '', ''])
const inputRefs = ref([])
const hasError = ref(false)
const { isDark } = useTheme()
const auth = useAuthStore()
const modalVisible = ref(false)
const shakeKey = ref(0) // changes to retrigger animation


const handleInput = (index, event) => {
  const value = event.target.value
  hasError.value = false

  if (/^\d$/.test(value)) {
    otp.value[index] = value
    if (index < otp.value.length - 1) {
      nextTick(() => inputRefs.value[index + 1].focus())
    }
  } else {
    otp.value[index] = ''
  }
}

const handleKeydown = (index, event) => {
  if (event.key === 'Backspace' && otp.value[index] === '') {
    if (index > 0) {
      nextTick(() => inputRefs.value[index - 1].focus())
    }
  }
}

const getOtpCode = () => otp.value.join('')

const verifyOtp = async () => {
  const enteredOtp = getOtpCode()
  auth.error = ''

  if (enteredOtp.length !== otp.value.length) {
    hasError.value = true
    shakeKey.value++
    return
  }

  hasError.value = false

  try {
    await auth.verifyOtp(enteredOtp)
    modalVisible.value = true
  } catch (error) {
    hasError.value = true
    shakeKey.value++
  }
}


const closeModal = () => {
  modalVisible.value = false
  router.push('/login')
}
</script>


<template>
 <main class=" w-full min-h-screen justify-between md:p-10 lg:flex">
    
    <!-- Left: Image — hidden on mobile -->
    <div class="hidden lg:block lg:w-1/2">
      <DashboardImg />
    </div>

    <section class="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-10 py-6 md:py-10">
      <div class="flex items-center space-x-1 mb-6 cursor-pointer" @click="$router.push('/forgot-password')">
        <ChevronLeftIcon class="h-6 w-6" />
        <p>Back</p>
      </div>

      <div class="flex flex-col space-y-4">
        <h2 class="text-xl font-semibold">Enter OTP</h2>
        <p class="text-gray-500 text-sm font-light">
          We have shared a code with your registered email address.
        </p>

        <div class="flex space-x-4 mt-4" :key="shakeKey">
  <input
    v-for="(digit, index) in otp"
    :key="index"
    type="text"
    inputmode="numeric"
    maxlength="1"
    v-model="otp[index]"
    ref="inputRefs"
    @input="handleInput(index, $event)"
    @keydown="handleKeydown(index, $event)"
    :class="[
      'w-12 h-12 text-center rounded-lg text-xl border transition-all duration-200',
      hasError ? 'border-red-500 animate-bounce' : 'border-gray-300 focus:ring-2 focus:ring-[#7152F3]'
    ]"
  />
</div>



        <button
          class="mt-6 bg-[#7152F3] hover:bg-[#5b41cc] text-white px-6 py-4 rounded-lg font-medium disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="auth.loading"
          @click="verifyOtp"
        >
          {{ auth.loading ? 'Verifying...' : 'Verify' }}
        </button>
        <p v-if="auth.error" class="text-sm text-red-500">{{ auth.error }}</p>
      </div>
    </section>

    <!-- ✅ Success Modal -->
    <div
      v-if="modalVisible"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" 
    >
      <div 
       :class="{
      'bg-[#16151C] text-[#FFFFFF]': isDark,
      'bg-[#FFFFFF] text-[#16151C]': !isDark
    }"
      class="flex flex-col items-center justify-center rounded-xl shadow-xl  w-[350px] text-center space-y-4 h-96 p-5">
        <img :src="Cone" alt="Success" class="mx-auto w-16 h-16 mb-4" />
        <p class="font-semibold text-2xl  capitalize px-12">password  update successfully.</p>
        <p class="text-[#A7A19E] font-light ">Your password has been update successfully</p>
        <button
          @click="closeModal"
          class="mt-4  bg-[#7152F3] hover:bg-[#5b41cc] text-white px-6 py-2 rounded-lg w-full
           cursor-pointer transition-colors ease-in-out duration-150"
        >
          Back to Login
        </button>
      </div>
    </div>
  </main>
</template> 
