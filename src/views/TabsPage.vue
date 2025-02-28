<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="isSelected('tab1') ? stopWatch : stopWatchOutline" />
          <ion-label>Registrar</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="isSelected('tab2') ? listFilled : listoutline" />
          <ion-label>Tiempos</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon aria-hidden="true" :icon="isSelected('tab3') ? globeFilled : globeoutline" />
          <ion-label>Global</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import {globe, list, stopwatch, stopwatchOutline, listOutline, globeOutline} from 'ionicons/icons';
import { onMounted, onUnmounted } from 'vue';
import { useBackButton } from '@ionic/vue';
import { useRoute } from 'vue-router';

// Obtener la ruta actual
const route = useRoute();

// Computed para verificar qué tab está activa
const isSelected = (tabName: string) => {
  return route.path.includes(tabName);
};
const stopWatch = stopwatch;
const stopWatchOutline = stopwatchOutline;
const listFilled = list;
const listoutline = listOutline
const globeFilled = globe;
const globeoutline = globeOutline;

//bloqueo de botón atrás
onMounted(() => {
  useBackButton(9999, () => {
    console.log("Botón de atrás bloqueado en las tabs");
  });
});

//restaurar el botón de atrás
onUnmounted(() => {
  useBackButton(9999, () =>{
  });
});
</script>
