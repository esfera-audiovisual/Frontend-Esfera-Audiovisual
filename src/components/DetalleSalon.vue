<script setup>
import { ref } from 'vue';
import { useStoreSalon } from '../stores/salon.js';
import { useRouter } from 'vue-router';

const useSalon = useStoreSalon();
const router = useRouter();

const detalleSalon = ref(useSalon.detalleSalon)

const goBack = () => {
    router.push('/busqueda');
};
</script>

<template>
    <q-page class="detalle-salon">
      <q-card class="my-card" flat>
        <q-card-section class="q-pa-md">
          <!-- Header with Back Button -->
          <div class="header">
            <q-btn flat color="dark" class="back-button" @click="goBack">
              <i class="fas fa-arrow-left fa-2x"></i>
            </q-btn>
          </div>
  
          <!-- Gallery and Banner -->
          <div v-if="detalleSalon.galeria_sal.length" class="gallery-banner-container">
            <!-- Gallery -->
            <div class="gallery">
              <q-img
                v-if="detalleSalon.galeria_sal[0]"
                :src="detalleSalon.galeria_sal[0].url"
                class="gallery-image-large"
                :alt="detalleSalon.nombre_sal"
                :ratio="16 / 9"
              />
              <div class="gallery-grid">
                <q-img
                  v-for="(image, index) in detalleSalon.galeria_sal.slice(1, 4)"
                  :key="image.publicId"
                  :src="image.url"
                  class="gallery-image-small"
                  :alt="detalleSalon.nombre_sal"
                  :ratio="16 / 9"
                />
              </div>
            </div>
  
            <!-- Banner -->
            <q-banner class="q-mb-md banner-info">
              <h1 class="title">{{ detalleSalon.nombre_sal }}</h1>
              <q-item-label class="precio">Precio: {{ detalleSalon.precio_sal }}</q-item-label>
              <q-item-label class="capacidad">Capacidad: {{ detalleSalon.capacidad_max }} personas</q-item-label>
              <q-item-label class="direccion">Dirección: {{ detalleSalon.direccion_sal }}</q-item-label>
            </q-banner>
          </div>
  
          <!-- Description -->
          <q-card-section class="description">
            <h2>Descripción</h2>
            <p>{{ detalleSalon.descripcion_sal }}</p>
          </q-card-section>
  
          <q-separator />
  
          <!-- Espacios -->
          <q-expansion-item class="q-mt-md" label="Espacios" expand-separator :default-opened="true">
            <q-list>
              <q-item v-for="espacio in detalleSalon.idEspaciosSalon" :key="espacio._id">
                <q-item-section>{{ espacio.nombre_esp }}</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
  
          <!-- Servicios -->
          <q-expansion-item class="q-mt-md" label="Servicios" expand-separator :default-opened="true">
            <q-list>
              <q-item v-for="servicio in detalleSalon.idServiciosSalon" :key="servicio._id">
                <q-item-section>{{ servicio.nombre_serv }}</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  


<style scoped>
.detalle-salon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.my-card {
    max-width: 900px;
    width: 100%;
}

.header {
    position: relative;
    text-align: center;
}

.title {
    font-size: 2rem;
    margin: 0;
}

.precio {
    font-size: 1.2rem;
    color: #007bff;
}

.tipo,
.capacidad,
.direccion {
    font-size: 1rem;
    color: #6c757d;
}

.back-button {
    position: fixed;
    left: 10px;
}

.gallery-banner-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.gallery {
  flex: 2;
  margin-right: 20px;
}

.banner-info {
  flex: 1;
}

.gallery-image-large {
  width: 100%;
  margin-bottom: 10px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.gallery-image-small {
  width: 100%;
}

.q-expansion-item {
  border-radius: 8px;
}



.description {
    margin-top: 20px;
}

.description h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
}

.description p {
    font-size: 1rem;
    color: #343a40;
}

.q-expansion-item {
    border-radius: 8px;
}
</style>
