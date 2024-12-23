<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
      <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        AI Tutor
      </span>
      <span class="text-gray-900"> - {{ subject }}</span>
    </h1>
    <TutorChatInterface />
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
