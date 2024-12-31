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
            <span v-if="subject" class="text-gray-900">{{ subject.name }}</span>
            <span v-else class="text-gray-400">Loading...</span>
          </h1>
          <p class="text-gray-500">Get personalized help and explanations for any topic</p>
        </div>
        <div class="flex gap-4">
          <NuxtLink 
            :to="`/subjects/${route.params.subjectID}/quiz`"
            class="flex items-center gap-2 px-5 py-2.5 text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl shadow-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Take Quiz
          </NuxtLink>
          <NuxtLink 
            to="/zen"
            class="flex items-center gap-2 px-5 py-2.5 text-white bg-purple-500 hover:bg-purple-600 rounded-xl shadow-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            Zen Mode
          </NuxtLink>
          <NuxtLink 
            :to="`/subjects/${route.params.subjectID}`"
            class="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-200 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to Subject
          </NuxtLink>
        </div>
      </div>
      <TutorChatInterface :subject="subject" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { doc, getDoc } from 'firebase/firestore';

const route = useRoute();
const { $firestore } = useNuxtApp();

const subject = ref(null);

onMounted(async () => {
  try {
    const subjectDoc = await getDoc(doc($firestore, 'subjects', route.params.subjectID));
    if (subjectDoc.exists()) {
      subject.value = { id: subjectDoc.id, ...subjectDoc.data() };
    }
  } catch (error) {
    console.error('Error fetching subject:', error);
  }
});
</script>

<style scoped>
.tutor-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
