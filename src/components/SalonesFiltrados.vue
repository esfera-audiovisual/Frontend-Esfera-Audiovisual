<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useStoreSalon } from '../stores/salon.js';
import { useStoreEspacioSalon } from '../stores/espacio.js';
import { useStoreServicioSalon } from '../stores/servicio.js';
import { useStoreTipoSalon } from '../stores/tipo.js';
import { useStoreUbicacionSalon } from '../stores/ubicacion.js';
import { useRouter } from 'vue-router';

const useSalon = useStoreSalon();
const useEspacio = useStoreEspacioSalon();
const useServicio = useStoreServicioSalon();
const useTipo = useStoreTipoSalon();
const useUbicacion = useStoreUbicacionSalon();
const router = useRouter();
const salones = ref([]);
const espacios = ref([]);
const servicios = ref([]);
const tiposSalon = ref([]);
const ubicacionesSalon = ref([]);
const espacioselec = ref([]);
const servicioselec = ref([]);
const tiposelec = ref([]);
const ubicacionselec = ref([]);
const ocultarPrecio = ref(true);
const ocultarEspacio = ref(true);
const ocultarServicio = ref(true);
const ocultarTipo = ref(true);
const ocultarUbicacion = ref(true);
const precioMax = ref(0);
const loading = ref(false);
const loadingEspacios = ref(false);
const loadingServicios = ref(false);
const loadingTiposSalon = ref(false);
const loadingUbicacionesSalon = ref(false);
const debounceTimeout = ref(null);
const showLoadingModal = ref(false);
const map = ref(null);  // Referencia para el mapa


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
      // Inicializar el mapa
      initMap();
    }
  } catch (error) {
    console.log(error);
  }
};

const initMap = () => {
  const mapOptions = {
    center: { lat: 6.554824, lng: -73.13412 },  // Coordenadas iniciales (Medellín)
    zoom: 12,
  };

  // Crear el mapa
  map.value = new google.maps.Map(document.getElementById('map'), mapOptions);

  // Añadir marcadores para los salones
  useSalon.salonesFiltrados.forEach(salon => {
    // Convertir latitud y longitud a número con parseFloat
    const lat = parseFloat(salon.idCiudSalonEvento.latitud);
    const lng = parseFloat(salon.idCiudSalonEvento.longitud);

    // Verificar si lat y lng son números válidos
    if (!isNaN(lat) && !isNaN(lng)) {
      const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map.value,
        title: salones.nombre_sal,  // El nombre del salón
      });
    } else {
      console.error(`Invalid coordinates for salon: ${salon.nombre_sal}`);
    }
  });
};


const getEspacios = async () => {
  loadingEspacios.value = true;
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
  } finally {
    loadingEspacios.value = false;
  }
};

const getServicios = async () => {
  loadingServicios.value = true;
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
  } finally {
    loadingServicios.value = false;
  }
};

const getTiposSalon = async () => {
  loadingTiposSalon.value = true;
  try {
    const response = await useTipo.getAll();
    if (useTipo.estatus === 200) {
      tiposSalon.value = response.map((tipo) => ({
        label: tipo.nombre_tip,
        value: tipo._id,
      }));
    }
    console.log(response);
  } catch (error) {
    console.log(error);
  } finally {
    loadingTiposSalon.value = false;
  }
};

const getUbicacionesSalon = async () => {
  loadingUbicacionesSalon.value = true;
  try {
    const response = await useUbicacion.getAll();
    if (useUbicacion.estatus === 200) {
      ubicacionesSalon.value = response.map((ubicacion) => ({
        label: ubicacion.nombre_ubi,
        value: ubicacion._id,
      }));
    }
    console.log(response);
  } catch (error) {
    console.log(error);
  } finally {
    loadingUbicacionesSalon.value = false;
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

const mostrarTipo = () => {
  ocultarTipo.value = !ocultarTipo.value;
};

const mostrarUbicacion = () => {
  ocultarUbicacion.value = !ocultarUbicacion.value;
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

const iconoTipo = computed(() => {
  return ocultarTipo.value ? 'arrow_drop_down' : 'arrow_right';
});

const iconoUbicacion = computed(() => {
  return ocultarUbicacion.value ? 'arrow_drop_down' : 'arrow_right';
});


function verDetalleSalon(salon) {
  useSalon.detalleSalon = salon;
  console.log(useSalon.detalleSalon)
  useSalon.salonFiltroCiudadNombre = "";
  useSalon.salonFiltroCiudad = "";
  useSalon.salonFiltroAmbienteNombre = "";
  useSalon.salonFiltroAmbiente = "";
  useSalon.salonFiltroPersona = "";
  useSalon.salonFiltroFecha = "";
  useSalon.salonFiltroPrecio = "";
  useSalon.salonFiltroEspacio = [];
  useSalon.salonFiltroServicio = [];
  useSalon.salonFiltroTipo = [];
  useSalon.salonFiltroUbicacion = [];
  const url = router.resolve({ path: '/detalle-salon' }).href;
  window.open(url, '_blank');

}

const filtrarSalones = async () => {
  showLoadingModal.value = true;
  loading.value = true;

  const filters = {
    idCiudSalonEvento: useSalon.salonFiltroCiudad || null,
    idAmbienteSalon: useSalon.salonFiltroAmbiente || null,
    capacidad_sal: useSalon.salonFiltroPersona || null,
    precio_sal: precioMax.value || null,
    idEspaciosSalon: espacioselec.value.length > 0 ? espacioselec.value.join(',') : null,
    idServiciosSalon: servicioselec.value.length > 0 ? servicioselec.value.join(',') : null,
    idTipoSalon: tiposelec.value.length > 0 ? tiposelec.value.join(',') : null,
    idUbicacionSalon: ubicacionselec.value.length > 0 ? ubicacionselec.value.join(',') : null,
  };


  try {
    console.log("soy salones-filtros.vue", filters)
    const filteredSalones = await useSalon.getSalonesFiltrados(filters);
    useSalon.salonesFiltrados = filteredSalones;
    initMap();
    console.log('Salones filtrados:', filteredSalones);
  } catch (error) {
    console.error("Error al filtrar salones:", error);
  } finally {
    showLoadingModal.value = false;
    loading.value = false;
  }
};


const debouncedFiltrarSalones = debounce(filtrarSalones, 1200);


watch(precioMax, () => {
  useSalon.salonFiltroPrecio = precioMax.value;
  debouncedFiltrarSalones();
});

watch(espacioselec, () => {
  useSalon.salonFiltroEspacio = espacioselec.value;
  debouncedFiltrarSalones();
});

watch(servicioselec, () => {
  useSalon.salonFiltroServicio = servicioselec.value;
  debouncedFiltrarSalones();
});

watch(tiposelec, () => {
  useSalon.salonFiltroTipo = tiposelec.value;
  debouncedFiltrarSalones();
});

watch(ubicacionselec, () => {
  useSalon.salonFiltroUbicacion = ubicacionselec.value;
  debouncedFiltrarSalones();
});

onMounted(() => {
  precioMax.value = useSalon.salonFiltroPrecio;
  espacioselec.value = useSalon.salonFiltroEspacio;
  servicioselec.value = useSalon.salonFiltroServicio;
  tiposelec.value = useSalon.salonFiltroTipo;
  ubicacionselec.value = useSalon.salonFiltroUbicacion;

  getSalones();
  getEspacios();
  getServicios();
  getTiposSalon();
  getUbicacionesSalon();
});
</script>

<template>
  <div class="">
    <div class="q-gutter-md" style="display: flex; width: 100%;">
      <q-dialog v-model="showLoadingModal" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-spinner color="primary" size="30px" />
            <span class="q-ml-sm">Cargando salones...</span>
          </q-card-section>
        </q-card>
      </q-dialog>
      <!-- Botón para mostrar/ocultar filtros -->
      <div style="display: flex; flex-direction: column;">
        <div class="filtros">
          <div>
            <div style="display: flex; align-items: center; margin: 0;">
              <h6 class="text-bold" style="margin-left: 20px;">Precio máximo</h6>
              <q-btn flat round :icon="iconoPrecio" @click="mostrarPrecio" style="height: 15px; width: 15px;" />
            </div>
            <div class="filtroprecio" v-if="ocultarPrecio">
              <q-input v-model="precioMax" class="q-ml-md"></q-input>
              <div class="precio-range q-ml-md">
                <q-slider v-model="precioMax" :min="0" :max="1000000" :step="10000" label color="dark"
                  track-color="grey-4" class="custom-slider" />
              </div>
            </div>
          </div>

          <hr>

          <div class="filtrotipo">
            <div style="display: flex; align-items: center; margin: 0;">
              <h6 class="text-bold" style="margin-left: 20px;">Tipo salón</h6>
              <q-btn flat round :icon="iconoTipo" @click="mostrarTipo" style="height: 15px; width: 15px;" />
            </div>
            <!-- Loading Espacios -->
            <div v-if="loadingTiposSalon" class="loading-container">
              <q-spinner color="dark" size="2em" />
              <p>Cargando tipos salon...</p>
            </div>
            <!-- Lista de Espacios con Checkboxes -->
            <div v-if="ocultarTipo && !loadingTiposSalon">
              <ul class="q-pl-md">
                <li v-for="tipo in tiposSalon" :key="tipo.value" class="list-item">
                  <input type="checkbox" v-model="tiposelec" :value="tipo.value">
                  <label>{{ tipo.label }}</label>
                </li>
              </ul>
            </div>
          </div>

          <hr>

          <div class="filtroubicacion">
            <div style="display: flex; align-items: center; margin: 0;">
              <h6 class="text-bold" style="margin-left: 20px;">Ubicación salon</h6>
              <q-btn flat round :icon="iconoUbicacion" @click="mostrarUbicacion" style="height: 15px; width: 15px;" />
            </div>
            <!-- Loading Espacios -->
            <div v-if="loadingUbicacionesSalon" class="loading-container">
              <q-spinner color="dark" size="2em" />
              <p>Cargando ubicaciones salon...</p>
            </div>
            <!-- Lista de Espacios con Checkboxes -->
            <div v-if="ocultarUbicacion && !loadingUbicacionesSalon">
              <ul class="q-pl-md">
                <li v-for="ubicacion in ubicacionesSalon" :key="ubicacion.value" class="list-item">
                  <input type="checkbox" v-model="ubicacionselec" :value="ubicacion.value">
                  <label>{{ ubicacion.label }}</label>
                </li>
              </ul>
            </div>
          </div>

          <hr>

          <div class="filtroespacio">
            <div style="display: flex; align-items: center; margin: 0;">
              <h6 class="text-bold" style="margin-left: 20px;">Espacios</h6>
              <q-btn flat round :icon="iconoEspacio" @click="mostrarEspacio" style="height: 15px; width: 15px;" />
            </div>
            <!-- Loading Espacios -->
            <div v-if="loadingEspacios" class="loading-container">
              <q-spinner color="dark" size="2em" />
              <p>Cargando espacios...</p>
            </div>
            <!-- Lista de Espacios con Checkboxes -->
            <div v-if="ocultarEspacio && !loadingEspacios">
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
            <!-- Loading Servicios -->
            <div v-if="loadingServicios" class="loading-container">
              <q-spinner color="dark" size="2em" />
              <p>Cargando servicios...</p>
            </div>
            <!-- Lista de Servicios con Checkboxes -->
            <div v-if="ocultarServicio && !loadingServicios">
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
      <div class="container">
        <div class="content-wrapper">
          <!-- Columna izquierda: Cards de los salones -->
          <div class="salones-container">
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
                      <div class="text-h6 text-bold">{{ salon.nombre_sal }}</div>
                      <div class="text-subtitle2">
                        <q-icon name="location_on" size="18px" />
                        {{ salon.idCiudSalonEvento.nombre_ciud }}, {{ salon.idCiudSalonEvento.idDepart.nombre_depart }}
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
                        {{ salon.capacidad_min }} a {{ salon.capacidad_max }}
                      </div>
                      <div class="row justify-end">
                        <q-btn color="primary" label="Ver información..." size="md" @click="verDetalleSalon(salon)" />
                      </div>
                    </q-card-section>
                  </div>
                </q-card>
              </div>
            </div>
          </div>

          <!-- Columna derecha: Mapa -->
          <div class="map-container">
            <div id="map" style="width: 100%; height: 100%;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
  /* Asegura que ocupe toda la altura de la pantalla */
  gap: 20px;
}

.salones-container {
  flex: 1;
  /* Esto permitirá que el contenedor de salones ocupe la mitad o más del espacio disponible */
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  /* Hacer scroll si hay muchas cards */
}

.map-container {
  flex: 1;
  /* Esto permitirá que el mapa ocupe el espacio restante */
  height: 100%;
}

.salon-card {
  margin-bottom: 20px;
  /* Espacio entre las cards */
}

/* Estilos responsive: En pantallas pequeñas, el mapa irá debajo de las cards */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }

  .map-container {
    height: 400px;
    /* Altura fija en pantallas más pequeñas */
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
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
  width: 20px;
  height: 20px;
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