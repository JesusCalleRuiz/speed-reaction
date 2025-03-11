<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Configuración de Tiempos</ion-title>
        <MenuComponent />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="false" class="ion-padding">
      <div class="container">
        <div class="config-container">
          <div class="time-setting">
            <ion-label>Sensibilidad salida nula</ion-label>
            <ion-input type="number"  v-model.number="thresholdPreStart" step="0.1" min="0.5" max="5" class="square-input" />
          </div>
          <div class="time-setting">
            <ion-label>Sensibilidad salida</ion-label>
            <ion-input type="number"  v-model.number="thresholdPostStart" step="0.1" min="0.5" max="5" class="square-input" />
          </div>
        </div>
        <div class="button-container">
          <ion-button @click="saveSettings">GUARDAR</ion-button>
          <ion-button @click="resetSettings">RESET</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonInput, IonButton, IonIcon, IonModal } from '@ionic/vue';
import MenuComponent from '@/components/MenuComponent.vue';

const thresholdPreStart = ref(1.0)
const thresholdPostStart = ref(1.0)

onMounted(() => {
  thresholdPreStart.value = Number(localStorage.getItem("thresholdPreStart")) || 1.0;
  thresholdPostStart.value = Number(localStorage.getItem("thresholdPostStart")) || 1.0;
});

const saveSettings = () => {
  localStorage.setItem("thresholdPreStart", String(thresholdPreStart.value));
  localStorage.setItem("thresholdPostStart", String(thresholdPostStart.value));
};

const resetSettings = () => {
  localStorage.removeItem("thresholdPreStart");
  localStorage.removeItem("thresholdPostStart");
  thresholdPreStart.value = 1.0;
  thresholdPostStart.value = 1.0;
};
</script>

<style scoped>
.config-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.time-setting {
  display: flex;
  align-items: center;
  gap: 15px;
}

.time-inputs {
  display: flex;
  gap: 10px;
}


.square-input {
  width: 60px;
  height: 40px;
  text-align: center;
  background-color: black;
  border-radius: 10px;
}

.info-icons {
  display: flex;
  gap: 10px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.popup-content {
  text-align: center;
  padding: 20px;
}

.container {
  background-color: #232323;
  padding: 20px;
  border-radius: 10px;
}
</style>