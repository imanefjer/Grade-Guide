<template>
  <div class="leaderboard-page">
    <h1 class="text-2xl font-bold text-center my-6">Student Leaderboard</h1>
    <div class="stats-summary">
      <div class="stat-card">
        <h3>Total Students</h3>
        <p class="stat-value">{{ totalStudents }}</p>
      </div>
      <div class="stat-card">
        <h3>Average Score</h3>
        <p class="stat-value">{{ averageScore }}</p>
      </div>
      <div class="stat-card">
        <h3>Active Badges</h3>
        <p class="stat-value">{{ totalBadges }}</p>
      </div>
    </div>
    <LeaderboardTable />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLeaderboardStore } from '@/stores/leaderboardStore'

const store = useLeaderboardStore()

const totalStudents = computed(() => store.users.length)
const averageScore = computed(() => {
  const total = store.users.reduce((sum, user) => sum + user.score, 0)
  return Math.round(total / store.users.length)
})
const totalBadges = computed(() => {
  return store.users.reduce((sum, user) => sum + user.badges.length, 0)
})
</script>

<style scoped>
.leaderboard-page {
  @apply max-w-7xl mx-auto px-4 py-8;
}

.stats-summary {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6 mb-8;
}

.stat-card {
  @apply bg-white p-6 rounded-xl shadow-md text-center;
}

.stat-value {
  @apply text-3xl font-bold text-blue-600 mt-2;
}
</style> 