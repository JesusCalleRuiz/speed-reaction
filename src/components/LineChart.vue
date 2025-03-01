<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, PropType } from 'vue';
import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(...registerables, annotationPlugin);

interface DataPoint {
  time: number;
  acceleration: number;
}

const props = defineProps({
  data: Array as PropType<DataPoint[]>,
  shotTime: Number
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
          borderColor: '#8884d8',
          borderWidth: 2,
          data: [],
          pointRadius: 2,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          annotation: {
            annotations: {}
          },
          legend: {
            display: false
          }
        }
      }
    });
  }
});

watch(() => props.data, (newData) => {
  if (newData && chartInstance) {
    chartInstance.data.labels = newData.map(point => (point.time / 1000).toFixed(2));
    chartInstance.data.datasets[0].data = newData.map(point => point.acceleration);

    // Agregar la línea del disparo
    if (props.shotTime !== null) {
      chartInstance.options.plugins.annotation.annotations = {
        shotLine: {
          type: 'line',
          xMin: (props.shotTime / 1000).toFixed(2),
          xMax: (props.shotTime / 1000).toFixed(2),
          borderColor: 'red',
          borderWidth: 2,
          label: {
            content: 'Disparo',
            enabled: true,
            position: 'top'
          }
        }
      };
    }

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
