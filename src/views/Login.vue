<template>
  <ion-page>
    <ion-content :fullscreen="false" class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Iniciar Sesión</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-input v-model="email" type="email" label="Correo"></ion-input>
          <ion-input v-model="password" type="password" label="Contraseña"></ion-input>
          <ion-button expand="full" @click="handleLogin">Entrar</ion-button>
        </ion-card-content>
      </ion-card>
      <ion-text>
        ¿No tienes cuenta? <router-link to="/register">Regístrate</router-link>
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonInput, IonButton, IonCardTitle, IonCardContent, IonCard, IonCardHeader,IonText } from '@ionic/vue';
import { ref } from "vue";
import { login } from "@/services/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();

const handleLogin = async () => {
  try {
    await login(email.value, password.value);
    router.push("/tabs/tab1"); // Redirigir al dashboard después de loguearse
  } catch (error) {
    alert("Error al iniciar sesión");
  }
};
</script>
