<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Reacción</ion-title>
        <MenuComponent />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="center-content">
        <h2>{{ message }}</h2>
        <ion-button @click="startCountdown" v-if="!running">Iniciar</ion-button>
        <div v-if="!running">
          <p>Sensibilidad: {{ sensitivity }}</p>
          <input type="range" v-model="sensitivity" min="0.01" max="1" step="0.01">
        </div>
        <LineChart :data="chartData" :shotTime="shotTime"/>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import axios from 'axios';
import MenuComponent from "@/components/MenuComponent.vue";
import LineChart from "@/components/LineChart.vue";
import eventBus from "@/eventBus";
import { Motion } from '@capacitor/motion';

const message = ref("Presiona 'Iniciar' para comenzar");
const running = ref(false);
const sensitivity = ref(0.1);
const chartData = ref([]);
const shotTime = ref(null);
const showChart = ref(false);

let startTime: number | null = null;
let movementDetected = false;
let movementBeforeStart = false;
let accelListener: any = null;

const sounds = {
  go: new Audio('/assets/go.mp3'),
};

onUnmounted(() => {
  stopMotionDetection();
});

const startCountdown = () => {
  running.value = true;
  message.value = "A sus puestos...";
  movementDetected = false;
  movementBeforeStart = false;
  
  chartData.value = [];
  shotTime.value = null;
  showChart.value = false;

  setTimeout(() => {
    message.value = "¡Listos!";
    startMotionDetection();

    setTimeout(() => {
      sounds.go.play();
      message.value = "¡Ya!";
      startTime = performance.now();

      if (movementBeforeStart) {
        recordReactionTime(true);
      } else {
        showChart.value = true;
      }
    }, Math.random() * 2000 + 1000);
  }, 2000);
};

const startMotionDetection = async () => {
  accelListener = await Motion.addListener('accel', (event) => {
    const { x, y, z } = event.accelerationIncludingGravity;
    const acceleration = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

    if (startTime !== null) {
      const currentTime = performance.now() - startTime;
      chartData.value.push({ time: currentTime, acceleration });
    }

    if (acceleration > sensitivity.value) {
      if (!startTime) {
        movementBeforeStart = true;
      } else if (!movementDetected) {
        movementDetected = true;
        recordReactionTime(false);
      }
    }
  });
};

const stopMotionDetection = () => {
  if (accelListener) {
    accelListener.remove();
  }
};

const recordReactionTime = async (falseStart: boolean) => {
  stopMotionDetection();
  if (startTime !== null) {
    const reactionTime = falseStart ? -(performance.now() - startTime) / 1000 : (performance.now() - startTime) / 1000;
    message.value = `${reactionTime.toFixed(3)}s`;
    running.value = false;

    shotTime.value = performance.now() - startTime;
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      await axios.post('https://speedreaction.dev-alicenter.es/api/times', { time: reactionTime });
      console.log("Tiempo registrado correctamente.");
      eventBus.emit("refreshTimes");
    } catch (error) {
      console.error("Error al enviar el tiempo:", error);
    }
  }
};
</script>

<style scoped>
.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

input[type="range"] {
  width: 80%;
  margin-top: 10px;
}
</style>
