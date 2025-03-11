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
            <ion-label>Tiempo 1</ion-label>
            <ion-input type="number"  v-model.number="onyourmarksToSetTime" step="0.1" min="1" max="10" class="square-input" />
          </div>
          <div class="time-setting">
            <ion-label>Tiempo 2</ion-label>
            <div class="time-inputs">
              <ion-input type="number" v-model.number="setToGoTimeMin" step="0.1" min="1" max="5" class="square-input" />
              <ion-input type="number" v-model.number="setToGoTimeMax" step="0.1" min="1" max="5" class="square-input" />
            </div>
            <div class="info-icons">
              <ion-icon name="information-circle-outline" @click="openInfoPopup('min')"></ion-icon>
              <ion-icon name="information-circle-outline" @click="openInfoPopup('max')"></ion-icon>
            </div>
          </div>
        </div>
        <div class="button-container">
          <ion-button @click="saveSettings">GUARDAR</ion-button>
          <ion-button @click="resetSettings">RESET</ion-button>
        </div>
      </div>
      <ion-modal :is-open="isInfoPopupOpen" @didDismiss="closeInfoPopup">
        <ion-content>
          <div class="popup-content">
            <p>{{ infoMessage }}</p>
            <ion-button @click="closeInfoPopup">Cerrar</ion-button>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonInput, IonButton, IonIcon, IonModal } from '@ionic/vue';
import MenuComponent from '@/components/MenuComponent.vue';

const onyourmarksToSetTime = ref(5.0);
const setToGoTimeMin = ref(2.0);
const setToGoTimeMax = ref(3.0);
const isInfoPopupOpen = ref(false);
const infoMessage = ref('');

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

const openInfoPopup = (type: string) => {
  infoMessage.value = type === 'min' ? 'Información sobre el tiempo mínimo' : 'Información sobre el tiempo máximo';
  isInfoPopupOpen.value = true;
};

const closeInfoPopup = () => {
  isInfoPopupOpen.value = false;
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