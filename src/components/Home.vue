<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStoreSalon } from '../stores/salon.js';
import { useStoreEspacioSalon } from '../stores/espacio.js';
import { useStoreServicioSalon } from '../stores/servicio.js';

const useSalon = useStoreSalon();
const useEspacio = useStoreEspacioSalon();
const useServicio = useStoreServicioSalon();
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

function getNombresAmbiente(idAmbienteSalon) {
    if (idAmbienteSalon && idAmbienteSalon.length > 0) {
        return idAmbienteSalon.map(ambiente => ambiente.nombre_amb).join(', ');
    } else {
        return 'No hay ambiente asignado';
    }
}

const cambioFiltroEspacio = async () => {
    console.log(espacioselec)
}

const cambioFiltroServicio = async () => {
    console.log("Cambió servicio")
}

async function getSalones() {
    loading.value = true;
    try {
        const response = await useSalon.getAll();
        if (useSalon.estatus === 200) {
            salones.value = response;
        }
        console.log(response);
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

async function getEspacios() {
    try {
        const response = await useEspacio.getAll();
        if (useEspacio.estatus === 200) {
            espacios.value = response.map(espacio => ({
                label: espacio.nombre_esp,
                value: espacio._id
            }));
        }
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

async function getServicios() {
    try {
        const response = await useServicio.getAll();
        if (useServicio.estatus === 200) {
            servicios.value = response.map(servicio => ({
                label: servicio.nombre_serv,
                value: servicio._id
            }));
        }
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

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
                            <q-btn flat round :icon="iconoPrecio" @click="mostrarPrecio"
                                style="height: 15px; width: 15px;" />
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
                            <q-btn flat round :icon="iconoEspacio" @click="mostrarEspacio"
                                style="height: 15px; width: 15px;" />
                        </div>
                        <!-- Lista de Espacios con Checkboxes -->
                        <div v-if="ocultarEspacio">
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
                            <q-btn flat round :icon="iconoServicio" @click="mostrarServicio"
                                style="height: 15px; width: 15px;" />
                        </div>
                        <!-- Lista de Espacios con Checkboxes -->
                        <div v-if="ocultarServicio">
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
            </div>

            <!-- Filtros a la izquierda -->


            <!-- Salones a la derecha -->
            <div class="salones">
                <div v-for="salon in salones" :key="salon._id" class="salon-card">
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



ul.q-pl-md {
    list-style-type: none;
    /* Quita el punto de cada ítem */
    padding-left: 0;
    /* Elimina el padding izquierdo */
}

.list-item {
    margin-bottom: 10px;
    margin-left: 20px;
    /* Aumenta el espacio entre los elementos */
}

input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    background-color: #fff;
    border: 2px solid #adb5bd;
    border-radius: 4px;
    width: 25px;
    /* Aumenta el tamaño del checkbox */
    height: 25px;
    /* Aumenta el tamaño del checkbox */
    cursor: pointer;
    outline: none;
    margin-right: 10px;
    /* Agrega un espacio entre el checkbox y el label */
    position: relative;
}

input[type="checkbox"]:checked {
    background-color: rgb(112, 27, 240);
    border-color: rgb(112, 27, 240);
}

input[type="checkbox"]:checked::after {
    content: '';
    position: absolute;
    top: 5px;
    left: 8px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

label {
    font-size: 18px;
    /* Aumenta el tamaño del texto */
    font-weight: 500;
    color: #495057;
    cursor: pointer;
    margin-left: 0;
}
</style>
