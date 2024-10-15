<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreReglamentoSalon } from '../../stores/reglamento.js'; // Store para reglamentos
import { useStoreSalon } from '../../stores/salon.js'; // Store para salones
import { useRouter } from 'vue-router';

const useReglamento = useStoreReglamentoSalon();
const useSalon = useStoreSalon();  // Instancia del store de los salones
const loadingTable = ref(false);
const loadingModal = ref(false);
const loadIn_activar = ref(false);
const filter = ref("");
const modal = ref(false);
const router = useRouter();
const $q = useQuasar();

function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
};

const estado = ref('agregar');
const data = ref({});
const salones = ref([]); // Lista de salones que se mostrarán en el q-select

const columns = [
    { name: "descripcion_regl", label: "Descripción del reglamento", field: "descripcion_regl", sortable: true, align: "left" },
    {
        name: "nombreSalonEvento",
        label: "Nombre del salón de evento",
        field: (row) => {
            return row.idSalonEvento ? row.idSalonEvento.nombre_sal : ''; // Verifica si existe el salón
        },
        sortable: true,
        align: "left"
    },
    { name: "estado", label: "Estado", field: "estado", sortable: true, align: "center" },
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];

const rows = ref([]);

// Obtener salones
async function getSalones() {
    try {
        const response = await useSalon.getAll(); // Asumiendo que este método obtiene los salones
        if (response && !response.error) {
            salones.value = response; // Guardamos la lista de salones
        } else {
            notificar('negative', 'Error al obtener los salones');
        }
    } catch (error) {
        console.log(error);
    }
}

// Obtener reglamentos
async function getInfo() {
    try {
        loadingTable.value = true;
        const response = await useReglamento.getAll();
        /* console.log("reglamentos", response); */
        if (!response) return;
        if (response.error) {
            notificar('negative', response.error);
            return;
        };
        // Asignamos los reglamentos a la tabla
        rows.value = response.reverse();
    } catch (error) {
        console.log(error);
    } finally {
        loadingTable.value = false;
    }
}

// Al montar el componente, cargar los salones y los reglamentos
onMounted(() => {
    getSalones();
    getInfo();
});

const opciones = {
    agregar: () => {
        data.value = {};
        estado.value = 'agregar';
        modal.value = true;
    },
    editar: (info) => {
        data.value = { ...info };
        estado.value = 'editar';
        modal.value = true;
        // Al editar, aseguramos que el salón aparezca como seleccionado en el q-select
        data.value.idSalonEvento = info.idSalonEvento ? info.idSalonEvento._id : null;
    }
};

const enviarInfo = {
    agregar: async () => {
        try {
            loadingModal.value = true;
            const response = await useReglamento.registro(data.value);
            getInfo();
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };
            modal.value = false;
            notificar('positive', 'Reglamento agregado exitosamente');
        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false;
        }
    },
    editar: async () => {
        loadingModal.value = true;
        try {
            const response = await useReglamento.editar(data.value._id, data.value);
            getInfo();
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            }
            rows.value.splice(buscarIndexLocal(response._id), 1, response);
            modal.value = false;
            notificar('positive', 'Reglamento editado exitosamente');
        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false;
        }
    }
};

function validarCampos() {
    const arrData = Object.values(data.value);
    for (const d of arrData) {
        if (d === null || (typeof d === "string" && d.trim() === "")) {
            errorCamposVacios();
            return;
        }
    }
    enviarInfo[estado.value]();
}

const in_activar = {
    activar: async (id) => {
        loadIn_activar.value = true;
        try {
            const response = await useReglamento.activar(id);
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };
            rows.value.splice(buscarIndexLocal(response._id), 1, response);
        } catch (error) {
            console.log(error);
        } finally {
            loadIn_activar.value = false;
        }
    },
    inactivar: async (id) => {
        loadIn_activar.value = true;
        try {
            const response = await useReglamento.inactivar(id);
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };
            rows.value.splice(buscarIndexLocal(response._id), 1, response);
        } catch (error) {
            console.log(error);
        } finally {
            loadIn_activar.value = false;
        }
    }
};

function buscarIndexLocal(id) {
    return rows.value.findIndex((r) => r._id === id);
}
</script>

<template>
    <main style="width: 100%; display: flex; justify-content: center;">
        <!-- Modal -->
        <q-dialog v-model="modal">
            <q-card class="modal" style="width: 450px;">
                <q-toolbar class="bg-primary" style="color: white">
                    <q-toolbar-title>{{ estado === 'agregar' ? 'Agregar' : 'Editar' }} Reglamento</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>
                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">
                        <q-input filled v-model.trim="data.descripcion_regl" label="Descripción del reglamento"
                            :rules="[val => !!val || 'Digite la descripción']" type="textarea" />
                        <q-select v-model="data.idSalonEvento" label="Salón de Evento"
                            :options="salones.map(salon => ({ label: salon.nombre_sal, value: salon._id }))"
                            map-options emit-value :rules="[val => !!val || 'Seleccione el salón de eventos']" /> <!-- map-options y emit-value para asegurar que se maneje la relación correctamente -->
                        <div style="display: flex; width: 96%; justify-content: flex-end;">
                            <q-btn :loading="loadingModal" padding="10px" type="submit" color="primary"
                                :label="estado" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Tabla -->
        <q-table :rows="rows" :columns="columns" row-key="nombre_ubi" :loading="loadingTable"
            loading-label="Cargando..." :filter="filter" rows-per-page-label="Visualización de filas"
            no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Reglamentos"
            style="width: 90%; margin-top: 40px;" no-data-label="No hay reglamentos registrados.">

            <template v-slot:top-left>
                <div style="display: flex; gap: 10px;">
                    <h4 id="titleTable">Reglamentos</h4>
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

            <template v-slot:body-cell-descripcion_regl="props">
                <q-td :props="props" class="descripcion">
                    <VMenu class="vmenu">
                        <span class="descripcion">{{ props.row.descripcion_regl }}</span>

                        <template #popper>
                            <div class="descripVmenu">{{ props.row.descripcion_regl }}</div>
                        </template>
                    </VMenu>
                </q-td>
            </template>

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

.descripcion {
    max-width: 150px;
    max-height: 20px;
    word-wrap: break-word;
    overflow: hidden;
}

.vmenu {
    max-height: 50px;
}

.descripVmenu {
    padding: 1rem;
    word-wrap: break-word;
    height: fit-content;
    max-height: 300px;
    max-width: 300px;
}
</style>
