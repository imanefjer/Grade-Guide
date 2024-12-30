<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left side - Logo/Home -->
          <div class="flex">
            <NuxtLink to="/" class="flex items-center">
              <span class="text-xl font-bold text-gray-800">StudyApp</span>
            </NuxtLink>
          </div>

          <!-- Center - Navigation Links -->
          <div class="hidden sm:flex sm:items-center space-x-8">
            <NuxtLink 
              to="/subjects" 
              class="text-gray-600 hover:text-gray-900"
            >
              Subjects
            </NuxtLink>
            <NuxtLink 
              to="/leaderboard" 
              class="text-gray-600 hover:text-gray-900"
            >
              Leaderboard
            </NuxtLink> 
            <NuxtLink 
              to="/dashboard" 
              class="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </NuxtLink>
            <!-- Add more navigation links as needed -->
          </div>

          <!-- Right side - User Menu -->
          <div class="flex items-center">
            <template v-if="auth.isAuthenticated">
              <div class="relative group">
                <button class="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <span>{{ auth.userEmail }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
                <div class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                  <div class="py-1">
                    <button
                      @click="handleLogout"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <NuxtLink
                to="/auth/login"
                class="text-gray-600 hover:text-gray-900"
              >
                Sign in
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-500 text-sm">
          © {{ new Date().getFullYear() }} StudyApp. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/authStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    await auth.logout()
    router.push('/auth/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>
