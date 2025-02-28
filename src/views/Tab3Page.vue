<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Top Global</ion-title>
        <MenuComponent/>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="loading" class="loading">Cargando...</div>
      <ion-list v-else-if="time.length > 0">
        <ion-item v-for="time in time" :key="time.id">
          <ion-label class="time-label">
            <div class="time-value">{{ time.times }}s</div>
            <div class="time-date">
              <span class="date">{{ time.name }}</span>
              <span class="date">{{ formatDate(time.created_at) }}</span>
            </div>
          </ion-label>
        </ion-item>
      </ion-list>
      <div v-else class="no-data">No existen tiempos registrados</div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/vue';
import axios from 'axios';
import MenuComponent from "@/components/MenuComponent.vue";
import eventBus from "@/eventBus";


const time = ref<{ id: number; times: number; name: string ;created_at: string }[]>([]);
const loading = ref(true);

// Función para obtener los tiempos del usuario
const getTimes = async () => {
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.get('https://speedreaction.dev-alicenter.es/api/times');
    time.value = response.data.data; // Suponiendo que el backend devuelve un array de tiempos
    console.log(response.data.data);
  } catch (e) {
    console.error("Error al recibir los tiempos:", e);
  } finally {
    loading.value = false;
  }
};

// Formatear la fecha
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString(); // Formato legible
};

// Cargar datos al montar el componente
onMounted(() => {
  getTimes();
  eventBus.on("refreshTimes", getTimes);
});

onUnmounted(() => {
  eventBus.off("refreshTimes", getTimes);
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
  font-size: 1.5rem; /* Tamaño grande */
  font-weight: bold; /* Negrita */
}

.time-date {
  text-align: right;
  color: gray;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
}
</style>
