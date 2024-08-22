<script setup>
import { ref, onMounted } from 'vue';
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
const precioMax = ref(0);



function getNombresAmbiente(idAmbienteSalon) {
    if (idAmbienteSalon && idAmbienteSalon.length > 0) {
        return idAmbienteSalon.map(ambiente => ambiente.nombre_amb).join(', ');
    } else {
        return 'No hay ambiente asignado';
    }
}

const handleEspacioChange = async () => {
    console.log(espacioselec)
}

const handleServicioChange = async () => {
    console.log("Cambió servicio")
}

//Traer datos API

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
            <!-- Filtros a la izquierda -->
            <div class="filtros">
                <div class="filtroprecio" style="width: 100%;">
                    <h6 class="text-bold" style="margin-left: 20px;">Precio máximo</h6>
                    <q-input v-model="precioMax" class="q-ml-md">{{ precioMax }}</q-input>
                    <div class="precio-range q-ml-md">
                        <q-slider v-model="precioMax" :min="0" :max="1000000" :step="10000" label color="dark"
                            track-color="grey-4" class="custom-slider"  />
                    </div>
                </div>
                <hr>
                <div class="filtroespacio">
                    <h6 class="q-ml-md text-bold">Espacios</h6>
                    <!-- Lista de Espacios con Checkboxes -->
                    <q-list  class="q-pl-md">
                        <q-item v-for="espacio in espacios" :key="espacio.value">
                            <q-item-section>
                                <q-checkbox
                                    v-model="espacioselec"
                                    :val="espacio.value"
                                    :label="espacio.label"
                                    @update:model-value="handleEspacioChange"
                                />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
                <hr>
                <div class="filtroservicio">
                    <h6 class="q-ml-md text-bold">Servicios</h6>
                    <!-- Lista de Espacios con Checkboxes -->
                    <q-list  class="q-pl-md">
                        <q-item v-for="servicio in servicios" :key="servicio.value">
                            <q-item-section>
                                <q-checkbox
                                    v-model="servicioselec"
                                    :val="servicio.value"
                                    :label="servicio.label"
                                    @update:model-value="handleServicioChange"
                                />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
            </div>

            <!-- Salones a la derecha -->
            <div class="salones">
                <div v-for="salon in salones" :key="salon._id" class="salon-card">
                    <q-card class="my-card">
                        <q-img :src="salon.imagen_principal" />
                        <q-card-section>
                            <div class="text-h6">{{ salon.nombre_sal }}</div>
                            <div class="text-subtitle2">{{ salon.idCiudSalonEvento.nombre_ciud }}, {{
                                salon.idCiudSalonEvento.idDepart.nombre_depart }}</div>
                            <div class="text-subtitle2">Ambiente: {{ getNombresAmbiente(salon.idAmbienteSalon) }}</div>
                            <div class="text-subtitle2">Precio: {{ salon.precio_sal }}</div>
                            <div class="text-subtitle2">Capacidad: {{ salon.capacidad_sal }} personas</div>
                        </q-card-section>
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

.filtros {
    flex: 1;
    margin-right: 20px;
}

.salones {
    flex: 3;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, auto);
    margin-top: 80px;
    gap: 20px;
}

.salon-card {
    width: 100%;
    display: flex;
    justify-content: center;
}

.my-card {
    width: 250px;
    height: 300px;
}

.q-img {
    height: 100px;
    width: 100%;
}

.q-card-section {
    padding: 10px;
}

.text-h6 {
    font-size: 18px;
}

.text-subtitle2 {
    font-size: 14px;
}

.custom-slider {
    --q-slider-handle-size: 20px;
    --q-slider-handle-color: var(--q-primary);
    --q-slider-handle-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    --q-slider-track-height: 8px;
    --q-slider-track-color: var(--q-grey-4);
     

    
}
</style>
