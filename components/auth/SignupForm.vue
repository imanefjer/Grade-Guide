<template>
  <form @submit.prevent="handleSubmit" class="mt-8 space-y-8">
    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <!-- First Name -->
        <div class="space-y-2">
          <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
          <input
            id="firstName"
            v-model="firstName"
            type="text"
            required
            class="block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="John"
          />
        </div>

        <!-- Last Name -->
        <div class="space-y-2">
          <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            id="lastName"
            v-model="lastName"
            type="text"
            required
            class="block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Doe"
          />
        </div>
      </div>

      <!-- Email -->
      <div class="space-y-2">
        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <!-- Password -->
      <div class="space-y-2">
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="••••••••"
        />
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="formError" class="rounded-xl bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ formError }}</p>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="flex items-center gap-2">
          {{ loading ? 'Creating account...' : 'Sign Up' }}
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      </button>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-gray-50 text-gray-500">Or continue with</span>
        </div>
      </div>

      <GoogleSignInButton class="w-full" />
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { useRouter } from 'vue-router'
import GoogleSignInButton from './GoogleSignInButton.vue'

const auth = useAuthStore()
const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const formError = ref('')

const handleSubmit = async () => {
  try {
    loading.value = true
    formError.value = ''
    
    await auth.signup({
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value
    })

    if (!auth.error) {
      await router.push('/dashboard')
    } else {
      formError.value = auth.error
    }
  } catch (error) {
    console.error('Signup error:', error)
    formError.value = auth.error || 'Unable to create account. Please try again.'
  } finally {
    loading.value = false
  }
}
</script> 