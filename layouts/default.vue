<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center">
              <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                StudyApp
              </span>
            </NuxtLink>
          </div>

          <div class="hidden sm:flex sm:items-center sm:space-x-8">
            <NuxtLink 
              to="/subjects" 
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Subjects
            </NuxtLink>
          </div>

          <div class="flex items-center">
            <button class="inline-flex items-center px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              Account
            </button>
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
</script>
