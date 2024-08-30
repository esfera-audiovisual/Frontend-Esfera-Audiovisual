<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStoreCiudad } from '../stores/ciudad.js';
import { useStoreAmbienteSalon } from '../stores/ambiente.js';
import { useStoreSalon } from '../stores/salon.js';
import { router } from '../routes/routes.js';

const useCiudad = useStoreCiudad();
const useAmbiente = useStoreAmbienteSalon();
const useSalon = useStoreSalon();
const fecha = ref("");
const ciudades = ref([]);
const ambientes = ref([]);
const c_personas = ref("");
const ciudad = ref("");
const ambiente = ref("");
const showLoadingModal = ref(false);




async function getCiudades() {
  try {
    const response = await useCiudad.getAll();
    if (useCiudad.estatus === 200) {
      ciudades.value = response;
    }
    console.log(response);
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
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

const getCiudadesFiltradas = (ciudades) => {
  const departamentos = new Set(); // Utilizamos el Set para guardar nombres de departamentos
  const opciones = [];

  // Añadir opciones de ciudades
  ciudades.forEach((c) => {
    const labelCiudad = c.estado === 0
      ? `${c.nombre_ciud}, ${c.idDepart.nombre_depart} - Inactiva`
      : `${c.nombre_ciud}, ${c.idDepart.nombre_depart}`;

    opciones.push({
      label: labelCiudad,
      value: c,
      disable: c.estado === 0,
    });

    // Añadir departamentos al Set si no están ya
    if (!departamentos.has(c.idDepart.nombre_depart)) {
      departamentos.add(c.idDepart.nombre_depart); // Añadimos el nombre del departamento al Set para evitar duplicados
      opciones.push({
        label: c.idDepart.nombre_depart,  // Nombre del departamento para mostrar
        value: { tipo: 'departamento', _id: c.idDepart._id, nombre_depart: c.idDepart.nombre_depart },  // ID y nombre del departamento como valor
        disable: false,
      });
    }
  });

  return opciones.slice(0, 5);
};


const getAmbientesFiltrados = (ambientes) => {
  return ambientes.map((c) => ({
    label: c.estado === 0 ? `${c.nombre_amb} - Inactivo` : c.nombre_amb,
    value: c._id,
    disable: c.estado === 0,
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
    console.log("adios");
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
  showLoadingModal.value = true;
  useSalon.loading = true;

  const filters = {
    idCiudSalonEvento: ciudad.value?.value?._id || null,
    idAmbienteSalon: ambiente.value?.value || null,
    capacidad_sal: c_personas.value || null,
    precio_sal: useSalon.salonFiltroPrecio || null,
    idEspaciosSalon: useSalon.salonFiltroEspacio.length > 0 ? useSalon.salonFiltroEspacio.join(',') : null,
    idServiciosSalon: useSalon.salonFiltroServicio.length > 0 ? useSalon.salonFiltroServicio.join(',') : null,
    idTipoSalon: useSalon.salonFiltroTipo.length > 0 ? useSalon.salonFiltroTipo.join(',') : null,
    idUbicacionSalon: useSalon.salonFiltroUbicacion.length > 0 ? useSalon.salonFiltroUbicacion.join(',') : null,
  };

  try {
    console.log("filtros nav ", filters)
    const filteredSalones = await useSalon.getSalonesFiltrados(filters);
    useSalon.salonesFiltrados = filteredSalones;
    router.push('/busqueda');
    console.log('Salones filtrados:', filteredSalones);
  } catch (error) {
    console.error("Error al filtrar salones:", error);
  } finally {
    showLoadingModal.value = false;
    useSalon.loading = false;
  }
};

const isCleaning = ref(false);

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
  if (isCleaning && ciudad?.value?.value && ciudad.value.value._id) {
    useSalon.salonFiltroCiudad = ciudad.value?.value._id;
    useSalon.salonFiltroCiudadNombre = ciudad.value?.label;
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
  ciudad.value = useSalon.salonFiltroCiudadNombre;
  ambiente.value = useSalon.salonFiltroAmbienteNombre;
  c_personas.value = useSalon.salonFiltroPersona;
  fecha.value = useSalon.salonFiltroFecha;


  getCiudades();
  getAmbientes();


});
</script>

<template>
  <div>
    <q-layout view="hHh lpR fFf">
      <q-dialog v-model="showLoadingModal" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-spinner color="primary" size="30px" />
            <span class="q-ml-sm">Cargando salones...</span>
            <span class="q-ml-sm">Espere por favor</span>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-header elevated>
        <q-toolbar class="custom-toolbar">
          <!-- Esfera Logo y Nombre -->
          <div class="logo-container">
            <router-link to="/home" class="boton-home">
              <q-btn flat round type="button" icon="public" class="right-btn bg-primary" @click="limpiar" />
            </router-link>
            <h6 class="logo-title">Esfera Audiovisual</h6>
          </div>

          <!-- Inputs Centrados -->
          <div class="inputs-container">
            <q-select filled v-model="ciudad" use-input hide-selected fill-input input-debounce="0"
              :options="getCiudadesFiltradas(ciudades)" @filter="filtrarCiudades" placeholder="¿Dónde?"
              class="input-item" />

            <q-select filled v-model="ambiente" use-input hide-selected fill-input input-debounce="0"
              :options="getAmbientesFiltrados(ambientes)" @filter="filtrarAmbientes" placeholder="Tipo Evento"
              class="input-item" />

            <q-select filled v-model="c_personas" use-input hide-selected fill-input input-debounce="0"
              :options="cantidad_personas" @filter="filtrarPersonas" placeholder="¿Cuántas personas?"
              class="input-item" />

            <q-input v-model="fecha" filled type="date" placeholder="Cuando" class="input-item" />

            <q-btn flat round icon="search" class="search-btn bg-primary" @click="filtrarSalones" />
          </div>

          <!-- Right Side Links -->
          <q-space />
          <div class="right-side">
            <q-btn flat label="Pon tu salón" class="right-btn bg-primary" />
            <router-link to="/login" class="boton-home">
              <q-btn flat round icon="login" class="right-btn bg-primary" />
            </router-link>
          </div>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<style scoped>
.custom-toolbar {
  background-color: #ffffff !important;
}


.logo-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
  /* Para que tome el espacio necesario */
}

.input-item {
  width: 200px;
  background-color: white;
}

.search-btn {
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
</style>
