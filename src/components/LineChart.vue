<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  data: Array
});

const chartCanvas = ref(null);
let chartInstance = null;

onMounted(() => {
  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Aceleración',
        borderColor: '#8884d8',
        borderWidth: 2,
        data: []
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
});

watch(() => props.data, (newData) => {
  if (chartInstance) {
    chartInstance.data.labels = newData.map((point) => (point.time / 1000).toFixed(2));
    chartInstance.data.datasets[0].data = newData.map(point => point.acceleration);
    chartInstance.update();
  }
}, { deep: true });
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 600px;
  height: 300px;
  margin: auto;
}
</style>
