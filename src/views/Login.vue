<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-card class="container">
        <ion-card-content>
          <ion-card-header>
            <ion-card-title class="title">Correo electrónico o nombre de usuario</ion-card-title>
          </ion-card-header>
          <ion-input class="input" v-model="email"></ion-input>
          <ion-card-header>
            <ion-card-title class="title">Contraseña</ion-card-title>
          </ion-card-header>
          <ion-input
              class="input"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
          >
            <ion-button fill="clear" slot="end" @click="togglePasswordVisibility" aria-label="Show/hide">
              <ion-icon :icon="showPassword ? eyeOff : eye" slot="icon-only" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-input>
          <div class="content">
            <ion-button class="boton1"  @click="handleLogin">Iniciar sesión</ion-button>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonInput, IonButton, IonCardTitle, IonCardContent, IonCard, IonCardHeader, IonIcon } from '@ionic/vue';
import { ref } from "vue";
import { login } from "@/services/auth";
import { useRouter } from "vue-router";
import { eye, eyeOff } from 'ionicons/icons';

const email = ref("");
const router = useRouter();
const password = ref('');
const showPassword = ref(false);
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  try {
    const response = await login(email.value, password.value);
    if(response){
      await router.push("/tabs/tab1");
    }
  } catch (error) {
    //
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
  font-size: 18px;
  font-weight:600;
  --padding-start: 20px;
}
.boton1{
  margin-top: 20px;
  --border-radius: 20px;
  width: 70%;
  text-transform: none;
  font-weight:650;
  font-size: 16px;
  --color: black;
  height: 45px;

}
.title{
  font-weight:800;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>
