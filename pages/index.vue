<template>
  <div class="min-h-screen">
    <div class="relative bg-white ">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
            <div class="text-center">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block">Welcome to</span>
                <span class="block text-blue-600">StudyApp</span>
              </h1>
              <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                Your personal learning companion. Get help with any subject, anytime.
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center">
                <div class="rounded-md shadow">
                  <NuxtLink
                    to="/subjects"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors md:py-4 md:text-lg md:px-10"
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

    <div class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div class="relative bg-white p-6 rounded-xl">
              <h3 class="text-lg font-semibold text-gray-900">AI-Powered Tutoring</h3>
              <p class="mt-2 text-gray-500">
                Get instant help from our advanced AI tutors in any subject.
              </p>
            </div>
          </div>

          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div class="relative bg-white p-6 rounded-xl">
              <h3 class="text-lg font-semibold text-gray-900">24/7 Availability</h3>
              <p class="mt-2 text-gray-500">
                Study whenever you want, our platform is always available.
              </p>
            </div>
          </div>

          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div class="relative bg-white p-6 rounded-xl">
              <h3 class="text-lg font-semibold text-gray-900">Multiple Subjects</h3>
              <p class="mt-2 text-gray-500">
                From math to literature, we cover all major academic subjects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No setup needed for now
</script>
