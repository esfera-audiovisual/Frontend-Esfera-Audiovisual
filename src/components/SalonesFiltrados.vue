<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useStoreSalon } from '../stores/salon.js';
import { useStoreEspacioSalon } from '../stores/espacio.js';
import { useStoreServicioSalon } from '../stores/servicio.js';
import { useRouter } from 'vue-router';

const useSalon = useStoreSalon();
const useEspacio = useStoreEspacioSalon();
const useServicio = useStoreServicioSalon();
const router = useRouter();
const salones = ref([]);
const espacios = ref([]);
const servicios = ref([]);
const espacioselec = ref([]);
const servicioselec = ref([]);
const loading = ref(false);
const ocultarPrecio = ref(true);
const ocultarEspacio = ref(true);
const ocultarServicio = ref(true);
const precioMax = ref(0);
let debounceTimeout = ref(null);

function debounce(fn, delay) {
  return (...args) => {
    clearTimeout(debounceTimeout.value);
    debounceTimeout.value = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const getNombresAmbiente = (idAmbienteSalon) => {
  if (idAmbienteSalon && idAmbienteSalon.length > 0) {
    return idAmbienteSalon.map((ambiente) => ambiente.nombre_amb).join(', ');
  } else {
    return 'No hay ambiente asignado';
  }
};

const cambioFiltroEspacio = async () => {
  console.log(espacioselec.value);
};

const cambioFiltroServicio = async () => {
  console.log(servicioselec.value);
};

const getSalones = async () => {
  try {
    const response = await useSalon.getAll();
    if (useSalon.estatus === 200) {
      salones.value = response;
    }
    console.log(response);
  } catch (error) {
    console.log(error);
  } 
};

const getEspacios = async () => {
  try {
    const response = await useEspacio.getAll();
    if (useEspacio.estatus === 200) {
      espacios.value = response.map((espacio) => ({
        label: espacio.nombre_esp,
        value: espacio._id,
      }));
    }
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const getServicios = async () => {
  try {
    const response = await useServicio.getAll();
    if (useServicio.estatus === 200) {
      servicios.value = response.map((servicio) => ({
        label: servicio.nombre_serv,
        value: servicio._id,
      }));
    }
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const mostrarPrecio = () => {
  ocultarPrecio.value = !ocultarPrecio.value;
};

const mostrarEspacio = () => {
  ocultarEspacio.value = !ocultarEspacio.value;
};

const mostrarServicio = () => {
  ocultarServicio.value = !ocultarServicio.value;
};

const iconoPrecio = computed(() => {
  return ocultarPrecio.value ? 'arrow_drop_down' : 'arrow_right';
});

const iconoEspacio = computed(() => {
  return ocultarEspacio.value ? 'arrow_drop_down' : 'arrow_right';
});

const iconoServicio = computed(() => {
  return ocultarServicio.value ? 'arrow_drop_down' : 'arrow_right';
});

const filtrarSalones = async () => {
  loading.value = true; // Mostrar loading antes de filtrar
  const filters = {
    idCiudSalonEvento: useSalon.salonFiltroCiudad || null,
    idAmbienteSalon: useSalon.salonFiltroAmbiente || null,
    capacidad_sal: useSalon.salonFiltroPersona || null,
    precio_sal: precioMax.value || null,
    idEspaciosSalon: espacioselec.value.length > 0 ? espacioselec.value.join(',') : null,
    idServiciosSalon: servicioselec.value.length > 0 ? servicioselec.value.join(',') : null,
  };

  try {
    const filteredSalones = await useSalon.getSalonesFiltrados(filters);
    useSalon.salonesFiltrados = filteredSalones;

    console.log('Salones filtrados:', filteredSalones);
  } catch (error) {
    console.error("Error al filtrar salones:", error);
  } finally {
    loading.value = false; // Ocultar loading después de filtrar
  }
};



const debouncedFiltrarSalones = debounce(filtrarSalones, 300);

watch(precioMax, () => {
  console.log(precioMax.value);
  useSalon.salonFiltroPrecio = precioMax.value;
  debouncedFiltrarSalones();
});

watch(espacioselec, () => {
  console.log(espacioselec.value);
  useSalon.salonFiltroEspacio = espacioselec.value;
  filtrarSalones();
});

watch(servicioselec, () => {
  console.log(servicioselec.value);
  useSalon.salonFiltroServicio = servicioselec.value;
  filtrarSalones();
});

onMounted(() => {
  getSalones();
  getEspacios();
  getServicios();
});
</script>


<template>
  <div class="">
    <div v-if="loading" class="loading-container">
      <q-spinner color="dark" size="3em" />
      <p>Cargando salones...</p>
    </div>
    <div v-else class="q-gutter-md" style="display: flex; width: 100%;">

      <!-- Botón para mostrar/ocultar filtros -->
      <div style="display: flex; flex-direction: column;">
        <div class="filtros">
          <div>
            <div style="display: flex; align-items: center; margin: 0;">
              <h6 class="text-bold" style="margin-left: 20px;">Precio máximo</h6>
              <q-btn flat round :icon="iconoPrecio" @click="mostrarPrecio" style="height: 15px; width: 15px;" />
            </div>
            <div class="filtroprecio" v-if="ocultarPrecio">
              <q-input v-model="precioMax" class="q-ml-md">{{ precioMax }}</q-input>
              <div class="precio-range q-ml-md">
                <q-slider v-model="precioMax" :min="0" :max="1000000" :step="10000" label color="dark"
                  track-color="grey-4" class="custom-slider" />
              </div>
            </div>
          </div>

          <hr>

          <div class="filtroespacio">
            <div style="display: flex; align-items: center; margin: 0;">
              <h6 class="text-bold" style="margin-left: 20px;">Espacios</h6>
              <q-btn flat round :icon="iconoEspacio" @click="mostrarEspacio" style="height: 15px; width: 15px;" />
            </div>
            <!-- Lista de Espacios con Checkboxes -->
            <div v-if="ocultarEspacio">
              <ul class="q-pl-md">
                <li v-for="espacio in espacios" :key="espacio.value" class="list-item">
                  <input type="checkbox" v-model="espacioselec" :value="espacio.value" @change="cambioFiltroEspacio">
                  <label>{{ espacio.label }}</label>
                </li>
              </ul>
            </div>
          </div>

          <hr>

          <div class="filtroservicio">
            <div style="display: flex; align-items: center; margin: 0;">
              <h6 class="text-bold" style="margin-left: 20px;">Servicios</h6>
              <q-btn flat round :icon="iconoServicio" @click="mostrarServicio" style="height: 15px; width: 15px;" />
            </div>
            <!-- Lista de Espacios con Checkboxes -->
            <div v-if="ocultarServicio">
              <ul class="q-pl-md">
                <li v-for="servicio in servicios" :key="servicio.value" class="list-item">
                  <input type="checkbox" v-model="servicioselec" :value="servicio.value" @change="cambioFiltroServicio">
                  <label>{{ servicio.label }}</label>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      <!-- Salones a la derecha -->
      <div class="salones">
        <div v-if="useSalon.salonesFiltrados.length === 0" class="no-salones">
          <q-icon name="sentiment_dissatisfied" size="5em" color="grey" />
          <p>No se encontraron salones</p>
        </div>

        <div v-else>
          <div v-for="salon in useSalon.salonesFiltrados" :key="salon._id" class="salon-card">
            <q-card class="my-card">
              <div class="card-content">
                <q-img :src="salon.galeria_sal[0].url" class="card-image" />
                <q-card-section class="card-details">
                  <div class="text-h6">{{ salon.nombre_sal }}</div>
                  <div class="text-subtitle2">
                    <q-icon name="location_on" size="18px" />
                    {{ salon.idCiudSalonEvento.nombre_ciud }}, {{
                      salon.idCiudSalonEvento.idDepart.nombre_depart }}
                  </div>
                  <div class="text-subtitle2">
                    <q-icon name="architecture" size="18px" />
                    {{ getNombresAmbiente(salon.idAmbienteSalon) }}
                  </div>
                  <div class="text-subtitle2">
                    <q-icon name="description" size="18px" />
                    {{ salon.descripcion_sal }}
                  </div>
                  <div class="text-subtitle2">
                    <q-icon name="attach_money" size="18px" />
                    {{ salon.precio_sal }}
                  </div>
                  <div class="text-subtitle2">
                    <q-icon name="groups" size="18px" />
                    {{ salon.capacidad_sal }}
                  </div>
                  <div class="row justify-end">
                    <q-btn color="dark" label="Ver información..." size="sm" />
                  </div>
                </q-card-section>
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.q-spinner {
  margin-bottom: 20px;
}

.salones {
  flex: 3;
  display: flex;
  flex-direction: column;
  margin-top: 80px;
  gap: 20px;
  width: 90%;
  margin-left: 80px;
}

.salon-card {
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  /* Ajusta el ancho máximo de la tarjeta */
  display: flex;
  justify-content: start;
}

.my-card {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.card-content {
  display: flex;
  flex-direction: row;
  padding: 0;
}

.card-image {
  flex: 4.5;
  /* Ajusta el ancho de la imagen */
  height: auto;
  /* Ajusta el alto de la imagen automáticamente */
  object-fit: cover;
  border-radius: 8px;
}

.card-details {
  flex: 5.5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 20px;
}

.card-image-container {
  flex: 1;
}

.card-details-container {
  flex: 2;
  padding-left: 20px;
}



.filtros {
  display: flex;
  flex-direction: column;
  margin-top: 80px;
}

.filtroprecio,
.filtroespacio,
.filtroservicio {
  margin-bottom: 5px;
}

.precio-range {
  max-width: 400px;
}

.q-pl-md {
  padding-left: 16px;
}

.text-bold {
  font-weight: bold;
}

.q-btn {
  margin-left: 5px;
  margin-right: 0;
}

.list-item {
  list-style: none;
  margin-bottom: 10px;
}

input[type='checkbox'] {
  margin-right: 10px;
  margin-left: 10px;
}

h6 {
  margin: 0;
  font-size: 1rem;
}

.no-salones {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: grey;
  text-align: center;
}

.no-salones p {
  font-size: 1.5em;
  margin-top: 10px;
}

.q-icon {
  margin-bottom: 10px;
}
</style>