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

const handleEspacioChange = async () => {
    console.log(espacioselec)
}

const handleServicioChange = async () => {
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
                            <q-list class="q-pl-md">
                                <q-item v-for="espacio in espacios" :key="espacio.value">
                                    <q-item-section>
                                        <q-checkbox v-model="espacioselec" :val="espacio.value" :label="espacio.label"
                                            @update:model-value="handleEspacioChange" />
                                    </q-item-section>
                                </q-item>
                            </q-list>
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
                            <q-list class="q-pl-md">
                                <q-item v-for="servicio in servicios" :key="servicio.value">
                                    <q-item-section>
                                        <q-checkbox v-model="servicioselec" :val="servicio.value" :label="servicio.label"
                                            @update:model-value="handleServicioChange" />
                                    </q-item-section>
                                </q-item>
                            </q-list>
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
    /* Ajusta la imagen para que se muestre completa */

}

.card-details {
    flex: 4;
    /* Ajusta el ancho de la información */
    padding: 20px;
}

.text-h6 {
    font-size: 18px;
    font-weight: bold;
}

.text-subtitle2 {
    font-size: 14px;
    margin-bottom: 8px;
}

.custom-slider {
    --q-slider-handle-size: 20px;
    --q-slider-handle-color: var(--q-primary);
    --q-slider-handle-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    --q-slider-track-height: 8px;
    --q-slider-track-color: var(--q-grey-4);
}
</style>
