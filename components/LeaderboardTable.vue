<template>
  <div class="leaderboard-container">
    <!-- Top 3 Performers Podium -->
    <div class="top-performers">
      <!-- Second Place -->
      <div v-if="topThree[1]" class="podium-spot place-2">
        <div class="podium-block h-32 bg-gray-50">
          <div class="rank-badge">#2</div>
          <div class="content">
            <h3 class="user-name">{{ topThree[1].name }}</h3>
            <div class="level">Level {{ Math.round(topThree[1].topLevel) }}</div>
            <div class="stats">
              <span class="stat-item">
                <IconQuiz class="w-4 h-4" />
                {{ topThree[1].numQuizzesTaken }}
              </span>
              <span class="stat-item">
                <IconClock class="w-4 h-4" />
                {{ formatTime(topThree[1].totalTimeSpent) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- First Place -->
      <div v-if="topThree[0]" class="podium-spot place-1">
        <div class="podium-block h-40 bg-blue-50 border-2 border-blue-200">
          <div class="rank-badge bg-blue-600">#1</div>
          <div class="crown">👑</div>
          <div class="content">
            <h3 class="user-name font-bold">{{ topThree[0].name }}</h3>
            <div class="level text-blue-600">Level {{ Math.round(topThree[0].topLevel) }}</div>
            <div class="stats">
              <span class="stat-item">
                <IconQuiz class="w-4 h-4" />
                {{ topThree[0].numQuizzesTaken }}
              </span>
              <span class="stat-item">
                <IconClock class="w-4 h-4" />
                {{ formatTime(topThree[0].totalTimeSpent) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Third Place -->
      <div v-if="topThree[2]" class="podium-spot place-3">
        <div class="podium-block h-28 bg-gray-50">
          <div class="rank-badge">#3</div>
          <div class="content">
            <h3 class="user-name">{{ topThree[2].name }}</h3>
            <div class="level">Level {{ Math.round(topThree[2].topLevel) }}</div>
            <div class="stats">
              <span class="stat-item">
                <IconQuiz class="w-4 h-4" />
                {{ topThree[2].numQuizzesTaken }}
              </span>
              <span class="stat-item">
                <IconClock class="w-4 h-4" />
                {{ formatTime(topThree[2].totalTimeSpent) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Full Leaderboard Table -->
    <div class="leaderboard-table">
      <div class="table-header">
        <div class="rank-col">#</div>
        <div class="user-col">Student</div>
        <div class="level-col">Level</div>
        <div class="quizzes-col">Quizzes</div>
        <div class="time-col">Time</div>
      </div>
      
      <div v-for="user in leaderboardUsers" 
           :key="user.id" 
           class="table-row">
        <div class="rank-col">{{ user.rank }}</div>
        <div class="user-col">{{ user.name }}</div>
        <div class="level-col">{{ Math.round(user.topLevel) }}</div>
        <div class="quizzes-col">{{ user.numQuizzesTaken }}</div>
        <div class="time-col">{{ formatTime(user.totalTimeSpent) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLeaderboardStore } from '@/stores/leaderboardStore'

const store = useLeaderboardStore()

const topThree = computed(() => store.topPerformers)
const leaderboardUsers = computed(() => store.sortedUsers.slice(3))

const formatTime = (seconds) => {
  if (!seconds) return '0m'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}
</script>

<style scoped>
.top-performers {
  @apply flex justify-center items-end gap-4 mb-16 mt-8;
}

.podium-block {
  @apply relative flex flex-col items-center justify-center p-4 rounded-xl w-56 
         shadow-md transition-all duration-300 hover:shadow-lg;
}

.crown {
  @apply absolute -top-6 left-1/2 -translate-x-1/2 text-2xl;
}

.content {
  @apply flex flex-col items-center gap-2;
}

.stats {
  @apply flex gap-4 text-sm text-gray-600 mt-1;
}

.stat-item {
  @apply flex items-center gap-1;
}

.leaderboard-table {
  @apply bg-white rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto;
}

.table-header {
  @apply grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 font-semibold text-gray-700;
}

.table-row {
  @apply grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50;
}

.rank-col {
  @apply col-span-1;
}

.user-col {
  @apply col-span-4;
}

.level-col {
  @apply col-span-2 text-center;
}

.quizzes-col {
  @apply col-span-2 text-center;
}

.time-col {
  @apply col-span-3 text-right;
}
</style> 