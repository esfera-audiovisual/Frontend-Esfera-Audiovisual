<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreSalon } from '../../stores/salon.js';  // Make sure to create this store
import { useRouter } from 'vue-router';

const useSalonEvento = useStoreSalon();
const loadingTable = ref(false);
const loadIn_activar = ref(false);
const filter = ref("");
const router = useRouter();
const $q = useQuasar();

function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
}

const columns = [
    { name: "nombre_sal", label: "Nombre del salón", field: "nombre_sal", sortable: true, align: "left" },
    {
        name: "ciudadDepartamento",
        label: "Ciudad",
        field: (row) => {
            const ciudad = row.idCiudSalonEvento?.nombre_ciud || 'Sin ciudad';
            const departamento = row.idCiudSalonEvento?.idDepart?.nombre_depart || 'Sin departamento';
            return `${ciudad}, ${departamento}`;  // Concatenar ciudad y departamento
        },
        sortable: true,
        align: "left"
    },
    {
        name: "contacto",
        label: "Contacto",
        field: (row) => {
            return row.idContactoSalon ? row.idContactoSalon.nombre_cont : 'Falta contacto de este salón'; // Verifica si existe el salón
        },
        sortable: true,
        align: "left"
    },
    {
        name: "posicion_banner",
        label: "Posición Banner",
        field: (row) => {
            return row.posicion_banner ? row.posicion_banner : 'No'; // Verifica si tiene valor
        },
        sortable: true,
        align: "center"
    },
    { name: "estado", label: "Estado", field: "estado", sortable: true, align: "center" },
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];


const rows = ref([]);

// Fetch all salonEventos
async function getInfo() {
    try {
        loadingTable.value = true;
        const response = await useSalonEvento.getAll();
        if (!response) return;
        if (response.error) {
            notificar('negative', response.error);
            return;
        }
        /* console.log(response) */
        rows.value = response.reverse();
    } catch (error) {
        console.error(error);
    } finally {
        loadingTable.value = false;
    }
}

getInfo();

const opciones = {
    agregar: () => {
        useSalonEvento.idSalonSelec = null;  // Limpiar la selección de salón
        router.push('/panel-admin/formulario-salon');  // Navegar al formulario
    },
    editar: (info) => {
        router.push({
            path: '/panel-admin/formulario-salon',
            query: { id: info._id }
        });
        useSalonEvento.idSalonSelec = info._id;  // Establecer el id del salón a editar
    }
};


const in_activar = {
    activar: async (id) => {
        loadIn_activar.value = true;
        try {
            const response = await useSalonEvento.activar(id);
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            }
            rows.value.splice(buscarIndexLocal(response._id), 1, response);
        } catch (error) {
            console.error(error);
        } finally {
            loadIn_activar.value = false;
        }
    },
    inactivar: async (id) => {
        loadIn_activar.value = true;
        try {
            const response = await useSalonEvento.inactivar(id);
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            }
            rows.value.splice(buscarIndexLocal(response._id), 1, response);
        } catch (error) {
            console.error(error);
        } finally {
            loadIn_activar.value = false;
        }
    }
};

// Find the index of an item in the rows array based on its id
function buscarIndexLocal(id) {
    return rows.value.findIndex((r) => r._id === id);
}

</script>

<template>
    <main style="width: 100%; display: flex; justify-content: center;">
        <!-- Table -->
        <q-table :rows="rows" :columns="columns" row-key="nombre_sal" :loading="loadingTable"
            loading-label="Cargando..." :filter="filter" rows-per-page-label="Visualización de filas"
            no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Salones de eventos"
            style="width: 90%; margin-top: 40px;" no-data-label="No hay salones registrados.">

            <template v-slot:top-left>
                <div style="display: flex; gap: 10px;">
                    <h4 id="titleTable">Salones de Eventos</h4>
                    <q-btn @click="opciones.agregar" color="primary">
                        <q-icon name="add" color="white" center />
                    </q-btn>
                </div>
            </template>

            <template v-slot:top-right>
                <q-input outlined dense debounce="300" color="primary" v-model="filter" class="buscar"
                    placeholder="Buscar cualquier campo">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>

            <!-- Estado button (activate/deactivate) -->
            <template v-slot:body-cell-estado="props">
                <q-td :props="props">
                    <q-btn :loading="props.row.estado === 'load'" :label="props.row.estado
                        ? 'Activo'
                        : !props.row.estado
                            ? 'Inactivo'
                            : '‎  ‎   ‎   ‎   ‎ '" :color="props.row.estado ? 'positive' : 'accent'"
                        loading-indicator-size="small"
                        @click="props.row.estado ? in_activar.inactivar(props.row._id) : in_activar.activar(props.row._id); props.row.estado = 'load'" />
                </q-td>
            </template>

            <!-- Edit button -->
            <template v-slot:body-cell-opciones="props">
                <q-td :props="props">
                    <div id="buttons">
                        <button class="editBtn bg-primary" @click="opciones.editar(props.row)">
                            Editar
                        </button>
                    </div>
                </q-td>
            </template>
        </q-table>
    </main>
</template>

<style scoped>
#titleTable {
    margin: auto;
}

.editBtn {
    width: 80px;
    height: 55px;
    border-radius: 20px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.123);
    cursor: pointer;
    color: white;
}


.btn-go,
.btn-asignar {
    width: 9em;
    height: 55px;
    border-radius: 15px;
    font-size: 15px;
    font-family: inherit;
    border: none;
    position: relative;
    overflow: hidden;
    z-index: 1;
    box-shadow: 6px 6px 12px #c5c5c5,
        -6px -6px 12px #ffffff;
}

.btn-go::before,
.btn-asignar::before {
    content: '';
    width: 0;
    height: 55px;
    border-radius: 15px;
    position: absolute;
    top: 0;
    left: 0;
    background-image: linear-gradient(to right, #39A900 0%, #39A900 100%);
    transition: .5s ease;
    display: block;
    z-index: -1;
}

.btn-go:hover::before,
.btn-asignar:hover::before {
    width: 9em;
}


#buttons {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 25px;
}
</style>