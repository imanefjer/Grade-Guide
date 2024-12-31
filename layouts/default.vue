<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center">
              <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Grade-Guide
              </span>
            </NuxtLink>
          </div>

          <div v-if="auth.isAuthenticated" class="hidden sm:flex sm:items-center sm:space-x-8">
            <NuxtLink 
              to="/subjects" 
              class="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Subjects
            </NuxtLink>
            <NuxtLink 
              to="/leaderboard" 
              class="flex items-center gap-2 text-yellow-600 hover:text-yellow-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Leaderboard
            </NuxtLink>
            <NuxtLink 
              to="/calendar" 
              class="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </NuxtLink>
            <NuxtLink 
              to="/zen" 
              class="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Zen Mode
            </NuxtLink>
          </div>

          <!-- Right side - User Menu -->
          <div class="flex items-center">
            <template v-if="auth.isAuthenticated">
              <div class="relative">
                <button 
                  @click="isMenuOpen = !isMenuOpen"
                  class="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <span>{{ auth.fullName || auth.userEmail }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
                <div 
                  v-show="isMenuOpen"
                  class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                >
                  <div class="py-1">
                    <NuxtLink
                      to="/profile"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      @click="isMenuOpen = false"
                    >
                      Profile
                    </NuxtLink>
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

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-100">
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
import { ref, onMounted } from 'vue'

const auth = useAuthStore()
const isMenuOpen = ref(false)

// Initialize auth store
onMounted(async () => {
  await auth.init()
})

// Add click outside handler to close menu
onMounted(() => {
  document.addEventListener('click', (e) => {
    const menu = document.querySelector('.relative')
    if (menu && !menu.contains(e.target)) {
      isMenuOpen.value = false
    }
  })
})

const handleLogout = async () => {
  try {
    await auth.logout()
    isMenuOpen.value = false
    await auth.navigateAfterLogout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>
