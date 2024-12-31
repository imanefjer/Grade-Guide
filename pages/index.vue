<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-br from-blue-50 to-indigo-50">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
            <div class="text-center">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block">Welcome to</span>
                <span class="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Grade-Guide
                </span>
              </h1>
              <p class="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                Your AI-powered learning companion
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center">
                <div class="rounded-md shadow">
                  <NuxtLink
                    to="/subjects"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </NuxtLink>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- AI Tutor Card -->
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div class="relative bg-white p-8 rounded-xl border border-blue-50 hover:border-blue-100 transition-all">
              <div class="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">AI Tutor</h3>
              <p class="text-gray-500">24/7 personalized learning support</p>
            </div>
          </div>

          <!-- Quiz Generator Card -->
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div class="relative bg-white p-8 rounded-xl border border-purple-50 hover:border-purple-100 transition-all">
              <div class="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Smart Quizzes</h3>
              <p class="text-gray-500">Adaptive tests that evolve with you</p>
            </div>
          </div>

          <!-- Progress Tracking Card -->
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div class="relative bg-white p-8 rounded-xl border border-green-50 hover:border-green-100 transition-all">
              <div class="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p class="text-gray-500">Visualize your learning journey</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="text-4xl font-bold text-blue-600">24/7</div>
            <div class="text-gray-500 mt-2">Availability</div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="text-4xl font-bold text-purple-600">100+</div>
            <div class="text-gray-500 mt-2">Subjects</div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="text-4xl font-bold text-green-600">1000+</div>
            <div class="text-gray-500 mt-2">Students</div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="text-4xl font-bold text-indigo-600">95%</div>
            <div class="text-gray-500 mt-2">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No setup needed for now
</script>
