<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreCiudad } from '../../stores/ciudad.js';
import { useStoreDepartamentoSalonEvento } from '../../stores/departamento.js';  // Import the store for departments
import { useRouter } from 'vue-router';

const useCiudad = useStoreCiudad();
const useDepartamento = useStoreDepartamentoSalonEvento(); // Store to fetch departments
const loadingTable = ref(false);
const loadingModal = ref(false);
const loadIn_activar = ref(false);
const nombre_depart = ref('');
const departamentos = ref([]); // Store the list of departments
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

// Computed property to handle idDepart binding
const selectedDepartamentoId = computed({
    get() {
        // Return only the _id when reading the value
        return data.value.idDepart ? data.value.idDepart : null;
    },
    set(value) {
        // Set the _id as the value when updating
        data.value.idDepart = value;
    }
});

const columns = [
    { name: "nombre_ciud", label: "Nombre de la ciudad", field: "nombre_ciud", sortable: true, align: "left" },
    { name: "latitud", label: "Latitud", field: "latitud", sortable: true, align: "center" },
    { name: "longitud", label: "Longitud", field: "longitud", sortable: true, align: "center" },
    {
        name: "departamento",
        label: "Departamento",
        field: (row) => {
            return row.idDepart ? row.idDepart.nombre_depart : '';
        },
        sortable: true,
        align: "left"
    },
    { name: "estado", label: "Estado", field: "estado", sortable: true, align: "center" },
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];

const rows = ref([]);

onMounted(() => {
    const idDepartamento = router.currentRoute.value.query.departamento; // Obtén el departamento de la URL
    getDepartamentos(); // Cargar la lista de departamentos

    if (idDepartamento) {
        // Si existe un departamento en la ruta, cargar las ciudades de ese departamento
        getCiudadesPorDepartamento(idDepartamento);
    } else {
        getInfo(); // Cargar todas las ciudades si no hay un departamento en la ruta
    }
});


async function getDepartamentos() {
    try {
        const response = await useDepartamento.getAll();
        if (!response) return;
        if (response.error) {
            notificar('negative', response.error);
            return;
        };
        departamentos.value = response;
    } catch (error) {
        console.log(error);
    }
}

async function getCiudadesPorDepartamento(idDepartamento) {
    try {
        loadingTable.value = true;
        const response = await useCiudad.getCiudadesPorDepartamento(idDepartamento);
        if (!response) return;
        if (response.error) {
            notificar('negative', response.error);
            return;
        }
        rows.value = response.reverse();
        nombre_depart.value = useDepartamento.departamentoCiudad.nombre_depart;
    } catch (error) {
        console.log(error);
    } finally {
        loadingTable.value = false;
    }
}

async function getInfo() {
    try {
        loadingTable.value = true;
        const response = await useCiudad.getAll();
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
    }
}

const opciones = {
    agregar: () => {
        data.value = {}; // Limpiar los datos anteriores

        const idDepartamento = router.currentRoute.value.query.departamento; // Obtener el id del departamento desde la URL
        if (idDepartamento) {
            // Si el usuario viene desde el componente de departamentos, preseleccionamos el departamento
            const selectedDepartamento = departamentos.value.find(dep => dep._id === idDepartamento);
            if (selectedDepartamento) {
                data.value.idDepart = selectedDepartamento._id; // Preselecciona el ID del departamento en data
            }
        }

        estado.value = 'agregar'; // Cambiamos el estado para saber que estamos agregando una nueva ciudad
        modal.value = true; // Mostramos el modal
    },
    editar: (info) => {
        data.value = { ...info }; // Copiamos los datos de la ciudad que queremos editar
        estado.value = 'editar'; // Cambiamos el estado a "editar"
        modal.value = true; // Mostramos el modal
    }
};



const enviarInfo = {
    agregar: async () => {
        try {
            loadingModal.value = true;

            // Asegúrate de que solo se envíe el _id del departamento
            const dataToSend = {
                ...data.value,
                idDepart: data.value.idDepart // Aquí solo se envía el _id del departamento
            };

            const response = await useCiudad.registro(dataToSend); // Enviar los datos limpios al backend
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };

            const idDepartamento = router.currentRoute.value.query.departamento;
            if (idDepartamento) {
                // Si existe un departamento en la URL, recargar solo las ciudades de ese departamento
                await getCiudadesPorDepartamento(idDepartamento);
            }

            rows.value.splice(buscarIndexLocal(response._id), 1, response);
            modal.value = false; // Cerrar el modal
            notificar('positive', 'Ciudad agregada exitosamente');
        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false;
        }
    },
    editar: async () => {
        loadingModal.value = true;
        try {
            // Asegurarse de que solo se envíe el _id del departamento
            const dataToSend = {
                ...data.value,
                idDepart: data.value.idDepart ? data.value.idDepart._id : null // Solo guarda el _id del departamento
            };
            const response = await useCiudad.editar(dataToSend._id, dataToSend); // Enviar los datos limpios
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            }

            // 1. Elimina la ciudad editada de su posición actual

            // 2. Inserta la ciudad editada en la primera posición del array


            // Verificar si estás en el departamento filtrado
            const idDepartamento = router.currentRoute.value.query.departamento;
            if (idDepartamento) {
                // Si el usuario está en un departamento, recargar solo las ciudades de ese departamento
                await getCiudadesPorDepartamento(idDepartamento);
                const index = buscarIndexLocal(response._id);
                rows.value.splice(index, 1);
                rows.value.unshift(response);
            } else {
                // Si no hay departamento, cargar todas las ciudades (en caso de ser necesario)
                await getInfo();
                const index = buscarIndexLocal(response._id);
                rows.value.splice(index, 1);
                rows.value.unshift(response);
            }

            modal.value = false;
            notificar('positive', 'Ciudad editada exitosamente');
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
            const response = await useCiudad.activar(id);
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
            const response = await useCiudad.inactivar(id);
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
    <main style=" width: 100%; display: flex; justify-content: center; flex-direction: column; align-items: center;">
        <!-- Modal -->
        <q-dialog v-model="modal">
            <q-card class="modal" style="width: 450px;">
                <q-toolbar class="bg-primary" style="color: white">
                    <q-toolbar-title>{{ estado === 'agregar' ? 'Agregar' : 'Editar' }} Ciudad</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>
                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">
                        <!-- Nombre de la Ciudad -->
                        <q-input filled v-model.trim="data.nombre_ciud" label="Nombre de la ciudad"
                            :rules="[val => !!val || 'Digite el nombre']" />

                        <!-- Departamento Select -->
                        <q-select filled v-model="data.idDepart" label="Seleccione un departamento"
                            :options="departamentos" option-value="_id" option-label="nombre_depart" map-options
                            :rules="[val => !!val || 'Seleccione un departamento']" />


                        <!-- Latitud -->
                        <q-input filled v-model.trim="data.latitud" label="Latitud de la ciudad"
                            :rules="[val => !!val || 'Digite la latitud']" />

                        <!-- Longitud -->
                        <q-input filled v-model.trim="data.longitud" label="Longitud de la ciudad"
                            :rules="[val => !!val || 'Digite la longitud']" />

                        <div style="display: flex; width: 96%; justify-content: flex-end;">
                            <q-btn :loading="loadingModal" padding="10px" type="submit" color="primary"
                                :label="estado" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Tabla -->
        <q-table :rows="rows" :columns="columns" row-key="nombre_ciud" :loading="loadingTable"
            loading-label="Cargando..." :filter="filter" rows-per-page-label="Visualización de filas"
            no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Ciudades"
            style="width: 90%; margin-top: 40px;" no-data-label="No hay ciudades registradas.">

            <template v-slot:top-left>
                <div style="display: flex; gap: 10px;">
                    <h4 id="titleTable">Ciudades <span v-if="nombre_depart">de {{ nombre_depart }}</span></h4>
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

        <div style="width: 90%;">
            <button class="btn-back bg-primary" @click="router.push('/panel-admin/departamento')">
                <i class="fa-solid fa-backward"></i> Volver
            </button>
        </div>
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

.btn-back {
    margin-top: 5px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 9em;
    height: 55px;
    border-radius: 15px;
    font-size: 15px;
    font-family: inherit;
    border: none;
    position: relative;
    overflow: hidden;
    z-index: 1;
    color: white;

}
</style>