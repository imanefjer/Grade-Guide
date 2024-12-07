<template>
  <div class="tutor-container">
    <h1 class="text-2xl font-bold mb-6">AI Tutor - {{ subject }}</h1>
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
