<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Registro</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-input v-model="name" type="text" label="Nombre"></ion-input>
          <ion-input v-model="email" type="email" label="Correo"></ion-input>
          <ion-input v-model="password" type="password" label="Contraseña"></ion-input>
          <ion-button expand="full" @click="handleRegister">Registrarse</ion-button>
        </ion-card-content>
      </ion-card>
      <ion-text>
        ¿Ya tienes cuenta?
        <router-link to="/login">Inicia sesión</router-link>
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonInput, IonButton, IonCardTitle, IonCardContent, IonCard, IonCardHeader,IonText } from '@ionic/vue';

import { ref } from "vue";
import { register } from "@/services/auth";
import { useRouter } from "vue-router";

const name = ref("");
const email = ref("");
const password = ref("");
const router = useRouter();

const handleRegister = async () => {
  try {
    console.log(name,email,password);
    await register(name.value, email.value, password.value);
    await router.push("/tabs/tab1");
  } catch (error) {
    alert("Error al registrarse");
  }
};
</script>
