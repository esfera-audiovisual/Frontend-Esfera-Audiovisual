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
const markers = ref([]);



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
    return idAmbienteSalon.slice(0, 4).map((ambiente) => ambiente.nombre_amb).join(', ');
  } else {
    return 'No hay ambiente asignado';
  }
};

const cambioFiltroEspacio = async () => {
  /* console.log(espacioselec.value); */
};

const cambioFiltroServicio = async () => {
  /* console.log(servicioselec.value); */
};

const getSalones = async () => {
  try {
    const response = await useSalon.getAll();
    if (useSalon.estatus === 200) {
      // Filtrar solo los salones que tienen estado === true
      salones.value = response.filter(salon => salon.estado === true);
      // Inicializar el mapa (solo con salones activos)
      initMap();
    }
  } catch (error) {
    console.log(error);
  }
};


// Función para limpiar los marcadores anteriores
const clearMarkers = () => {
  if (markers.value) {
    markers.value.forEach((marker, index) => {
      marker.setMap(null);  // Eliminar los marcadores del mapa
    });
    markers.value = [];
  }
};

const resetMap = () => {
  if (map.value) {
    map.value = null;
    document.getElementById('map').innerHTML = '';  // Elimina el contenido del div del mapa
  }
};


// Función initMap que actualiza el mapa y los marcadores
const initMap = () => {
  resetMap();  // Reinicia el mapa

  const latCiudad = parseFloat(useSalon.salonCiudLatitud) || 0;
  const lgtCiudad = parseFloat(useSalon.salonCiudLongitud) || 0;

  const mapOptions = {
    center: { lat: latCiudad, lng: lgtCiudad },
    zoom: 12,
  };

  // Crear el mapa nuevamente
  map.value = new google.maps.Map(document.getElementById('map'), mapOptions);

  // Limpiar los marcadores anteriores
  clearMarkers();

  // Añadir nuevos marcadores basados en los salones filtrados
  useSalon.salonesFiltrados.forEach((salon, index) => {
    if (salon.estado === true) {
      const lat = parseFloat(salon.latitud);
      const lng = parseFloat(salon.longitud);

      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: map.value,  // Vincula el marcador al mapa
          title: salon.nombre_sal,  // Título del marcador
        });

        // Crear una InfoWindow con todo el contenido
        const infoWindow = new google.maps.InfoWindow({
          content: `
          <div id="salon-info-${index}" style="cursor: pointer; font-family: Arial, sans-serif; width: 100%; max-width: 250px;">
            <img src="${salon.galeria_sal[0].url}" style="width: 100%; height: auto; border-radius: 8px; object-fit: cover;" alt="${salon.nombre_sal}">
            <div style="padding: 10px; text-align: center;">
              <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">${salon.nombre_sal}</div>
              <div style="font-size: 14px; color: #333; margin-bottom: 8px;">$ ${salon.precio_sal}</div>
            </div>
          </div>
        `,
        });

        // Añadir evento para mostrar la InfoWindow cuando el usuario haga clic en el marcador
        marker.addListener('click', () => {
          infoWindow.open({
            anchor: marker,
            map: map.value,
            shouldFocus: false,
          });

          // Usar google.maps.event para asegurar que el DOM del InfoWindow esté cargado
          google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
            // Agregar el event listener para el click en todo el contenido del InfoWindow
            const infoElement = document.getElementById(`salon-info-${index}`);
            if (infoElement) {
              infoElement.addEventListener('click', () => {
                verDetalleSalon(salon);  // Llamar a la función verDetalleSalon con el salón correspondiente
              });
            }
          });
        });

        // Añadir el marcador al array `markers`
        markers.value.push(marker);
      } else {
        console.error(`Invalid coordinates for salon: ${salon.nombre_sal}`);
      }
    }

  });
};

const getEspacios = async () => {
  loadingEspacios.value = true;
  try {
    const response = await useEspacio.getAll();
    if (useEspacio.estatus === 200) {
      // Filtrar solo los espacios que tienen estado === true
      espacios.value = response
        .filter(espacio => espacio.estado === true)
        .map(espacio => ({
          label: espacio.nombre_esp,
          value: espacio._id,
        }));
    }
    /* console.log(response); */
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
      // Filtrar solo los servicios que tienen estado === true
      servicios.value = response
        .filter(servicio => servicio.estado === true)
        .map(servicio => ({
          label: servicio.nombre_serv,
          value: servicio._id,
        }));
    }
    /* console.log(response); */
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
      // Filtrar solo los tipos de salón que tienen estado === true
      tiposSalon.value = response
        .filter(tipo => tipo.estado === true)
        .map(tipo => ({
          label: tipo.nombre_tip,
          value: tipo._id,
        }));
    }
    /* console.log(response); */
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
      // Filtrar solo las ubicaciones que tienen estado === true
      ubicacionesSalon.value = response
        .filter(ubicacion => ubicacion.estado === true)
        .map(ubicacion => ({
          label: ubicacion.nombre_ubi,
          value: ubicacion._id,
        }));
    }
   /*  console.log(response); */
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
  /* console.log(useSalon.detalleSalon) */
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
  useSalon.idSalonSelec = salon._id;
  const url = router.resolve({ path: '/detalle-salon', query: { id: salon._id } }).href;
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
    /* console.log("soy salones-filtros.vue", filters) */
    const filteredSalones = await useSalon.getSalonesFiltrados(filters);
    useSalon.salonesFiltrados = filteredSalones.filter(salon => salon.estado === true);
    /* console.log('Salones filtrados:', filteredSalones); */
  } catch (error) {
    console.error("Error al filtrar salones:", error);
  } finally {
    showLoadingModal.value = false;
    loading.value = false;
  }
};


function formatPrice(price) {
  if (price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  return price;
}


const debouncedFiltrarSalones = debounce(filtrarSalones, 1200);

watch(() => useSalon.salonFiltroCiudad, (newCity) => {
  if (newCity && useSalon.salonCiudLatitud && useSalon.salonCiudLongitud) {
    // Actualizar el centro del mapa cuando cambia la ciudad
    const newCenter = {
      lat: parseFloat(useSalon.salonCiudLatitud),
      lng: parseFloat(useSalon.salonCiudLongitud)
    };
    map.value.setCenter(newCenter);
    /* console.log("mapaaa", markers) */
    initMap();
  }
});

watch(() => useSalon.salonesFiltrados, (newSalones) => {
  // Limpiar los marcadores anteriores
  initMap();
});



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

const showModalFiltros = ref(false); // Controlar el modal de filtros

// Función para abrir el modal de filtros
const abrirModalFiltros = () => {
  showModalFiltros.value = true;
};

// Detectar el tamaño de la pantalla para ocultar el modal en pantallas grandes
const esPantallaPequena = ref(window.innerWidth <= 600);

const actualizarEsPantallaPequena = () => {
  esPantallaPequena.value = window.innerWidth <= 600;
};

window.addEventListener('resize', actualizarEsPantallaPequena);


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
        <div v-if="!esPantallaPequena" class="filtros">
          <div>
            <div style="display: flex; align-items: center; margin: 0;">
              <h6 class="text-bold" style="margin-left: 20px;">Precio máximo</h6>
              <q-btn flat round :icon="iconoPrecio" @click="mostrarPrecio" style="height: 15px; width: 15px;" />
            </div>
            <div class="filtroprecio" v-if="ocultarPrecio">
              <q-input v-model="precioMax" class="q-ml-md"></q-input>
              <div class="precio-range q-ml-md">
                <q-slider v-model="precioMax" :min="0" :max="10000000" :step="100000" label color="dark"
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

      <!-- Modal para los filtros -->
      <q-dialog v-model="showModalFiltros" persistent>
        <q-card style="width: 90vw; max-width: 500px;">
          <q-card-section>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h6>Filtros</h6>
              <q-btn flat round icon="close" @click="showModalFiltros = false" />
            </div>
            <hr />
            <!-- Colocar aquí tus filtros -->
            <div class="filtros">
              <div>
                <div style="display: flex; align-items: center; margin: 0;">
                  <h6 class="text-bold" style="margin-left: 20px;">Precio máximo</h6>
                  <q-btn flat round :icon="iconoPrecio" @click="mostrarPrecio" style="height: 15px; width: 15px;" />
                </div>
                <div class="filtroprecio" v-if="ocultarPrecio">
                  <q-input v-model="precioMax" class="q-ml-md"></q-input>
                  <div class="precio-range q-ml-md">
                    <q-slider v-model="precioMax" :min="0" :max="10000000" :step="100000" label color="dark"
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
                  <q-btn flat round :icon="iconoUbicacion" @click="mostrarUbicacion"
                    style="height: 15px; width: 15px;" />
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
                      <input type="checkbox" v-model="espacioselec" :value="espacio.value"
                        @change="cambioFiltroEspacio">
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
                      <input type="checkbox" v-model="servicioselec" :value="servicio.value"
                        @change="cambioFiltroServicio">
                      <label>{{ servicio.label }}</label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
      <!-- Salones a la derecha -->
      <div class="container">
        <div class="content-wrapper">
          <div v-if="esPantallaPequena" class="text-center q-mt-lg">
            <q-btn color="primary" icon="filter_list" label="Filtros del Salón" @click="abrirModalFiltros" />
          </div>
          <div class="salones-container">
            <div v-if="useSalon.salonesFiltrados.length === 0" class="no-salones">
              <q-icon name="sentiment_dissatisfied" size="5em" color="grey" />
              <p>No se encontraron salones</p>
            </div>
            <div v-else>
              <div v-for="salon in useSalon.salonesFiltrados" :key="salon._id" class="salon-card">
                <q-card class="my-card">
                  <div class="card-content">
                    <!-- Imagen del salón -->
                    <q-img :src="salon.galeria_sal[0].url" class="card-image" />

                    <!-- Información del salón -->
                    <q-card-section class="card-details">
                      <div class="text-h6 text-bold">{{ salon.nombre_sal }}</div>
                      <div class="text-subtitle2">
                        <q-icon name="location_on" size="18px" />
                        {{ salon.idCiudSalonEvento.nombre_ciud }}, {{ salon.idCiudSalonEvento.idDepart.nombre_depart }}
                      </div>
                      <div class="text-subtitle2">
                        <q-icon name="celebration" size="18px" />
                        {{ getNombresAmbiente(salon.idAmbienteSalon) }}
                      </div>
                      <div class="text-subtitle2">
                        Desde {{ formatPrice(salon.precio_sal) }} $
                      </div>
                      <div class="text-subtitle2" style="display: flex; gap: 10px; align-items: center;">
                        <q-icon name="groups" size="18px" style="margin: 0;" />
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



.map-container {
  flex: 1;
  /* Esto permitirá que el mapa ocupe el espacio restante */
  height: 100%;
}

.salon-card {
  margin-bottom: 25px;
}

.salones-container {
  flex: 1;
  /* Esto permitirá que el contenedor de salones ocupe la mitad o más del espacio disponible */
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  /* Hacer scroll si hay muchas cards */
}

.salones-container::-webkit-scrollbar {
  width: 8px;
}

.salones-container::-webkit-scrollbar-thumb {
  background-color: gray; 
  border-radius: 10px;
}

.salones-container::-webkit-scrollbar-thumb:hover {
  background-color: rgb(0, 0, 0); /* Color cuando pasa el cursor */
}

.salones-container::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 10px;
}

/* Estilos responsive: En pantallas pequeñas, el mapa irá debajo de las cards */
@media (max-width: 1100px) {
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

/* Contenedor principal de la imagen y la información */
.card-content {
  display: flex;
  flex-direction: row;
  /* Por defecto, mostrar en fila */
  padding: 0;
}

/* Estilo de la imagen del salón */
.card-image {
  flex: 4.5;
  max-height: 270px;
  object-fit: cover;
  border-radius: 8px;
}

/* Estilo de los detalles del salón */
.card-details {
  flex: 5.5;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Media query para pantallas menores o iguales a 775px */
@media (max-width: 775px) {
  .card-content {
    flex-direction: column;
    /* Cambia a columna en pantallas pequeñas */
  }

  .card-image {
    max-width: 100%;
    margin-bottom: 15px;
    /* Espacio entre la imagen y la información */
  }

  .card-details {
    padding-left: 0;
    /* Elimina el padding izquierdo */
  }
}

.my-card {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Estilos para pantallas menores a 600px */
@media (max-width: 600px) {}

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