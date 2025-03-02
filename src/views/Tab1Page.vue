<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Reacción</ion-title>
        <MenuComponent />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="false" class="ion-padding">
      <div class="center-content">
        <div class="time-display">
          <h2>{{ message }}</h2>
          <h1>{{ ms }}</h1>
        </div>
        <LineChart :data="data"  />
        <ion-button class="boton" @click="startCountdown" v-if="!running">Iniciar</ion-button>
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

const message = ref("000")
const ms = ref("ms")
const running = ref(false);
let shotTime: number | null = null;
const data = ref<{ time: number, acceleration: number }[]>([]);
const threshold = 1.5;

const sounds = {
  go: new Audio('/assets/go.mp3'),
  onyourmarks: new Audio('/assets/onyourmarks.mp3'),
  set: new Audio('/assets/getset.mp3'),
};

const startCountdown = async () => {
  const onyourmarksToSetTime = Number(localStorage.getItem("onyourmarksToSetTime")) || 5.0;
  const setToGoTimeMin = Number(localStorage.getItem("setToGoTimeMin")) || 2.0;
  const setToGoTimeMax = Number(localStorage.getItem("setToGoTimeMax")) || 3.0;
  const setToGoTime = Math.random() * (setToGoTimeMax - setToGoTimeMin) + setToGoTimeMin;

   await Motion.removeAllListeners();

  //a sus puestos
  sounds.onyourmarks.play();
  running.value = true;
  data.value = [];

  setTimeout(() => {
    //listos
    sounds.set.play();
    // Empieza a registrar movimiento
    Motion.addListener('accel', event => {
      const acceleration = Math.sqrt(event.acceleration.x ** 2 + event.acceleration.y ** 2 + event.acceleration.z ** 2);
      data.value.push({ time: performance.now(), acceleration });
    });

    setTimeout(() => {
      sounds.go.play();
      shotTime = performance.now();
      console.log(shotTime);
      Motion.addListener('accel', event => {
        const acceleration = Math.sqrt(event.acceleration.x ** 2 + event.acceleration.y ** 2 + event.acceleration.z ** 2);
        const reactionTime = (performance.now() - (shotTime || 0)) / 1000;

        if (acceleration > threshold) {
          saveReactionTime(reactionTime);
          Motion.removeAllListeners();
        }
      });
    }, setToGoTime * 1000);
  }, onyourmarksToSetTime * 1000);
};

const saveReactionTime = async (reactionTime: number) => {
  message.value = `${Math.round(reactionTime * 1000)}`;
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

.time-display {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

h2 {
  margin-top: 30px;
  font-size: 6rem;
}

h1 {
  font-size: 2rem;
  font-weight: normal;
}

.boton {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 60px; 
  border-radius: 0;
  text-align: center;
  font-size: 18px;
}
</style>