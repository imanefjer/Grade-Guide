<template>
  <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
    <div>
      <label for="email-address" class="block text-sm font-medium text-gray-700">
        Email address
      </label>
      <div class="mt-1">
        <input
          id="email-address"
          name="email"
          type="email"
          required
          v-model="email"
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter your email"
        />
      </div>
    </div>

    <div v-if="error" class="text-red-500 text-sm text-center">
      {{ error }}
    </div>

    <div v-if="success" class="text-green-500 text-sm text-center">
      Password reset email sent! Please check your inbox.
    </div>

    <div class="space-y-4">
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {{ loading ? 'Sending...' : 'Send Reset Link' }}
      </button>

      <div class="text-sm text-center">
        <NuxtLink
          to="/auth/login"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Back to login
        </NuxtLink>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/authStore'

const auth = useAuthStore()
const email = ref('')
const error = ref('')
const loading = ref(false)
const success = ref(false)

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = false
    await auth.sendPasswordReset(email.value)
    success.value = true
    email.value = '' // Clear the form
  } catch (err) {
    error.value = auth.error || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script> 