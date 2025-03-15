<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tiempos</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="false" class="ion-padding">
      <div class="container">
        <div class="config-container">
          <!-- Tiempo 1 -->
          <div class="time-setting">
            <ion-label>Tiempo 1</ion-label>
            <ion-input type="number" v-model.number="onyourmarksToSetTime" step="0.1" min="1" max="30" class="square-input1" />
            <ion-button @click="showAlert1 = true" fill="clear">
              <ion-icon :icon="chatboxEllipsesOutline" style="font-size: 32px; color: white;"/>
            </ion-button>
            <ion-alert
                :is-open="showAlert1"
                header="Tiempo 1"
                message="Este es el tiempo en segundos que transcurre entre la señal de 'ON YOUR MARKS' y 'SET'. Debe ser un valor fijo entre 1 y 30 segundos."
                :buttons="['OK']"
                @didDismiss="showAlert1 = false"
            ></ion-alert>
          </div>
          <div class="time-setting">
            <ion-label>Tiempo 2</ion-label>
            <div class="time-inputs">
              <ion-input type="number" v-model.number="setToGoTimeMin" step="0.1" min="1" max="5" class="square-input" />
              <ion-input type="number" v-model.number="setToGoTimeMax" step="0.1" min="1" max="10" class="square-input" />
            </div>
            <ion-button @click="showAlert2 = true" fill="clear">
              <ion-icon :icon="chatboxEllipsesOutline" style="font-size: 32px; color: white;"/>
            </ion-button>
            <ion-alert
                :is-open="showAlert2"
                header="Tiempo 2"
                message="Este es el tiempo en segundos que transcurre entre la señal de 'SET' y el disparo de salida. Se elige aleatoriamente entre los valores mínimos y máximos que ingreses. Si configuras 2 y 3, el disparo ocurrirá en un tiempo aleatorio entre 2 y 3 segundos."
                :buttons="['OK']"
                @didDismiss="showAlert2 = false"
            ></ion-alert>
          </div>
        </div>
        <div class="button-container">
          <ion-button class ="button1" @click="saveSettings">Guardar</ion-button>
          <ion-button class ="button2" @click="resetSettings">Reset</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonInput, IonButton, IonIcon, IonAlert } from '@ionic/vue';
import MenuComponent from '@/components/MenuComponent.vue';
import { chatboxEllipsesOutline } from "ionicons/icons";

const onyourmarksToSetTime = ref(5.0);
const setToGoTimeMin = ref(2.0);
const setToGoTimeMax = ref(3.0);
const showAlert1 = ref(false);
const showAlert2 = ref(false);

onMounted(() => {
  onyourmarksToSetTime.value = Number(localStorage.getItem("onyourmarksToSetTime")) || 5.0;
  setToGoTimeMin.value = Number(localStorage.getItem("setToGoTimeMin")) || 2.0;
  setToGoTimeMax.value = Number(localStorage.getItem("setToGoTimeMax")) || 3.0;
});

const saveSettings = () => {
  localStorage.setItem("onyourmarksToSetTime", String(onyourmarksToSetTime.value));
  localStorage.setItem("setToGoTimeMin", String(setToGoTimeMin.value));
  localStorage.setItem("setToGoTimeMax", String(setToGoTimeMax.value));
};

const resetSettings = () => {
  localStorage.removeItem("onyourmarksToSetTime");
  localStorage.removeItem("setToGoTimeMin");
  localStorage.removeItem("setToGoTimeMax");
  onyourmarksToSetTime.value = 5.0;
  setToGoTimeMin.value = 2.0;
  setToGoTimeMax.value = 3.0;
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
  font-weight:bold;
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
.button1 {
  --border-radius: 20px;
  width: 80%;
  text-transform: none;
  font-weight:700;
  font-size: 16px;
  --color: black;
  height: 45px;
  max-width: 200px;
}
.button2 {
  --border-radius: 20px;
  width: 80%;
  text-transform: none;
  font-weight:600;
  font-size: 16px;
  --background: black;
  --border-width: 1px;
  --border-color: gray;
  --border-style: solid;
  height: 45px;
  max-width: 200px;
}

.container {
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
.title{
  font-weight:800;
}

</style>
