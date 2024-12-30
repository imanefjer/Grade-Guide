<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">
          <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI Tutor
          </span>
          <span class="text-gray-900"> - {{ subject }}</span>
        </h1>
        <NuxtLink 
          to="/subjects" 
          class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
