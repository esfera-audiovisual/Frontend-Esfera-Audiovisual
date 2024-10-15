<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar';
import { useStoreContactoSalon } from '../../stores/contacto.js'; // Store for ContactoSalon model
import { useRouter } from 'vue-router';

const useContactoSalon = useStoreContactoSalon();
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

const columns = [
    { name: "nombre_cont", label: "Nombre del contacto", field: "nombre_cont", sortable: true, align: "left" },
    { name: "correo_cont", label: "Correo", field: "correo_cont", sortable: true, align: "left" },
    { name: "telefono_cont", label: "Teléfono", field: "telefono_cont", sortable: true, align: "left" },
    { name: "telefono_whats", label: "Enlace WhatsApp", field: (row) => row.telefono_whats ? "Si" : "No", sortable: true, align: "left" },
    { name: "estado", label: "Estado", field: "estado", sortable: true, align: "center" },
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];


const rows = ref([]);

async function getInfo() {
    try {
        loadingTable.value = true;

        const response = await useContactoSalon.getAll();
        /* console.log(response); */

        if (!response) return;
        if (response.error) {
            notificar('negative', response.error);
            return;
        };

        rows.value = response.reverse();

    } catch (error) {
        console.log(error);
    } finally {
        loadingTable.value = false;
    };
}

getInfo();

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
    }
};

const enviarInfo = {
    agregar: async () => {
        try {
            loadingModal.value = true;

            const response = await useContactoSalon.registro(data.value);
            /* console.log(response); */
            getInfo();
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };

            modal.value = false;
            notificar('positive', 'Guardado exitosamente');

        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false;
        }
    },
    editar: async () => {
        loadingModal.value = true;
        try {
            const response = await useContactoSalon.editar(data.value._id, data.value);
            /* console.log(response); */
            getInfo();
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            }
            rows.value.splice(buscarIndexLocal(response._id), 1, response);
            modal.value = false;
            notificar('positive', 'Editado exitosamente');
        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false;
        }
    }
}

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
            const response = await useContactoSalon.activar(id);
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
            const response = await useContactoSalon.inactivar(id);
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
                    <q-toolbar-title>{{ estado === 'agregar' ? 'Agregar' : 'Editar' }} Contacto Salon</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>

                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">
                        <q-input filled v-model.trim="data.nombre_cont" label="Nombre del contacto"
                            :rules="[val => !!val || 'Digite el nombre']" />

                        <q-input filled v-model.trim="data.correo_cont" label="Correo"
                            :rules="[val => !!val || 'Digite el correo']" />

                        <q-input filled v-model.trim="data.telefono_cont" label="Teléfono"
                            :rules="[val => !!val || 'Digite el teléfono']" />

                        <q-input filled v-model.trim="data.telefono_whats" label="Enlace para WhatsApp" />

                        <div style="display: flex; width: 96%; justify-content: flex-end;">
                            <q-btn :loading="loadingModal" padding="10px" type="submit" color="primary"
                                :label="estado" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Tabla -->
        <q-table :rows="rows" :columns="columns" row-key="nombre_cont" :loading="loadingTable"
            loading-label="Cargando..." :filter="filter" rows-per-page-label="Visualización de filas" page="2"
            :rows-per-page-options="[10, 20, 40, 0]" no-results-label="No hay resultados para la búsqueda."
            wrap-cells="false" label="Contactos Salones" style="width: 90%; margin-top: 40px;"
            no-data-label="No hay contactos registrados.">

            <template v-slot:top-left>
                <div style="display: flex; gap: 10px;">
                    <h4 id="titleTable">Contactos Salones</h4>
                    <q-btn @click="opciones.agregar" color="primary">
                        <q-icon name="add" color="white" center />
                    </q-btn>
                </div>
            </template>

            <template v-slot:top-right>
                <q-input outlined dense debounce="300" color="primary" v-model="filter" class="buscar"
                    placeholder="Buscar cualquier campo" id="boxBuscar">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
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
</style>