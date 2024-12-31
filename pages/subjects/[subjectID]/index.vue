<!-- pages/subjects/[subjectId]/index.vue -->
<template>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        
        <!-- Subject Header -->
        <div class="bg-white shadow rounded-lg mb-6 p-6 flex flex-col items-center">
            <h1 class="text-3xl font-bold text-gray-900">{{ subject?.name }}</h1>
            <p class="mt-2 text-gray-600">{{ subject?.description }}</p>
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
  
        <!-- Navigation Overlay -->
        <div
          class="fixed right-0 top-1/2 transform -translate-y-1/2 transition-transform duration-300"
          :class="{ 'translate-x-0': showNav, 'translate-x-[calc(100%-8px)]': !showNav }"
        >
          <!-- Toggle Button -->
          <button
            @click="showNav = !showNav"
            class="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 bg-blue-500 text-white p-2 rounded-l-lg shadow-lg"
          >
            <svg
              class="w-6 h-6 transform transition-transform"
              :class="{ 'rotate-180': showNav }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
  
          <!-- Navigation Menu -->
          <div class="bg-white shadow-lg rounded-l-lg p-4 space-y-3">
            <NuxtLink
              :to="`/subjects/${subjectId}/quiz`"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              Take Quiz
            </NuxtLink>
            <NuxtLink
              :to="`/subjects/${subjectId}/tutor`"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              Ask Tutor
            </NuxtLink>
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