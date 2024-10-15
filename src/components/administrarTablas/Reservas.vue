<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreReserva } from '../../stores/reserva.js'; // Asegúrate de tener la store de reserva
import { useStoreSalon } from '../../stores/salon.js'; // Store de salones
import { useRouter } from 'vue-router';

const useReserva = useStoreReserva(); // Store para obtener y modificar reservas
const useSalon = useStoreSalon(); // Store para obtener salones
const loadingTable = ref(false); // Estado de carga para la tabla
const loadingModal = ref(false); // Estado de carga para el modal
const loadIn_activar = ref(false); // Estado de activación/inactivación
const filter = ref(""); // Filtro de búsqueda
const modal = ref(false); // Modal para agregar/editar
const router = useRouter(); // Router
const $q = useQuasar(); // Notificaciones
const viewModal = ref(false);  // Control the visibility of the view modal
const salones = ref([]); // Lista de salones de eventos
const selectedReserva = ref({});
const minDate = ref(getCurrentDate());

function formatDateLong(isoDate) {
    if (!isoDate) return 'Fecha no disponible';  // Maneja el caso donde no hay fecha

    // Convertir la fecha sin el desfase de zona horaria
    const fecha = new Date(isoDate);
    const userTimezoneOffset = fecha.getTimezoneOffset() * 60000; // Obtiene el desfase de la zona horaria

    // Ajustar la fecha a UTC para evitar el desfase de zona horaria
    const correctedDate = new Date(fecha.getTime() + userTimezoneOffset);

    // Verificar que la fecha sea válida
    if (isNaN(correctedDate.getTime())) {
        return 'Fecha no válida';  // Si la fecha no puede ser parseada correctamente
    }

    // Formateamos la fecha al formato deseado
    return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',  // Mes en formato largo (ej. octubre)
        year: 'numeric',
    }).format(correctedDate);
}



function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}


function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
};

const estado = ref('agregar'); // Estado de la operación: agregar o editar
const data = ref({}); // Datos de la reserva

// Columnas de la tabla
const columns = [
    { name: "nombre_cliente", label: "Nombre del cliente", field: "nombre_cliente", sortable: true, align: "left" },
    { name: "correo_cliente", label: "Correo", field: "correo_cliente", sortable: true, align: "center" },
    { name: "telefono_cliente", label: "Teléfono", field: "telefono_cliente", sortable: true, align: "center" },
    { name: "cant_pers_res", label: "Cantidad de personas", field: "cant_pers_res", sortable: true, align: "center" },
    {
        name: "fecha_res",
        label: "Fecha de reserva",
        field: (row) => {
            if (!row.fecha_res) return '';

            // Usamos toISOString() y split('T')[0] para asegurarnos que no haya desfase por zona horaria
            const fecha = new Date(row.fecha_res);
            return fecha.toISOString().split('T')[0]; // Formatea la fecha a yyyy-MM-dd
        },
        sortable: true,
        align: "center"
    },
    {
        name: "salon",
        label: "Salón",
        field: (row) => {
            return row.idSalonEvento ? row.idSalonEvento.nombre_sal : ''; // Verifica si existe el salón
        },
        sortable: true,
        align: "center"
    },

    { name: "estado", label: "Estado", field: "estado", sortable: true, align: "center" },
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];

const rows = ref([]); // Filas de la tabla (reservas)

// Función para obtener las reservas
async function getInfo() {
    try {
        loadingTable.value = true;
        const response = await useReserva.getAll();
        /* console.log(useReserva.reservas) */
        if (!response) return;
        if (response.error) {
            notificar('negative', response.error);
            return;
        };
        rows.value = useReserva.reservas.reverse(); // Muestra las reservas en orden inverso
    } catch (error) {
        console.log(error);
    } finally {
        loadingTable.value = false;
    }
}

async function getSalones() {
    try {
        const response = await useSalon.getAll(); // Llama a la función para obtener los salones
        if (!response || response.error) {
            notificar('negative', 'Error al obtener los salones');
            return;
        }
        salones.value = useSalon.salones; // Guarda los salones en la variable 'salones'
    } catch (error) {
        console.error('Error al obtener los salones', error);
    }
}

// Obtener las reservas al montar el componente
onMounted(() => {
    getInfo();
    getSalones(); // Traer los salones al montar el componente
});

// Opciones para agregar o editar una reserva
const opciones = {
    agregar: () => {
        data.value = {}; // Limpia el formulario
        estado.value = 'agregar';
        modal.value = true; // Abre el modal
    },
    editar: (info) => {
        data.value = { ...info }; // Rellena el formulario con la reserva seleccionada

        // Formatear la fecha sin incluir la hora
        if (info.fecha_res) {
            // Si `info.fecha_res` es un string en formato ISO (ej. "2024-10-05"), lo usamos directamente
            const fecha = typeof info.fecha_res === 'string'
                ? info.fecha_res.split('T')[0]  // Asegurar que tomamos solo la parte "yyyy-MM-dd"
                : new Date(info.fecha_res).toISOString().split('T')[0];  // Si es un objeto `Date`, convertimos a ISO

            data.value.fecha_res = fecha;  // Formato "yyyy-MM-dd" para el campo de tipo "date"
        }
        data.value.idSalonEvento = info.idSalonEvento ? info.idSalonEvento._id : null;
        estado.value = 'editar';
        modal.value = true;
    },
    ver: (info) => {
        selectedReserva.value = { ...info };  // Copy selected reservation data
        viewModal.value = true;  // Open the view modal
    }
};

// Funciones para enviar la reserva al backend
const enviarInfo = {
    agregar: async () => {
        try {
            loadingModal.value = true;
            const reservaData = { ...data.value };

            // La fecha ya está formateada en yyyy-MM-dd, no es necesario hacer nada más
            const response = await useReserva.registro(reservaData); // Agrega una reserva
            getInfo(); // Refresca la tabla
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };
            modal.value = false;
            notificar('positive', 'Reserva agregada exitosamente');
        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false;
        }
    },
    editar: async () => {
        loadingModal.value = true;
        try {
            const reservaData = { ...data.value };

            // Asegúrate de que solo estás enviando el ID del salón y la fecha en formato correcto
            /* console.log("Enviando data con idSalonEvento y fecha_res (sin cambio de zona horaria):", reservaData); */

            const response = await useReserva.editar(reservaData._id, reservaData); // Edita una reserva con el ID
            getInfo(); // Refresca la tabla
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            }
            rows.value.splice(buscarIndexLocal(response._id), 1, response); // Actualiza la tabla local
            modal.value = false;
            notificar('positive', 'Reserva editada exitosamente');
        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false;
        }
    }
};


// Validación de los campos del formulario antes de enviarlo
function validarCampos() {
    const arrData = Object.values(data.value);
    for (const d of arrData) {
        if (d === null || (typeof d === "string" && d.trim() === "")) {
            notificar('negative', 'Faltan campos por llenar');
            return;
        }
    }
    enviarInfo[estado.value](); // Llama la función de agregar o editar
}

// Funciones para activar/inactivar una reserva
const in_activar = {
    activar: async (id) => {
        loadIn_activar.value = true;
        try {
            const response = await useReserva.activar(id);
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            };
            rows.value.splice(buscarIndexLocal(response._id), 1, response); // Actualiza el estado de la reserva
        } catch (error) {
            console.log(error);
        } finally {
            loadIn_activar.value = false;
        }
    },
    inactivar: async (id) => {
        loadIn_activar.value = true;
        try {
            const response = await useReserva.inactivar(id);
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

// Función para buscar la posición de una reserva en el array local
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
                    <q-toolbar-title>{{ estado === 'agregar' ? 'Agregar' : 'Editar' }} Reserva</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>
                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">
                        <q-input filled v-model.trim="data.mensaje_res" label="Mensaje" type="textarea"
                            :rules="[val => !!val || 'Digite el mensaje']" />
                        <q-input filled v-model.trim="data.nombre_cliente" label="Nombre del cliente"
                            :rules="[val => !!val || 'Digite el nombre']" />
                        <q-input filled v-model.trim="data.correo_cliente" label="Correo"
                            :rules="[val => !!val || 'Digite el correo']" />
                        <q-input filled v-model.trim="data.telefono_cliente" label="Teléfono"
                            :rules="[val => !!val || 'Digite el teléfono']" />
                        <q-input filled v-model.trim="data.cant_pers_res" label="Cantidad de personas"
                            :rules="[val => !!val || 'Digite la cantidad']" />
                        <q-input filled v-model.trim="data.fecha_res" label="Fecha de reserva" type="date"
                            :min="minDate"
                            :rules="[val => !!val || 'Seleccione la fecha', val => (val >= minDate) || 'La fecha no puede ser anterior a la de hoy.']" />
                        <q-select filled v-model="data.idSalonEvento" label="Salón de Evento" :options="salones"
                            option-value="_id" option-label="nombre_sal" emit-value map-options
                            :rules="[val => !!val || 'Seleccione un salón']" />
                        <div style="display: flex; width: 96%; justify-content: flex-end;">
                            <q-btn :loading="loadingModal" padding="10px" type="submit" color="primary"
                                :label="estado" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Modal for Viewing the Reservation -->
        <q-dialog v-model="viewModal">
            <q-card style="min-width: 450px;">
                <q-toolbar class="bg-primary text-white">
                    <q-toolbar-title>Detalle de la Reserva</q-toolbar-title>
                    <q-btn flat dense icon="close" v-close-popup />
                </q-toolbar>

                <q-card-section>
                    <div>
                        <p><strong>Nombre del Cliente:</strong> {{ selectedReserva.nombre_cliente }}</p>
                        <p><strong>Correo del Cliente:</strong> {{ selectedReserva.correo_cliente }}</p>
                        <p><strong>Teléfono del Cliente:</strong> {{ selectedReserva.telefono_cliente }}</p>
                        <p><strong>Cantidad de Personas:</strong> {{ selectedReserva.cant_pers_res }}</p>
                        <p><strong>Fecha de Reserva:</strong> {{ formatDateLong(selectedReserva.fecha_res) }}</p>
                        <p><strong>Salón:</strong> {{ selectedReserva.idSalonEvento.nombre_sal }}</p>
                        <!-- Contact details from idSalonEvento.idContactoSalon -->
                        <p><strong>Contacto del Salón:</strong> {{
                            selectedReserva.idSalonEvento.idContactoSalon.nombre_cont }}</p>
                        <p><strong>Teléfono del Contacto:</strong> {{
                            selectedReserva.idSalonEvento.idContactoSalon.telefono_cont }}</p>
                        <p><strong>Correo del Contacto:</strong> {{
                            selectedReserva.idSalonEvento.idContactoSalon.correo_cont }}</p>
                        <p><strong>Mensaje de Cliente:</strong> {{
                            selectedReserva.mensaje_res }}</p>
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cerrar" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>


        <!-- Tabla -->
        <q-table :rows="rows" :columns="columns" row-key="nombre_cliente" :loading="loadingTable"
            loading-label="Cargando..." :filter="filter" rows-per-page-label="Visualización de filas"
            no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Reservas"
            style="width: 90%; margin-top: 40px;" no-data-label="No hay reservas registradas.">

            <template v-slot:top-left>
                <div style="display: flex; gap: 10px;">
                    <h4 id="titleTable">Reservas</h4>
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
                        <!-- New "View" button -->
                        <q-btn icon="visibility" color="secondary" @click="opciones.ver(props.row)" />
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