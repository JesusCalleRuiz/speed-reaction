<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, PropType } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface DataPoint {
  time: number;
  acceleration: number;
}

const props = defineProps({
  data: Array as PropType<DataPoint[]>
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

onMounted(() => {
  if (chartCanvas.value) {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          borderColor: '#8884d8',
          borderWidth: 2,
          data: [],
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
});

watch(() => props.data, (newData) => {
  if (newData && chartInstance) {
    chartInstance.data.labels = newData.map((point: DataPoint) => (point.time / 1000).toFixed(2));
    chartInstance.data.datasets[0].data = newData.map((point: DataPoint) => point.acceleration);
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
