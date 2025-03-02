<template>
  <ion-app>
    <ion-menu side="end" content-id="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menu Content</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        This is the menu content.
      </ion-content>
    </ion-menu>
    <ion-router-outlet id="main-content"/>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, IonMenu, IonTitle,IonToolbar,IonHeader,IonContent } from '@ionic/vue';
</script>
