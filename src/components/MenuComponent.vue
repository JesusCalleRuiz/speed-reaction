<template>
  <ion-buttons slot="end">
    <ion-button @click="openPopover">
      <ion-icon :icon="ellipsisVertical"></ion-icon>
    </ion-button>
    <ion-popover :is-open="isOpen" :event="popoverEvent" @didDismiss="isOpen = false">
      <ion-content>
        <ion-list>
          <ion-item :button="true" :detail="false" @click="goToTimes">Tiempos</ion-item>
          <ion-item :button="true" :detail="false" @click="goToSounds">Sonidos</ion-item>
          <ion-item :button="true" :detail="false" @click="goToSensibility">Sensibilidad</ion-item>
          <ion-item :button="true" :detail="false" @click="logout">Cerrar Sesión</ion-item>
        </ion-list>
      </ion-content>
    </ion-popover>
  </ion-buttons>
</template>
<script setup lang="ts">

import { ref } from "vue";
import { IonContent, IonButton, IonIcon, IonItem, IonList, IonPopover, IonButtons } from "@ionic/vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { ellipsisVertical } from "ionicons/icons";

const router = useRouter();
const isOpen = ref(false);
const popoverEvent = ref<Event | null>(null);

const openPopover = (event: Event) => {
  popoverEvent.value = event;
  isOpen.value = true;
};
const goToSounds = () => {
  isOpen.value = false;
  router.push("/sounds");
};
const goToTimes = () => {
  isOpen.value = false;
  router.push("/times");
};
const goToSensibility = () => {
  isOpen.value = false;
  router.push("/sensivility");
};
const logout = async () => {
  isOpen.value = false;
  try {
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    await axios.post("http://localhost:8000/api/logout");
    localStorage.removeItem("token");
    await router.push("/login");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("Error al cerrar sesión. Inténtalo de nuevo.");
  }
};
</script>
