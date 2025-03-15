<template>
  <ion-page>
    <ion-header></ion-header>
    <ion-content :fullscreen="true">
      <div class="container">
        <ion-title class="title">Speed Reaction</ion-title>
      </div>
      <div class="button-container">
        <ion-button @click="goRegister" class="button1">Registro</ion-button>
        <ion-button @click="goLogin" class="button2">Iniciar sesión</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonContent, IonButton, IonTitle } from '@ionic/vue';
import {useRouter} from "vue-router";

const router = useRouter();

const goLogin = () => {
  router.push("/login");
}
const goRegister = () => {
  router.push("/register");
}
</script>

<style scoped>
.button-container {
  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom:30px;

}
.button1 {
  --border-radius: 20px;
  width: 80%;
  text-transform: none;
  font-weight:650;
  font-size: 16px;
  --color: black;
  height: 45px;
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
}
ion-content {
  --background: linear-gradient(to top, #000000 50%, #4a4a4a 100%);
}
.title{
  font-weight: 800;
  font-size: 30px;
}

.container{
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 80vh;
}


</style>
