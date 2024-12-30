<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div class="space-y-1">
          <h1 class="text-4xl font-bold flex items-center gap-3">
            <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Tutor
            </span>
            <span class="text-gray-900">·</span>
            <span class="text-gray-900">{{ subject }}</span>
          </h1>
          <p class="text-gray-500">Get personalized help and explanations for any topic</p>
        </div>
        <NuxtLink 
          to="/subjects" 
          class="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-200 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back to Subjects
        </NuxtLink>
      </div>
      <TutorChatInterface />
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const subject = ref('')

// You can fetch subject details here using the ID
const subjectID = route.params.subjectID
// TODO: Replace with actual subject data fetch
subject.value = `Subject ${subjectID}`
</script>

<style scoped>
.tutor-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
