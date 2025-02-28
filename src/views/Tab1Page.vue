<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Reacción</ion-title>
        <MenuComponent/>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="center-content">
        <h2>{{ message }}</h2>
        <ion-button @click="startCountdown" v-if="!running">Iniciar</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import axios from 'axios';
import MenuComponent from "@/components/MenuComponent.vue";
import eventBus from "@/eventBus";


const message = ref("Presiona 'Iniciar' para comenzar");
const running = ref(false);
let startTime: number | null = null;
const sounds = {
  //susPuestos: new Audio(require('@/assets/a_sus_puestos.mp3')),
  //listos: new Audio(require('@/assets/listos.mp3')),
  go: new Audio('/assets/go.mp3'),
};

const startCountdown = () => {
  running.value = true;
  message.value = "A sus puestos...";

  setTimeout(() => {
    message.value = "¡Listos!";

    setTimeout(() => {
      sounds.go.play();
      message.value = "¡Ya!";
      startTime = performance.now();

      //tocar la pantalla
      document.addEventListener('touchstart', recordReactionTime, { once: true });
    }, Math.random() * 2000 + 1000);//tiempo entre 1 y 3
  }, 2000);
};
const recordReactionTime = async () => {
  if (startTime !== null) {
    const reactionTime = (performance.now() - startTime) / 1000;
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
