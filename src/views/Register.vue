<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="cont">
      <ion-card class="container">
        <ion-card-content>
          <ion-card-header>
            <ion-card-title class="title">Nombre de usuario</ion-card-title>
          </ion-card-header>
          <ion-input class="input" v-model="name" type="text"></ion-input>
          <ion-card-header>
            <ion-card-title class="title">Correo electrónico</ion-card-title>
          </ion-card-header>
          <ion-input class="input" v-model="email" type="email"></ion-input>
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
          <ion-card-header>
            <ion-card-title class="title">Repite la contraseña</ion-card-title>
          </ion-card-header>
          <ion-input
              class="input"
              v-model="password2"
              :type="showPassword2 ? 'text' : 'password'"
          >
            <ion-button fill="clear" slot="end" @click="togglePasswordVisibility2" aria-label="Show/hide">
              <ion-icon :icon="showPassword2 ? eyeOff : eye" slot="icon-only" aria-hidden="true"></ion-icon>
            </ion-button>
          </ion-input>
          <div class="content">
            <ion-button class="boton1" @click="handleRegister">Registrarse</ion-button>
          </div>
        </ion-card-content>
      </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonInput, IonButton, IonCardTitle, IonCardContent, IonCard, IonCardHeader, IonIcon} from '@ionic/vue';
import { eye, eyeOff } from 'ionicons/icons';
import { ref } from "vue";
import { register } from "@/services/auth";
import { useRouter } from "vue-router";

const name = ref("");
const email = ref("");
const router = useRouter();
const password = ref('');
const password2 = ref('');

const showPassword = ref(false);
const showPassword2 = ref(false);
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
const togglePasswordVisibility2 = () => {
  showPassword2.value = !showPassword2.value;
};

const handleRegister = async () => {
  try {
    console.log(name,email,password,password2);
    const response = await register(name.value, email.value, password.value, password2.value);
    if (response) {
      await router.push("/tabs/tab1");
    }
  } catch (error) {
    //
  }
};
</script>
<style scoped>
.cont {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
}
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
