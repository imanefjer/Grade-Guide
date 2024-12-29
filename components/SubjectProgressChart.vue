<template>
  <div class="subject-progress-container">
    <div class="chart-header">
      <h3 class="subject-title">{{ subjectName }}</h3>
      <div class="time-range-selector">
        <button 
          v-for="range in timeRanges" 
          :key="range"
          @click="selectedRange = range"
          :class="['range-btn', { active: selectedRange === range }]"
        >
          {{ range }}
        </button>
      </div>
    </div>
    <LineChart 
      :chartData="chartData" 
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import LineChart from './LineChart.vue';

const props = defineProps({
  subjectName: {
    type: String,
    required: true
  },
  performanceData: {
    type: Array,
    required: true
  }
});

const timeRanges = ['Week', 'Month', 'Year'];
const selectedRange = ref('Month');

const chartData = computed(() => ({
  labels: props.performanceData.map(item => item.date),
  datasets: [{
    label: 'Performance',
    data: props.performanceData.map(item => item.score),
    borderColor: '#2196F3',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    fill: true,
    tension: 0.4
  }]
}));

const chartOptions = {
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        callback: value => `${value}%`
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => `Score: ${context.raw}%`
      }
    }
  }
};
</script>

<style scoped>
.subject-progress-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.subject-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.time-range-selector {
  display: flex;
  gap: 0.5rem;
}

.range-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.range-btn.active {
  background: #2196F3;
  color: white;
  border-color: #2196F3;
}

.range-btn:hover:not(.active) {
  background: #f8fafc;
}
</style> 