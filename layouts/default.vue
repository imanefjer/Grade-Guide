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

          <!-- Right side - User Menu (placeholder) -->
          <div class="flex items-center">
            <button class="text-gray-600 hover:text-gray-900">
              <!-- You can add a user menu or profile link here -->
              Account
            </button>
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
</script>
