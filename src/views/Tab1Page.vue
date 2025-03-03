<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import { Motion } from '@capacitor/motion';
import axios from 'axios';
import MenuComponent from "@/components/MenuComponent.vue";
import eventBus from "@/eventBus";
import LineChart from "@/components/LineChart.vue";
import { PluginListenerHandle } from '@capacitor/core';

const message = ref("000");
const ms = ref("ms");
const running = ref(false);
let shotTime: number | null = null;
let preShotTime: number | null = null;
const data = ref<{ time: number, acceleration: number }[]>([]);
const threshold = 1.0;
let movementDetectedBeforeShot = false;
let accelHandler: PluginListenerHandle | null = null;
let minReactionTime: number | null = null;

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

  message.value = "000";
  running.value = true;
  movementDetectedBeforeShot = false;
  preShotTime = null;
  shotTime = null;
  data.value = [];
  minReactionTime = null;

  sounds.onyourmarks.play();
  setTimeout(() => {
    sounds.set.play();
    Motion.addListener('accel', (event) => {
      const acceleration = Math.sqrt(event.acceleration.x ** 2 + event.acceleration.y ** 2 + event.acceleration.z ** 2);
      const currentTime = performance.now();
      data.value.push({ time: currentTime, acceleration });

      if (!shotTime && acceleration > threshold) {
        movementDetectedBeforeShot = true;
        preShotTime = currentTime;
        message.value = `${Math.round((preShotTime - (shotTime || preShotTime)) / 1000 * 1000)}`;
      }
    }).then(handler => {
      accelHandler = handler;
    });

    setTimeout(() => {
      sounds.go.play();
      shotTime = performance.now();
      stopAcceleration();

      Motion.addListener('accel', (event) => {
        const acceleration = Math.sqrt(event.acceleration.x ** 2 + event.acceleration.y ** 2 + event.acceleration.z ** 2);
        const currentTime = performance.now();
        data.value.push({ time: currentTime, acceleration });

        if (acceleration > threshold) {
          if(!shotTime) return;
          let reactionTime = (currentTime - shotTime) / 1000;

          if (movementDetectedBeforeShot && preShotTime) {
            reactionTime = (preShotTime - shotTime) / 1000;
            message.value = `${Math.round(reactionTime * 1000)}`;
            setTimeout(() => {
              saveReactionTime(reactionTime);
              stopAcceleration();
            }, 100);
          } else {
            if (minReactionTime === null || reactionTime < minReactionTime) {
              minReactionTime = reactionTime;
              message.value = `${Math.round(minReactionTime * 1000)}`;
            }
            setTimeout(() => {
              saveReactionTime(minReactionTime!);
              stopAcceleration();
            }, 200);
          }
        }
      }).then(handler => {
        accelHandler = handler;
      });
    }, setToGoTime * 1000);
  }, onyourmarksToSetTime * 1000);
};

const stopAcceleration = () => {
  if (accelHandler) {
    accelHandler.remove();
    accelHandler = null;
  }
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
