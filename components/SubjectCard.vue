<template>
  <div class="subject-card">
    <h2>{{ capitalizedSubject }}</h2>
    
    <div class="chart-section">
      <LineChart 
        :chart-data="chartData"
        :options="chartOptions"
      />
    </div>

    <div class="badges-section">
      <h3>Achievements</h3>
      <div class="badges-container">
        <div v-for="badge in subjectData.badges" 
             :key="badge.id" 
             class="badge"
             :class="{ 'achieved': badge.achieved }">
          <i class="fas fa-medal"></i>
          <div class="badge-info">
            <h4>{{ badge.name }}</h4>
            <p>{{ badge.requirement }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePerformanceStore } from '@/stores/performanceStore';
import LineChart from './LineChart.vue';

const props = defineProps({
  subject: {
    type: String,
    required: true
  }
});

const store = usePerformanceStore();
const subjectData = computed(() => store.getSubjectData(props.subject));
const chartData = computed(() => store.getChartData(props.subject));
const capitalizedSubject = computed(() => 
  props.subject.charAt(0).toUpperCase() + props.subject.slice(1)
);

const chartOptions = {
  scales: {
    y: {
      beginAtZero: true,
      max: 100
    }
  }
};
</script>

<style scoped>
.subject-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.chart-section {
  margin: 20px 0;
}

.badges-section {
  margin-top: 20px;
}

.badges-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background: #f5f5f5;
  opacity: 0.7;
}

.badge.achieved {
  background: #e3f2fd;
  opacity: 1;
}

.badge i {
  font-size: 24px;
  color: #bdbdbd;
}

.badge.achieved i {
  color: #2196F3;
}

.badge-info h4 {
  margin: 0;
  font-size: 14px;
}

.badge-info p {
  margin: 5px 0 0;
  font-size: 12px;
  color: #666;
}
</style> 