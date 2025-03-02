<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Configuración de Tiempos</ion-title>
        <MenuComponent />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="false" class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label>Tiempo 1</ion-label>
          <ion-input type="number" v-model.number="onyourmarksToSetTime" step="0.1" min="1" max="10" />
        </ion-item>
        <ion-item>
          <ion-label>Tiempo 2</ion-label>
          <div class="time-range">
            <ion-input type="number" v-model.number="setToGoTimeMin" step="0.1" min="1" max="5" />
            <span> - </span>
            <ion-input type="number" v-model.number="setToGoTimeMax" step="0.1" min="1" max="5" />
          </div>
        </ion-item>
      </ion-list>

      <ion-button expand="full" @click="saveSettings">Guardar Configuración</ion-button>
      <ion-button expand="full" color="danger" @click="resetSettings">Restablecer</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import MenuComponent from '@/components/MenuComponent.vue';

//variables para configuracion
const onyourmarksToSetTime = ref(5.0); 
const setToGoTimeMin = ref(2.0);
const setToGoTimeMax = ref(3.0);

//se carga la configuración si existe
onMounted(() => {
  onyourmarksToSetTime.value = Number(localStorage.getItem("onyourmarksToSetTime")) || 5.0;
  setToGoTimeMin.value = Number(localStorage.getItem("setToGoTimeMin")) || 2.0;
  setToGoTimeMax.value = Number(localStorage.getItem("setToGoTimeMax")) || 3.0;
});

//se guarda
const saveSettings = () => {
  localStorage.setItem("onyourmarksToSetTime", String(onyourmarksToSetTime.value));
  localStorage.setItem("setToGoTimeMin", String(setToGoTimeMin.value));
  localStorage.setItem("setToGoTimeMax", String(setToGoTimeMax.value));
};

//restablece valores
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
.time-range {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
