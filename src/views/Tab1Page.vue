<template>
  <ion-page>
    <ion-header :class="{ oculto: running }">
      <ion-toolbar>
        <ion-title>Reacción</ion-title>
        <MenuComponent />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="center-content">
        <div class="time-display">
          <h2>{{ message }}</h2>
          <h1>{{ ms }}</h1>
        </div>
        <LineChart :data="data" />
        <ion-button class="boton" @click="startCountdown" v-if="!running">Iniciar</ion-button>
      </div>
    </ion-content>
  </ion-page> 
</template>

<script setup lang="ts">
import {inject, onMounted, ref} from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import { Motion } from '@capacitor/motion';
import axios from 'axios';
import MenuComponent from "@/components/MenuComponent.vue";
import eventBus from "@/eventBus";
import LineChart from "@/components/LineChart.vue";
import { PluginListenerHandle } from '@capacitor/core';

const message = ref("000");
const ms = ref("ms");
const running = inject("running", ref(false));
let shotTime: number | null = null;
let preShotTime: number | null = null;
const data = ref<{ time: number, acceleration: number }[]>([]);
const threshold = 1.0;
let movementDetectedBeforeShot = false;
let accelHandler: PluginListenerHandle | null = null;
// 🎵 Web Audio API para menor latencia
let audioContext: AudioContext;
let audioBuffers: { [key: string]: AudioBuffer } = {};
let setTime: number | null = null;

const startCountdown = async () => {
  const onyourmarksToSetTime = Number(localStorage.getItem("onyourmarksToSetTime")) || 5.0;
  const setToGoTimeMin = Number(localStorage.getItem("setToGoTimeMin")) || 2.0;
  const setToGoTimeMax = Number(localStorage.getItem("setToGoTimeMax")) || 3.0;
  const setToGoTime = Math.random() * (setToGoTimeMax - setToGoTimeMin) + setToGoTimeMin;

  message.value = "000";
  running.value = true;
  movementDetectedBeforeShot = false;
  preShotTime = null;
  shotTime = null;
  setTime = null;
  data.value = [];

  playSound('onyourmarks');
  setTimeout(() => {
    playSound('set');
    setTime = performance.now();
    Motion.addListener('accel', (event) => {
      const acceleration = Math.sqrt(event.acceleration.x ** 2 + event.acceleration.y ** 2 + event.acceleration.z ** 2);
      const currentTime = performance.now();
      const relativeTime = setTime ? (currentTime - setTime) / 1000 : 0;
      data.value.push({ time: relativeTime, acceleration });

      if (!shotTime && acceleration > threshold) {
        movementDetectedBeforeShot = true;
        preShotTime = currentTime;
      }
    }).then(handler => {
      accelHandler = handler;
    });

    setTimeout(() => {
      let reactionTime: number;
      playSound('go');
      shotTime = performance.now();
      if (movementDetectedBeforeShot && preShotTime) {
        //salida nula
        if (!shotTime) return;
        reactionTime = (preShotTime - shotTime) / 1000;
        saveReactionTime(reactionTime);
        stopAcceleration();
        //segundo disparo por ser nula
        setTimeout(()=>{
          playSound('go');
        },800);
        return;
      }else{
        stopAcceleration();
        Motion.addListener('accel', (event) => {
          const acceleration = Math.sqrt(event.acceleration.x ** 2 + event.acceleration.y ** 2 + event.acceleration.z ** 2);
          const currentTime = performance.now();
          const relativeTime = setTime ? (currentTime - setTime) / 1000 : 0;
          data.value.push({ time: relativeTime, acceleration });

          if (acceleration > threshold) {
            let reactionTime: number;
            if (!shotTime) return;
            reactionTime = (currentTime - shotTime) / 1000;
            saveReactionTime(reactionTime);
            stopAcceleration();
            return;
          }
        }).then(handler => {
          accelHandler = handler;
        });
      }

    }, setToGoTime * 1000);

  }, onyourmarksToSetTime * 1000);
};

const stopAcceleration = () => {
  if (accelHandler) {
    accelHandler.remove();
    accelHandler = null;
  }
};

onMounted(async () => {
  audioContext = new AudioContext();
  await loadSounds();
});

//precargar sonidos
const loadSounds = async () => {
  const soundFiles = {
    go: '/assets/go.mp3',
    onyourmarks: '/assets/onyourmarks.mp3',
    set: '/assets/getset.mp3'
  };

  for (const [key, url] of Object.entries(soundFiles)) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffers[key] = await audioContext.decodeAudioData(arrayBuffer);
  }
};

const playSound = (name: string) => {
  if (!audioBuffers[name]) return;
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffers[name];
  source.connect(audioContext.destination);
  source.start();
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
.oculto {
  opacity: 0;
  transform: translateY(-20px); /* Desplaza hacia arriba */
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
  pointer-events: none; /* Evita interacción con los elementos ocultos */
}
</style>