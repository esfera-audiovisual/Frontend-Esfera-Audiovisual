<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useStoreCiudad } from '../stores/ciudad.js';
import { useStoreAmbienteSalon } from '../stores/ambiente.js';
import { useStoreSalon } from '../stores/salon.js';
import { useStoreReserva } from '../stores/reserva.js';
import { useStoreUsuarios } from '../stores/usuario.js';
import { router } from '../routes/routes.js';

const useCiudad = useStoreCiudad();
const useAmbiente = useStoreAmbienteSalon();
const useSalon = useStoreSalon();
const useReserva = useStoreReserva();
const useUsuario = useStoreUsuarios();
const fecha = ref("");
const ciudades = ref([]);
const ambientes = ref([]);
const c_personas = ref("");
const ciudad = ref("");
const ambiente = ref("");
const showLoadingModal = ref(false);
const isCleaning = ref(false);
const showProfileModal = ref(false);
const isNavModalOpen = ref(false);  // Control para abrir/cerrar el modal de navegación
const windowWidth = ref(window.innerWidth);

function checkWindowSize() {
  windowWidth.value = window.innerWidth;
}

async function contactarnos() {
  const enlaceWhatsApp = await useReserva.generarEnlaceWhatsApp();
  window.open(enlaceWhatsApp, '_blank'); // Abre el enlace en una nueva pestaña
}

function toggleProfileModal() {
  showProfileModal.value = !showProfileModal.value;
}

function editarPerfil() {
  // Navegar a la página de edición de perfil
  router.push('/panel-admin/editar-perfil');
}

function toggleNavModal() {
  isNavModalOpen.value = !isNavModalOpen.value;  // Alternar el estado del modal de navegación
}

function cerrarSesion() {
  showProfileModal.value = false;
  useUsuario.token = '';
  useUsuario.usuario = '';
  useUsuario.id = '';
  router.push("/home")
}

async function getCiudades() {
  try {
    const response = await useCiudad.getAll();
    if (useCiudad.estatus === 200) {
      ciudades.value = response;
    }
    /* console.log("ciudades", response); */
  } catch (error) {
    console.log(error);
  }
}

async function getAmbientes() {
  try {
    const response = await useAmbiente.getAll();
    if (useAmbiente.estatus === 200) {
      ambientes.value = response;
    }
    /* console.log(response); */
  } catch (error) {
    console.log(error);
  }
}

const getCiudadesFiltradas = (ciudades) => {
  const departamentos = new Set(); // Utilizamos el Set para guardar nombres de departamentos
  const opciones = [];

  // Añadir opciones de ciudades
  ciudades.forEach((c) => {
    // Filtramos las ciudades que tienen estado === true
    if (c.estado === true && c.idDepart.estado === true) {
      const labelCiudad = `${c.nombre_ciud}, ${c.idDepart.nombre_depart}`;

      opciones.push({
        label: labelCiudad,
        value: c,
        disable: false, // No se deshabilitan porque están activas
      });

      // Añadir departamentos al Set si no están ya
      if (!departamentos.has(c.idDepart.nombre_depart) && c.idDepart.estado === true) {
        departamentos.add(c.idDepart.nombre_depart); // Añadimos el nombre del departamento al Set para evitar duplicados
        opciones.push({
          label: c.idDepart.nombre_depart,  // Nombre del departamento para mostrar
          value: {
            tipo: 'departamento',
            _id: c.idDepart._id,
            nombre_depart: c.idDepart.nombre_depart,
            latitud: c.idDepart.latitud,  // Latitud del departamento
            longitud: c.idDepart.longitud  // Longitud del departamento
          },
          disable: false,
        });
      }
    }
  });

  return opciones.slice(0, 5); // Puedes ajustar el número de resultados según tus necesidades
};



const getAmbientesFiltrados = (ambientes) => {
  return ambientes
    .filter(c => c.estado === true) // Filtra solo los ambientes activos (estado === 1 o true)
    .map(c => ({
      label: c.nombre_amb, // No es necesario marcar como inactivo porque ya se filtraron
      value: c._id,
      disable: false, // No deshabilitamos porque ya estamos filtrando
    }));
};


const cantidad_personas = [
  '0 - 99',
  '100 - 199',
  '200 - 299',
  '300 - 350',
  '400',
];

const filtrarPersonas = (val, update) => {
  update(() => {
  });
};

const filtrarCiudades = (val, update) => {
  if (val === '') {
    update(() => {
      ciudades.value = useCiudad.ciudades;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    ciudades.value = useCiudad.ciudades.filter(c =>
      c.nombre_ciud.toLowerCase().includes(needle) ||
      c.idDepart.nombre_depart.toLowerCase().includes(needle)
    );
  });
};


const filtrarAmbientes = (val, update) => {
  if (val === '') {
    update(() => {
      ambientes.value = useAmbiente.ambientes;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    ambientes.value = useAmbiente.ambientes.filter(c => c.nombre_amb.toLowerCase().includes(needle));
  });
};

const filtrarSalones = async () => {
  const hasFecha = fecha.value !== null && fecha.value !== "";

  // Asegúrate de que siempre se utilicen todos los filtros acumulativos
  if (
    hasFecha ||
    ciudad.value?.value?._id || // Preserva la ciudad seleccionada
    ambiente.value?.value ||
    c_personas.value ||
    useSalon.salonFiltroPrecio ||
    useSalon.salonFiltroEspacio.length > 0 ||
    useSalon.salonFiltroServicio.length > 0 ||
    useSalon.salonFiltroTipo.length > 0 ||
    useSalon.salonFiltroUbicacion.length > 0
  ) {
    showLoadingModal.value = true;
    useSalon.loading = true;

    const filters = {
      // Preserva la ciudad seleccionada en cada filtro
      idCiudSalonEvento: useSalon.salonFiltroCiudad || ciudad.value?.value?._id || null,
      idAmbienteSalon: ambiente.value?.value || null,
      capacidad_sal: c_personas.value || null,
      precio_sal: useSalon.salonFiltroPrecio || null,
      idEspaciosSalon: useSalon.salonFiltroEspacio.length > 0 ? useSalon.salonFiltroEspacio.join(',') : null,
      idServiciosSalon: useSalon.salonFiltroServicio.length > 0 ? useSalon.salonFiltroServicio.join(',') : null,
      idTipoSalon: useSalon.salonFiltroTipo.length > 0 ? useSalon.salonFiltroTipo.join(',') : null,
      idUbicacionSalon: useSalon.salonFiltroUbicacion.length > 0 ? useSalon.salonFiltroUbicacion.join(',') : null,
    };

    try {
      /* console.log("filtros nav ", filters); */
      const filteredSalones = await useSalon.getSalonesFiltrados(filters);
      useSalon.salonesFiltrados = filteredSalones.filter(salon => salon.estado === true);
      router.push('/busqueda');

      /* console.log('Salones filtrados:', filteredSalones); */
    } catch (error) {
      console.error("Error al filtrar salones:", error);
    } finally {
      showLoadingModal.value = false;
      useSalon.loading = false;
    }
  } else {
    console.log("No se aplicaron filtros ni fecha, no es necesario redirigir.");
  }
};






function limpiar() {
  // Desactivar temporalmente los watchers
  isCleaning.value = true;
  ciudad.value = "";
  ambiente.value = "";
  c_personas.value = "";
  fecha.value = "";
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


  // Reactivar los watchers después de limpiar
  setTimeout(() => {
    isCleaning.value = false;
  }, 0);
}

// Modificar los watchers para evitar ejecutar filtrarSalones durante la limpieza
watch(ciudad, () => {
  if (isCleaning && ciudad?.value?.value && ciudad.value?.value?._id) {
/*     console.log("detalle ciudad", ciudad.value?.value.latitud)
    console.log("detalle ciudad", ciudad.value?.value.longitud) */
    useSalon.salonFiltroCiudad = ciudad.value?.value?._id;
    useSalon.salonFiltroCiudadNombre = ciudad.value?.label;
    useSalon.salonCiudLatitud = ciudad.value?.value.latitud;
    useSalon.salonCiudLongitud = ciudad.value?.value.longitud;
    filtrarSalones();
  }
});

watch(ambiente, () => {
  if (isCleaning && ambiente.value?.value) {
    useSalon.salonFiltroAmbiente = ambiente.value?.value;
    useSalon.salonFiltroAmbienteNombre = ambiente.value.label;
    filtrarSalones();
  }
});

watch(c_personas, () => {
  if (isCleaning && c_personas.value) {
    useSalon.salonFiltroPersona = c_personas.value;
    filtrarSalones();
  }
});

watch(fecha, () => {
  if (isCleaning && fecha.value) {
    useSalon.salonFiltroFecha = fecha.value;
    filtrarSalones();
  }
});

onMounted(() => {
  window.addEventListener('resize', checkWindowSize);

  ciudad.value = useSalon.salonFiltroCiudadNombre;
  ambiente.value = useSalon.salonFiltroAmbienteNombre;
  c_personas.value = useSalon.salonFiltroPersona;
  fecha.value = useSalon.salonFiltroFecha;


  getCiudades();
  getAmbientes();
})

onUnmounted(() => {
  window.removeEventListener('resize', checkWindowSize);
});

</script>

<template>
  <q-layout view="hHh lpR fFf">
    <!-- Modal de Cargando -->
    <q-dialog v-model="showLoadingModal" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-spinner color="primary" size="30px" />
          <span class="q-ml-sm">Cargando...</span>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Cabecera / Navbar -->
    <q-header elevated>
      <q-toolbar class="custom-toolbar">
        <div class="logo-container q-pa-xl" @click="limpiar">
          <router-link to="/home" style="text-decoration: none;">
            <q-btn flat round icon="public" class="right-btn bg-primary" />
            <span class="logo-title text-h6">Esfera Audiovisual</span>
          </router-link>
          <q-btn v-if="windowWidth <= 1200" flat icon="menu" label="Filtros" class="bg-primary"
            @click="toggleNavModal" />
        </div>

        <!-- Contenido de la barra de navegación visible en pantallas grandes (más de 984px) -->
        <div v-if="windowWidth > 1201" class="inputs-container">
          <q-select filled v-model="ciudad" use-input hide-selected fill-input input-debounce="0"
            :options="getCiudadesFiltradas(ciudades)" @filter="filtrarCiudades" placeholder="¿Dónde?"
            class="input-item" />

          <q-select filled v-model="ambiente" use-input hide-selected fill-input input-debounce="0"
            :options="getAmbientesFiltrados(ambientes)" @filter="filtrarAmbientes" placeholder="Tipo Evento"
            class="input-item" />

          <q-select filled v-model="c_personas" use-input hide-selected fill-input input-debounce="0"
            :options="cantidad_personas" placeholder="¿Cuántas personas?" class="input-item" />

          <q-input v-model="fecha" filled type="date" placeholder="Cuando" class="input-item" />

          <q-btn flat round icon="search" class="search-btn bg-primary" @click="filtrarSalones" />
        </div>

        <!-- Botones del lado derecho (ocultos en pantallas pequeñas) -->
        <q-space />
        <div class="right-side d-none d-lg-flex"> <!-- Ocultar en pantallas menores de 984px -->
          <q-btn v-if="!useUsuario.token" flat label="Contáctanos" class="right-btn bg-primary" @click="contactarnos" />
          <q-btn v-if="useUsuario.token" flat label="Administrar salones" class="right-btn bg-primary"
            @click="router.push('/panel-admin')" />

          <template v-if="useUsuario.token">
            <q-btn flat round icon="account_circle" class="right-btn bg-primary" @click="toggleProfileModal" />
          </template>
          <template v-else>
            <router-link to="/login">
              <q-btn flat round icon="login" class="right-btn bg-primary" />
            </router-link>
          </template>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Contenedor Principal -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Modal de Navegación (en pantallas de 984px o menos) -->
    <q-dialog v-model="isNavModalOpen">
      <q-card>
        <q-card-section>
          <q-list>
            <q-item>
              <q-select filled v-model="ciudad" use-input hide-selected fill-input input-debounce="0"
                :options="getCiudadesFiltradas(ciudades)" @filter="filtrarCiudades" placeholder="¿Dónde?"
                class="input-item" />
            </q-item>
            <q-item>
              <q-select filled v-model="ambiente" use-input hide-selected fill-input input-debounce="0"
                :options="getAmbientesFiltrados(ambientes)" @filter="filtrarAmbientes" placeholder="Tipo Evento"
                class="input-item" />
            </q-item>
            <q-item>
              <q-select filled v-model="c_personas" use-input hide-selected fill-input input-debounce="0"
                :options="cantidad_personas" placeholder="¿Cuántas personas?" class="input-item" />
            </q-item>
            <q-item>
              <q-input v-model="fecha" filled type="date" placeholder="¿Cuando?" class="input-item" />
            </q-item>
            <q-item>
              <div style="display: flex; justify-content: center; width: 100%; color: white;">
                <q-btn flat label="Buscar" class="bg-primary" @click="filtrarSalones" />
              </div>

            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" @click="toggleNavModal" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de Perfil -->
    <q-dialog v-model="showProfileModal">
      <q-card class="custom-card">
        <q-card-section class="q-pt-none">
          <div class="profile-info">
            <q-avatar size="100px" rounded>
              <q-icon name="person" />
            </q-avatar>
            <div class="profile-details">
              <h6>{{ useUsuario.usuario.nombre }}</h6>
              <p>{{ useUsuario.usuario.rol }}</p>
            </div>
          </div>
          <q-card-actions align="center" class="q-pt-none q-pb-lg">
            <q-btn flat label="Editar Perfil" color="primary" @click="editarPerfil" />
            <q-btn flat label="Cerrar Sesión" color="negative" @click="cerrarSesion" />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<style scoped>
.custom-toolbar {
  background-color: #ffffff;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-title {
  color: black;
  font-weight: bold;
  margin-left: 10px;
}

.inputs-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 20;
}

.input-item {
  width: 200px;
  background-color: white;
}

.search-btn {
  margin-left: 10px;
  height: 35px;
  width: 35px;
  color: white;
}

.right-side {
  display: flex;
  align-items: center;
  gap: 10px;
}

.right-btn {
  color: white;
}

.custom-card {
  width: 300px;
  border-radius: 20px;
  background-color: #f4f4f9;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-details h6 {
  font-weight: bold;
  margin: 0;
}

.profile-details p {
  margin: 5px 0;
}

.q-card-actions {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

@media (max-width: 621px) {
  .custom-toolbar {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .right-side {
    margin-bottom: 20px;
  }

}
</style>
