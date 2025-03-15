<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Sonidos</ion-title>
          <MenuComponent/>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true" class="ion-padding">
       
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, } from '@ionic/vue';
  import MenuComponent from "@/components/MenuComponent.vue";

  </script>