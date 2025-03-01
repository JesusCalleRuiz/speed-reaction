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
        <LineChart :data="data" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import { Motion } from '@capacitor/motion';
import axios from 'axios';
import MenuComponent from "@/components/MenuComponent.vue";
import eventBus from "@/eventBus";
import LineChart from "@/components/LineChart.vue";

const message = ref("Presiona 'Iniciar' para comenzar");
const running = ref(false);
let shotTime: number | null = null;
const data = ref<{ time: number, acceleration: number }[]>([]);
const threshold = 1.5;

const sounds = {
  go: new Audio('/assets/go.mp3'),
};

const startCountdown = () => {
  running.value = true;
  message.value = "A sus puestos...";
  data.value = [];
  shotTime = null;

  Motion.removeAllListeners();

  //tiempo aleatoria de 1 a 3
  const delay = Math.random() * 2000 + 1000;
  const scheduledShotTime = performance.now() + delay;

  Motion.addListener('accel', event => {
    const currentTime = performance.now();
    const acceleration = Math.sqrt(
        event.acceleration.x ** 2 +
        event.acceleration.y ** 2 +
        event.acceleration.z ** 2
    );
    data.value.push({ time: currentTime, acceleration });
    const baseTime = shotTime !== null ? shotTime : scheduledShotTime;
    const reactionTime = (currentTime - baseTime) / 1000;

    if (acceleration > threshold) {
      saveReactionTime(reactionTime);
      Motion.removeAllListeners();
    }
  });

 //disparo
  setTimeout(() => {
    sounds.go.play();
    message.value = "¡Ya!";
    shotTime = performance.now();
  }, delay);
};

const saveReactionTime = async (reactionTime: number) => {
  message.value = `${reactionTime.toFixed(3)}s`;
  running.value = false;
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    await axios.post('https://speedreaction.dev-alicenter.es/api/times', { time: reactionTime });
    console.log("Tiempo registrado correctamente.");
    eventBus.emit("refreshTimes");
  } catch (error) {
    console.error("Error al enviar el tiempo:", error);
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
</style>
