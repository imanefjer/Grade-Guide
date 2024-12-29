<template>
  <div class="chart-container" style="height: 400px;">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  chartData: Object,
  options: Object
});

const canvas = ref(null);

onMounted(() => {
  const ctx = canvas.value.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: props.chartData,
    options: {
      ...props.options,
      maintainAspectRatio: false,
      responsive: true
    }
  });
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style> 