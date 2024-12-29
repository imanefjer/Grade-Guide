<template>
  <div class="progress-graphs">
    <SubjectProgressChart
      v-for="subject in subjects"
      :key="subject.name"
      :subjectName="subject.name"
      :performanceData="subject.data"
      class="subject-chart"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SubjectProgressChart from './SubjectProgressChart.vue';

// Mock data - replace with actual data from your store later
const subjects = ref([
  {
    name: 'Mathematics',
    data: [
      { date: 'Jan', score: 75 },
      { date: 'Feb', score: 82 },
      { date: 'Mar', score: 78 },
      { date: 'Apr', score: 85 }
    ]
  },
  {
    name: 'Science',
    data: [
      { date: 'Jan', score: 70 },
      { date: 'Feb', score: 75 },
      { date: 'Mar', score: 85 },
      { date: 'Apr', score: 88 }
    ]
  }
]);
</script>

<style scoped>
.progress-graphs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.subject-chart {
  min-height: 400px;
}
</style> 