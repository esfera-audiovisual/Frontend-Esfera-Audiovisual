<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStoreCiudad } from '../stores/ciudad.js';
import { useStoreAmbienteSalon } from '../stores/ambiente.js';
import { useStoreSalon } from '../stores/salon.js';
import { router } from '../routes/routes.js';

const useCiudad = useStoreCiudad();
const useAmbiente = useStoreAmbienteSalon();
const useSalon = useStoreSalon();
const fecha = ref('');
const ciudades = ref([]);
const ambientes = ref([]);
const c_personas = ref('');
const ciudad = ref();
const ambiente = ref();

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

  return opciones;
};


const getAmbientesFiltrados = (ambientes) => {
  return ambientes.map((c) => ({
    label: c.estado === 0 ? `${c.nombre_amb} - Inactivo` : c.nombre_amb,
    value: c._id,
    disable: c.estado === 0,
  }));
};

const cantidad_personas = [
  '0 - 50',
  '51 - 100',
  '101 - 150',
  '151 - 200',
  '201 - 300',
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
  const filters = {
    idCiudSalonEvento: ciudad.value?.value?._id || null,
    idAmbienteSalon: ambiente.value?.value || null,
    capacidad_sal: c_personas.value || null,
  };

  const filteredSalones = await useSalon.getSalonesFiltrados(filters);
  useSalon.salonesFiltrados = filteredSalones;
  router.push('/busqueda')
  console.log('Salones filtrados:', filteredSalones);
};

watch(ciudad, () => {
  if (ciudad?.value?.value && ciudad.value.value._id) {
    useSalon.salonFiltroCiudad = ciudad.value.value._id;
    filtrarSalones();  // Llama a la función de filtrado cuando cambia la ciudad
  }
});


watch(ambiente, () => {
  useSalon.salonFiltroAmbiente = ambiente.value?.value
  filtrarSalones();  // Llama a la función de filtrado cuando cambia el ambiente
});

watch(c_personas, () => {
  useSalon.salonFiltroPersona = c_personas.value;
  filtrarSalones();  // Llama a la función de filtrado cuando cambia la cantidad de personas
});

watch(fecha, () => {
  console.log(fecha.value);
  // Puedes agregar la lógica de filtrado según la fecha si es necesario
});

function Home() {
  ciudad.value = "";
  ambiente.value = "";
  c_personas.value = "";
  useSalon.salonesFiltrados = "";
  router.push('/home')
}

onMounted(() => {
  getCiudades();
  getAmbientes();
});
</script>

<template>
  <div>
    <q-layout view="hHh lpR fFf">
      <q-header elevated>
        <q-toolbar>
          <!-- Esfera Logo y Nombre -->
          <div class="logo-container">
            <q-btn flat round icon="public" class="right-btn" @click="Home()" />
            <h6 class="logo-title">Esfera Audiovisual</h6>
          </div>

          <!-- Inputs Centrados -->
          <div class="inputs-container">
            <q-select filled v-model="ciudad" use-input hide-selected fill-input input-debounce="0"
              :options="getCiudadesFiltradas(ciudades)" @filter="filtrarCiudades" placeholder="¿Dónde?"
              class="input-item" />

            <q-select filled v-model="ambiente" use-input hide-selected fill-input input-debounce="0"
              :options="getAmbientesFiltrados(ambientes)" @filter="filtrarAmbientes" placeholder="Ambiente salón"
              class="input-item" />

            <q-select filled v-model="c_personas" use-input hide-selected fill-input input-debounce="0"
              :options="cantidad_personas" @filter="filtrarPersonas" placeholder="¿Cuántas personas?"
              class="input-item" />

            <q-input v-model="fecha" filled type="date" placeholder="Cuando" class="input-item" />

            <q-btn flat round icon="search" class="search-btn" @click="filtrarSalones" />
          </div>

          <!-- Right Side Links -->
          <q-space />
          <div class="right-side">
            <q-btn flat label="Pon tu salón" class="right-btn" />
            <q-btn flat round icon="account_circle" class="right-btn" />
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
  gap: 15px;
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
  background-color: rgb(112, 27, 240);
  color: white;
}

.right-side {
  display: flex;
  align-items: center;
  gap: 10px;
}

.right-btn {
  background-color: rgb(112, 27, 240);
  color: white;
}
</style>
