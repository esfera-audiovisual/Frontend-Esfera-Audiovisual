<script setup>
import { ref, onMounted } from 'vue';
import { useStoreCiudad } from '../stores/ciudad.js';

const useCiudad = useStoreCiudad();
const fecha = ref('');
const c_personas = ref('');
const ciudad = ref();
const ciudades = ref([]);


async function getCiudades() {
    try {
        const response = await useCiudad.getAll()
        if (useCiudad.estatus === 200) {
            ciudades.value = response;
        }
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

const getCiudadesFiltradas = (ciudades) => {
    const ciudadesfilt = ciudades.map((c) => {
        return {
            label: c.estado === 0 ? `${c.nombre_ciud} ${c.idDepart.nombre_depart} - Inactiva` : `${c.nombre_ciud}, ${c.idDepart.nombre_depart}`,
            value: c._id,
            disable: c.estado === 0,
        };
    });
    return ciudadesfilt;
};


const cantidad_personas = [
    '0 - 50',
    '51 - 100',
    '101 - 150',
    '151 - 200',
    '201 - 300',
];

const filtrarPersonas = (val, update, abort) => {
    update(() => {
        console.log("adios")
    });
};

/* const filtrarCiudades = (val, update, abort) => {
    update(() => {
        const needle = val.toLowerCase();
        ciudad.value = ciudades.filter((v) =>
            v.toLowerCase().indexOf(needle) > -1
        );
    });
}; */

const filtrarCiudades = (val, update) => {
    if (val === '') {
        // Restablecer las opciones a la lista original de ciudades cuando el input está vacío
        update(() => {
            ciudades.value = useCiudad.ciudades;
        });
        return;
    }

    update(() => {
        const needle = val.toLowerCase();
        ciudades.value = useCiudad.ciudades.filter(c => c.nombre_ciud.toLowerCase().includes(needle) || c.idDepart.nombre_depart.toLowerCase().includes(needle));
    });
}

function buscar() {
    console.log("HOLA")
    console.log(ciudad)
}



onMounted(() => {
    getCiudades();
})
</script>

<template>
    <div>
        <q-layout view="hHh lpR fFf">
            <q-header elevated>
                <q-toolbar style="display: flex; align-items: baseline;">
                    <!-- Esfera Logo -->
                    <q-toolbar-title class="row inline">
                        <span class="q-toolbar__title">
                            <q-btn flat round icon="public" style="width: 15px; height: 15px; margin-right: 10px;" />
                            <h6 style="color: black; display: inline-block; font-weight: bold;">Esfera Audiovisual</h6>
                        </span>
                    </q-toolbar-title>

                    <div class="q-pa-md row q-gutter-md">
                        <q-select filled v-model="ciudad" use-input hide-selected fill-input input-debounce="0"
                            :options="getCiudadesFiltradas(ciudades)" @filter="filtrarCiudades" placeholder="¿Dónde?"
                            style="width: 250px; padding-bottom: 32px; background-color: white;">
                            <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-grey">
                                        No hay resultados
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>

                        <q-input v-model="fecha" filled type="date" placeholder="Cuando" style="background-color: white;" />

                        <div class="row q-gutter-xs">
                            <q-select filled v-model="c_personas" use-input hide-selected fill-input input-debounce="0"
                                :options="cantidad_personas" @filter="filtrarPersonas" placeholder="¿Cuántos?"
                                style="width: 250px; padding-bottom: 32px; background-color: white;">
                            </q-select>
                            <q-btn flat round icon="search" style="height: 15px; width: 15px;" @click="buscar" />
                        </div>
                    </div>

                    <!-- Right Side Links -->
                    <q-space />
                    <div>
                        <q-btn flat label="Pon tu salon" class="q-mr-md" />
                        <q-btn flat round icon="account_circle" />
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
.q-input {
    max-width: 200px;
}

.q-btn {
    background-color: rgb(112, 27, 240);
    color: white;
}

.q-input__inner {
    padding-left: 10px;
}

.q-my-input {
    width: 300px;
}

.q-date-custom {
    --q-color-primary: #42a5f5;
    /* Color personalizado */
}

.q-my-input .q-field__control {
    font-size: 16px;
    /* Cambiar tamaño de fuente */
}

.q-my-input .q-field__label {
    font-weight: bold;
    /* Cambiar estilo de la etiqueta */
}
</style>