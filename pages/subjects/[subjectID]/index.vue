<!-- pages/subjects/[subjectId]/index.vue -->
<template>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        
        <!-- Subject Header -->
        <div class="bg-white shadow rounded-lg mb-6 p-6">
            <div class="flex flex-col items-center mb-6">
              <h1 class="text-3xl font-bold text-gray-900">{{ subject?.name }}</h1>
              <p class="mt-2 text-gray-600">{{ subject?.description }}</p>
            </div>

            <div class="flex justify-center gap-4">
              <NuxtLink
                :to="`/subjects/${subjectId}/quiz`"
                class="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-500 text-white font-medium shadow-md hover:bg-indigo-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Take Quiz
              </NuxtLink>

              <NuxtLink
                :to="`/subjects/${subjectId}/tutor`"
                class="inline-flex items-center px-6 py-3 rounded-lg bg-teal-500 text-white font-medium shadow-md hover:bg-teal-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Ask Tutor
              </NuxtLink>

              <NuxtLink
                to="/zen"
                class="inline-flex items-center px-6 py-3 rounded-lg bg-purple-500 text-white font-medium shadow-md hover:bg-purple-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Zen Mode
              </NuxtLink>
            </div>
        </div>
  
        <!-- Progress Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Stats Cards -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Progress Overview</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-600">Quizzes Taken</p>
                <p class="text-2xl font-bold">{{ progress?.numQuizzesTaken || 0 }}</p>
              </div>
              <div class="p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-600">Total Time</p>
                <p class="text-2xl font-bold">{{ formatTime(progress?.totalTimeSpentOnQuizzes) }}</p>
              </div>
            </div>
          </div>
  
          <!-- Achievements -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Achievements</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="achievement in progress?.achievementsEarned"
                :key="achievement"
                class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
              >
                {{ achievement }}
              </span>
            </div>
          </div>
        </div>
  
        <!-- Progress Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Analysis -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Learning Analysis</h2>
            <div class="space-y-4">
              <div>
                <h3 class="font-medium text-gray-700">Strengths</h3>
                <p class="mt-1 text-gray-600">{{ progress?.strengths || 'No strengths recorded yet' }}</p>
              </div>
              <div>
                <h3 class="font-medium text-gray-700">Areas for Improvement</h3>
                <p class="mt-1 text-gray-600">{{ progress?.improvements || 'No improvements recorded yet' }}</p>
              </div>
              <div>
                <h3 class="font-medium text-gray-700">Focus Areas</h3>
                <p class="mt-1 text-gray-600">{{ progress?.focusAreas || 'No focus areas recorded yet' }}</p>
              </div>
            </div>
          </div>
  
          <!-- Level History Chart -->
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Level Progress</h2>
            <LineChart
              v-if="progress?.levelHistory?.length"
              :data="progress.levelHistory"
              class="h-64"
            />
            <p v-else class="text-center text-gray-500 py-8">No level history available</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { doc, getDoc, collection } from 'firebase/firestore'
  
  const route = useRoute()
  const subjectId = route.params.subjectID
  const { $firestore } = useNuxtApp()
  
  const subject = ref(null)
  const progress = ref(null)
  const showNav = ref(false)
  
  const formatTime = (seconds) => {
    if (!seconds) return '0h 0m'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }
  
  onMounted(async () => {
    try {
      // Fetch subject data
      const subjectDoc = await getDoc(doc($firestore, 'subjects', subjectId))
      if (subjectDoc.exists()) {
        subject.value = { id: subjectDoc.id, ...subjectDoc.data() }
      }
  
      // Fetch progress data
      const progressDoc = await getDoc(doc($firestore, 'progress', subjectId))
      if (progressDoc.exists()) {
        progress.value = progressDoc.data()
      }
    } catch (error) {
      console.error('Error fetching subject data:', error)
    }
  })
  </script>