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
      <ion-list class="container" v-else-if="time.length > 0">
        <ion-item
            v-for="(entry, index) in time"
            :key="entry.id"
            :class="getClass(index)"
        >
          <ion-label class="time-label">
            <div class="time-rank">
              <span v-if="index === 0">🏆</span>
              <span v-else-if="index === 1">🥈</span>
              <span v-else-if="index === 2">🥉</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="time-value">{{ entry.times }}s</div>
            <div class="time-date">
              <span class="time-date-podium" v-if="index === 0 || index === 1 || index === 2">{{ entry.name }}</span>
              <span v-else>{{ entry.name }}</span>
              <span class="time-date-podium" v-if="index === 0 || index === 1 || index === 2">{{ formatDate(entry.created_at) }}</span>
              <span v-else>{{ formatDate(entry.created_at) }}</span>
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

const getTimes = async () => {
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.get('https://speedreaction.dev-alicenter.es/api/times');
    time.value = response.data.data;
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

const getClass = (index: number) => {
  if (index === 0) return "gold";
  if (index === 1) return "silver";
  if (index === 2) return "bronze";
  return "";
};

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

.time-rank {
  font-size: 1.5rem;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}

.time-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.time-date {
  text-align: right;
  color: gray;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
}
.time-date-podium {
  text-align: right;
  color: #000000;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
}

.gold {
  --background: gold !important;
  color: black;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.silver {
  --background: silver !important;
  color: black;
}

.bronze {
  --background: #cd7f32 !important;
  color: black;
}
.container{
  border-radius: 10px;
}
</style>
