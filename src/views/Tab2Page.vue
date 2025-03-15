<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tus Tiempos</ion-title>
        <MenuComponent/>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="loading" class="loading">Cargando...</div>
      <ion-list class="container" v-else-if="times.length > 0">
        <ion-item v-for="time in times" :key="time.id">
          <ion-label class="time-label">
            <div class="time-value">{{ time.time }}s</div>
            <div class="valid" v-if="time.valid == 1" >VÁLIDA</div>
            <div class="not-valid" v-if="time.valid == 0" >NULA</div>
            <div class="time-date">
              <span class="date">{{ formatDate(time.created_at) }}</span>
            </div>
          </ion-label>
        </ion-item>
      </ion-list>
      <div v-else class="no-data">No tienes tiempos registrados</div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/vue';
import axios from 'axios';
import MenuComponent from "@/components/MenuComponent.vue";
import eventBus from "@/eventBus";


const times = ref<{ id: number; time: number; created_at: string; valid:number }[]>([]);
const loading = ref(true);

const getTimesByUser = async () => {
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.get('https://speedreaction.dev-alicenter.es/api/user/times');
    times.value = response.data.data;
    console.log(response.data.data);
  } catch (e) {
    console.error("Error al recibir los tiempos:", e);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

onMounted(() => {
  getTimesByUser();
  eventBus.on("refreshTimes", getTimesByUser);
});

onUnmounted(() => {
  eventBus.off("refreshTimes", getTimesByUser);
});
</script>

<style scoped>
.loading {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}

.no-data {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
  color: gray;
}
.time-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.time-value {
  font-size: 1.5rem;
  font-weight: bold;
}
.title{
  font-weight:bold;
}

.time-date {
  text-align: right;
  color: gray;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
}
.valid {
  font-size: 0.7rem;
  font-weight: bold;
  color: greenyellow;
  background-color: rgb(7, 76, 0);
  padding: 5px 10px;
  border-radius: 10px;
  text-transform: uppercase;
}
.not-valid {
  font-size: 0.7rem;
  font-weight: bold;
  color: red;
  background-color: rgba(255, 0, 0, 0.2);
  padding: 5px 10px;
  border-radius: 10px;
  text-transform: uppercase;
}
.container{
  border-radius: 10px;
}

</style>
