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
          label: 'Aceleración',
          borderColor: '#24da1e',
          borderWidth: 2,
          data: [],
          pointRadius: 0,
          cubicInterpolationMode: 'monotone',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#b1b1b1'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          y: {
            min: 0,
            ticks: {
              color: '#b1b1b1'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          }
        }
      }
    });
  }
});

watch(() => props.data, (newData) => {
  if (newData && chartInstance) {
    chartInstance.data.labels = newData.map((point: DataPoint) => (point.time).toFixed(2));
    chartInstance.data.datasets[0].data = newData.map((point: DataPoint) => point.acceleration);
    chartInstance.update();
  }
}, { deep: true });
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 600px;
  height: 55%;
  margin: auto;
}
</style>