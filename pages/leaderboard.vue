<template>
  <div class="leaderboard-page">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-12">Student Leaderboard</h1>
      
      <!-- Loading State -->
      <div v-if="store.isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p class="mt-2 text-gray-600">Loading leaderboard data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="store.error" 
           class="text-center py-12 text-red-600 bg-red-50 rounded-xl">
        <IconError class="w-8 h-8 mx-auto mb-2" />
        {{ store.error }}
      </div>

      <!-- Content -->
      <template v-else>
        <div class="stats-summary">
          <div class="stat-card">
            <IconUsers class="w-8 h-8 mx-auto text-blue-500" />
            <h3 class="text-gray-600 mt-2">Total Students</h3>
            <p class="stat-value">{{ totalStudents }}</p>
          </div>
          <div class="stat-card">
            <IconLevel class="w-8 h-8 mx-auto text-blue-500" />
            <h3 class="text-gray-600 mt-2">Class Average</h3>
            <p class="stat-value">{{ classAverage }}%</p>
          </div>
          <div class="stat-card">
            <IconQuiz class="w-8 h-8 mx-auto text-blue-500" />
            <h3 class="text-gray-600 mt-2">Total Quizzes</h3>
            <p class="stat-value">{{ totalQuizzesTaken }}</p>
          </div>
        </div>
        <LeaderboardTable />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useLeaderboardStore } from '@/stores/leaderboardStore'

const store = useLeaderboardStore()

const totalStudents = computed(() => store.users.length)
const classAverage = computed(() => store.classAverage)
const totalQuizzesTaken = computed(() => 
  store.users.reduce((total, user) => total + user.numQuizzesTaken, 0)
)

onMounted(async () => {
  await store.fetchLeaderboardData()
})
</script>

<style scoped>
.leaderboard-page {
  @apply min-h-screen bg-gray-50;
}

.stats-summary {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6 mb-12;
}

.stat-card {
  @apply bg-white p-6 rounded-xl shadow-md text-center transform 
         transition-all duration-300 hover:shadow-lg hover:-translate-y-1;
}

.stat-value {
  @apply text-3xl font-bold text-blue-600 mt-2;
}
</style> 