<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Sensibilidad</ion-title>
        <MenuComponent />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="false" class="ion-padding">
      <div class="container">
        <div class="config-container">
          <div class="time-setting">
            <ion-label>Sensibilidad 1</ion-label>
            <ion-input type="number"  v-model.number="thresholdPreStart" step="0.1" min="0.5" max="5" class="square-input" />
            <ion-button @click="showAlert1 = true" fill="clear">
              <ion-icon :icon="chatboxEllipsesOutline" style="font-size: 32px; color: white;"/>
            </ion-button>
            <ion-alert
                :is-open="showAlert1"
                header="Sensibilidad 1"
                message="Es la sensibilidad de salida antes del disparo. Si la app detecta salidas nulas a causa de movimientos leves, baja la sensibilidad."
                :buttons="['OK']"
                @didDismiss="showAlert1 = false"
            ></ion-alert>
          </div>
          <div class="time-setting">
              <ion-label>Sensibilidad 2</ion-label>
            <ion-input type="number"  v-model.number="thresholdPostStart" step="0.1" min="0.5" max="5" class="square-input" />
            <ion-button @click="showAlert2 = true" fill="clear">
              <ion-icon :icon="chatboxEllipsesOutline" style="font-size: 32px; color: white;"/>
            </ion-button>
            <ion-alert
                :is-open="showAlert2"
                header="Sensibilidad 2"
                message="Es la sensibilidad de salida depués del disparo. Si la app no detecta tu reacción, sube la sensibilidad."
                :buttons="['OK']"
                @didDismiss="showAlert2 = false"
            ></ion-alert>
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
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonAlert
} from '@ionic/vue';
import MenuComponent from '@/components/MenuComponent.vue';
import {chatboxEllipsesOutline} from "ionicons/icons";

const thresholdPreStart = ref(1.0)
const thresholdPostStart = ref(1.0)
const showAlert1 = ref(false);
const showAlert2 = ref(false);

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
  display: grid;
  gap: 20px;
  width: 100%;
  max-width: 400px;
  margin: auto;
}

.time-setting {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  width: 100%;
}

.time-inputs {
  display: flex;
  gap: 10px;
}

.square-input {
  width: 50px;
  height: 40px;
  text-align: center;
  background-color: black;
  border-radius: 10px;
  color: white;
}
.square-input1 {
  width: 110px;
  height: 40px;
  text-align: center;
  background-color: black;
  border-radius: 10px;
  color: white;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.container {
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
</style>