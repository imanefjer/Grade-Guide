<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to StudyApp
          </h1>
          <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your personal learning companion. Get help with any subject, anytime.
          </p>
          <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div class="rounded-md shadow">
              <NuxtLink
                to="/subjects"
                class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature Section -->
    <div class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Feature 1 -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900">AI-Powered Tutoring</h3>
            <p class="mt-2 text-gray-500">
              Get instant help from our advanced AI tutors in any subject.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900">24/7 Availability</h3>
            <p class="mt-2 text-gray-500">
              Study whenever you want, our platform is always available.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900">Multiple Subjects</h3>
            <p class="mt-2 text-gray-500">
              From math to literature, we cover all major academic subjects.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No setup needed for now
</script>
