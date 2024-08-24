<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStoreCiudad } from '../stores/ciudad.js';
import { useStoreAmbienteSalon } from '../stores/ambiente.js';

const useCiudad = useStoreCiudad();
const useAmbiente = useStoreAmbienteSalon();
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
    return ciudades.map((c) => ({
        label: c.estado === 0 ? `${c.nombre_ciud} ${c.idDepart.nombre_depart} - Inactiva` : `${c.nombre_ciud}, ${c.idDepart.nombre_depart}`,
        value: c,
        disable: c.estado === 0,
    }));
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
        ciudades.value = useCiudad.ciudades.filter(c => c.nombre_ciud.toLowerCase().includes(needle) || c.idDepart.nombre_depart.toLowerCase().includes(needle));
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

function buscar() {
    console.log("HOLA");
    console.log(ciudad);
}

watch(ciudad,()=>{
    console.log(ciudad.value.value.idDepart._id);
})

onMounted(() => {
    getCiudades();
    getAmbientes();
});
</script>

<template>
    <div >
      <q-layout view="hHh lpR fFf">
        <q-header elevated>
          <q-toolbar>
            <!-- Esfera Logo y Nombre -->
            <div class="logo-container">
              <q-btn flat round icon="public" class="right-btn" />
              <h6 class="logo-title">Esfera Audiovisual</h6>
            </div>
  
            <!-- Inputs Centrados -->
            <div class="inputs-container">
              <q-select filled v-model="ciudad" use-input hide-selected fill-input input-debounce="0"
                        :options="getCiudadesFiltradas(ciudades)" @filter="filtrarCiudades" placeholder="¿Dónde?"
                        class="input-item" />
              
              <q-select filled v-model="ambiente" use-input hide-selected fill-input input-debounce="0"
                        :options="getAmbientesFiltrados(ambientes)" @filter="filtrarAmbientes"
                        placeholder="Ambiente salón" class="input-item" />
              
              <q-select filled v-model="c_personas" use-input hide-selected fill-input input-debounce="0"
                        :options="cantidad_personas" @filter="filtrarPersonas" placeholder="¿Cuántos?"
                        class="input-item" />
  
              <q-input v-model="fecha" filled type="date" placeholder="Cuando" class="input-item" />
              
              <q-btn flat round icon="search" class="search-btn" @click="buscar" />
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
    flex: 20; /* Para que tome el espacio necesario */
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
  
