<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your account
          </NuxtLink>
        </p>
      </div>
      <SignupForm />
    </div>
  </div>
</template>

<script setup>
import SignupForm from '~/components/auth/SignupForm.vue'
</script> 