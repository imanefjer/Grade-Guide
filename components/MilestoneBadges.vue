<template>
  <div class="badges-container">
    <h2 class="text-lg font-semibold">Milestone Badges</h2>
    <div class="badges">
      <div v-for="badge in badges" :key="badge.id" class="badge">
        <img :src="badge.image" :alt="badge.title" class="badge-image">
        <p>{{ badge.title }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import beginnerBadge from '@/assets/images/beginner-badge.png'
import intermediateBadge from '@/assets/images/intermediate-badge.png'
import advancedBadge from '@/assets/images/advanced-badge.png'

const badges = ref([
  { id: 1, title: 'Beginner', image: beginnerBadge },
  { id: 2, title: 'Intermediate', image: intermediateBadge },
  { id: 3, title: 'Advanced', image: advancedBadge }
])
</script>

<style scoped>
.badges-container {
  margin-top: 2rem;
}
.badge {
  display: inline-block;
  margin-right: 1rem;
}
.badge-image {
   width: auto;
  height: auto;
  max-width: 80px; 
  object-fit: contain;
}
</style> 