<template>
  <div class="leaderboard-container">
    <!-- Top 3 Performers Podium -->
    <div class="top-performers">
      <div v-for="user in topThree" :key="user.id" 
           class="podium-spot" :class="`place-${user.rank}`">
        <div class="avatar-container">
          <img :src="user.avatar" :alt="user.name" class="avatar">
          <div class="rank-badge">{{ user.rank }}</div>
        </div>
        <h3 class="user-name">{{ user.name }}</h3>
        <div class="score">{{ user.score }} pts</div>
        <div class="badges-row">
          <div v-for="badge in user.badges" :key="badge" 
               class="badge" :title="getBadgeTitle(badge)">
            <img :src="`/badges/${badge}.svg`" :alt="badge">
          </div>
        </div>
      </div>
    </div>

    <!-- Full Leaderboard Table -->
    <div class="leaderboard-table">
      <div class="table-header">
        <div class="rank-col">Rank</div>
        <div class="user-col">User</div>
        <div class="progress-col">Progress</div>
        <div class="score-col">Score</div>
        <div class="badges-col">Badges</div>
      </div>
      
      <div v-for="user in leaderboardUsers" :key="user.id" 
           class="table-row" :class="{ 'current-user': user.isCurrentUser }">
        <div class="rank-col">
          <span class="rank-number">#{{ user.rank }}</span>
        </div>
        <div class="user-col">
          <img :src="user.avatar" :alt="user.name" class="user-avatar">
          <span class="user-name">{{ user.name }}</span>
        </div>
        <div class="progress-col">
          <div class="progress-chart">
            <div v-for="(score, index) in user.recentProgress" 
                 :key="index" 
                 class="progress-bar"
                 :style="{ height: `${score}%` }">
            </div>
          </div>
        </div>
        <div class="score-col">{{ user.score }}</div>
        <div class="badges-col">
          <div v-for="badge in user.badges.slice(0, 3)" 
               :key="badge" 
               class="badge-small">
            <img :src="`/badges/${badge}.svg`" :alt="badge">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLeaderboardStore } from '@/stores/leaderboardStore'

const store = useLeaderboardStore()

const topThree = computed(() => store.topPerformers)
const leaderboardUsers = computed(() => store.sortedUsers)

const getBadgeTitle = (badge) => {
  const titles = {
    advanced: 'Advanced Learner',
    problemSolver: 'Problem Solver',
    quickLearner: 'Quick Learner',
    // Add more badge titles...
  }
  return titles[badge] || badge
}
</script>

<style scoped>
.leaderboard-container {
  @apply max-w-7xl mx-auto p-6 space-y-8;
}

.top-performers {
  @apply flex justify-center items-end gap-4 mb-12;
}

.podium-spot {
  @apply flex flex-col items-center transition-all duration-300;
}

.place-2 {
  @apply order-1 transform translate-y-8;
}

.place-1 {
  @apply order-2 scale-110;
}

.place-3 {
  @apply order-3 transform translate-y-12;
}

.avatar-container {
  @apply relative;
}

.avatar {
  @apply w-24 h-24 rounded-full border-4 border-white shadow-lg;
}

.rank-badge {
  @apply absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 
         text-white flex items-center justify-center font-bold shadow-md;
}

.badges-row {
  @apply flex gap-2 mt-2;
}

.badge {
  @apply w-8 h-8;
}

.leaderboard-table {
  @apply bg-white rounded-xl shadow-md overflow-hidden;
}

.table-header {
  @apply grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 font-semibold text-gray-700;
}

.table-row {
  @apply grid grid-cols-5 gap-4 px-6 py-4 items-center border-t border-gray-100
         hover:bg-blue-50 transition-colors duration-200;
}

.current-user {
  @apply bg-blue-50;
}

.progress-chart {
  @apply flex gap-1 h-12 items-end;
}

.progress-bar {
  @apply w-2 bg-blue-400 rounded-t transition-all duration-300;
}

.user-col {
  @apply flex items-center gap-3;
}

.user-avatar {
  @apply w-10 h-10 rounded-full;
}

.badge-small {
  @apply w-6 h-6;
}
</style> 