<template>
  <div class="dashboard-container">
    <h1 class="text-2xl font-bold text-center my-6">User Performance Dashboard</h1>
    <UserProgressGraphs />
    <MilestoneBadges />
  </div>
</template>

<script setup>
import UserProgressGraphs from '@/components/UserProgressGraphs.vue'
import MilestoneBadges from '@/components/MilestoneBadges.vue'
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style> 