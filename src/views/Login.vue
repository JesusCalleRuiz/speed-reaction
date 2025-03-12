<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-card class="container">
        <ion-card-header>
          <ion-card-title>Iniciar Sesión</ion-card-title>
        </ion-card-header>
        <ion-card-content class="content">
          <ion-input class="input" v-model="email" type="email" label="Correo" label-placement="floating"></ion-input>
          <ion-input class="input" v-model="password" type="password" label="Contraseña" label-placement="floating"></ion-input>
          <ion-button class="boton1"  @click="handleLogin">Entrar</ion-button>
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
<style scoped>
.container{
  border-radius: 10px;
  padding: 20px;
}
.input{
  background-color: black;
  border-radius: 10px;
  margin-bottom: 20px;
  ;
}
.boton1{

  width:100%;
}

</style>
