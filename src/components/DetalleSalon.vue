<script setup>
import { ref } from 'vue';
import { useStoreSalon } from '../stores/salon.js';
import { useRouter } from 'vue-router';

const useSalon = useStoreSalon();
const router = useRouter();

const detalleSalon = ref(useSalon.detalleSalon);

const goBack = () => {
  if (useSalon.devolverHomeDetalle === true) {
    router.push('/home');
    useSalon.devolverHomeDetalle = false;
  } else {
    router.push('/busqueda');
  }
};
</script>

<template>
  <q-page class="detalle-salon">
    <q-card class="my-card" style="margin-left: 50px;" flat>
      <q-card-section class="q-pa-md">
        <!-- Encabezado con botón de regreso -->
        <div class="header">
          <q-btn flat color="dark" class="back-button" @click="goBack">
            <i class="fas fa-arrow-left fa-2x"></i>
          </q-btn>
        </div>
        <div style="display: flex; width: 100%; flex-direction: column;">
          <div v-if="detalleSalon.galeria_sal.length" class="gallery-banner-container">
            <!-- Galería de imágenes -->
            <div class="gallery">
              <q-img v-if="detalleSalon.galeria_sal[0]" :src="detalleSalon.galeria_sal[0].url" class="gallery-image-large"
                :alt="detalleSalon.nombre_sal" :ratio="16 / 9" />
              <div class="gallery-column">
                <q-img v-for="(image, index) in detalleSalon.galeria_sal.slice(1, 4)" :key="image.publicId"
                  :src="image.url" class="gallery-image-small" :alt="detalleSalon.nombre_sal" :ratio="16 / 9" />
              </div>
            </div>
          </div>
          <!-- Banner de información -->
          <q-banner class="q-mb-md banner-info fixed-banner">
            <h2 class="title text-bold">{{ detalleSalon.nombre_sal }}</h2>
            <q-item-label class="precio">Precio: {{ detalleSalon.precio_sal }}</q-item-label>
            <q-item-label class="capacidad">Capacidad: {{ detalleSalon.capacidad_max }} personas</q-item-label>
            <q-item-label class="direccion">Dirección: {{ detalleSalon.direccion_sal }}</q-item-label>
            <div style="display: flex; justify-content: center;">
              <q-btn class="btn">Pedir información...</q-btn>
            </div>

          </q-banner>
        </div>


        <!-- Descripción -->
        <q-card-section class="description">
          <h2 class="text-bold">Descripción</h2>
          <p>{{ detalleSalon.descripcion_sal }}</p>
        </q-card-section>

        <q-separator />

        <!-- Espacios -->
        <q-expansion-item class="q-mt-md" label="ESPACIOS" expand-separator :default-opened="true">
          <q-list>
            <q-item v-for="espacio in detalleSalon.idEspaciosSalon" :key="espacio._id"
              style="display: flex; align-items: center; gap: 5px;">
              <q-icon name="check_circle" color="green" />
              <q-item-section>{{ espacio.nombre_esp }}</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Servicios -->
        <q-expansion-item class="q-mt-md" label="SERVICIOS" expand-separator :default-opened="true">
          <q-list>
            <q-item v-for="servicio in detalleSalon.idServiciosSalon" :key="servicio._id"
              style="display: flex; align-items: center; gap: 5px;">
              <q-icon name="check_circle" color="green" />
              <q-item-section>{{ servicio.nombre_serv }}</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Ubicación -->
        <q-expansion-item class="q-mt-md" label="UBICACION" expand-separator :default-opened="true">
          <q-list>
            <q-item v-for="tipo in detalleSalon.idTipoSalon" :key="tipo._id"
              style="display: flex; align-items: center; gap: 5px;">
              <q-icon name="check_circle" color="green" />
              <q-item-section>{{ tipo.nombre_tip }}</q-item-section>
            </q-item>
            <q-item v-for="ubicacion in detalleSalon.idUbicacionSalon" :key="ubicacion._id"
              style="display: flex; align-items: center; gap: 5px;">
              <q-icon name="check_circle" color="green" />
              <q-item-section>{{ ubicacion.nombre_ubi }}</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-separator />

        <q-card-section class="reglamento">
          <h2 class="text-bold">Reglamento</h2>
        </q-card-section>

      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped>
.detalle-salon {
  height: 100%;
  width: 100%;
}

.my-card {
  max-width: 900px;
  width: 100%;
}

.title {
  font-size: 2rem;
  margin: 0;
}

.precio {
  font-size: 1.2rem;
  color: black;
}

.btn {
  margin-top: 20px;
  background-color: black;
  color: white;

}



.tipo,
.capacidad,
.reglamento,
.direccion {
  font-size: 1rem;
  color: #000000;
}

.gallery-banner-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.gallery {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.gallery-image-large {
  flex: 3;
  margin-right: 10px;
}

.gallery-column {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
}

.gallery-image-small {
  width: 100%;
}

/* Banner fijo */
.fixed-banner {
  position: fixed;
  top: 200px;
  right: 100px;
  width: 400px;
  gap: 20px;
  /* Ajusta el ancho según sea necesario */
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
  z-index: 1000;
}

.q-expansion-item {
  border-radius: 8px;
}

.description,
.reglamento {
  margin-top: 20px;
}

.description h2,
.reglamento h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}
</style>
