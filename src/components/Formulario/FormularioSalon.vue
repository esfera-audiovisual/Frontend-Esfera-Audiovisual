<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStoreSalon } from '../../stores/salon.js'; // Store handling data
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const useSalonEvento = useStoreSalon();

const modalServicios = ref(false); // State for services modal
const serviciosDisponibles = ref([]); // List of all available services
const serviciosSeleccionados = ref([]); // Selected services for the salon

const data = ref({
    nombre_sal: '',
    descripcion_sal: '',
    galeria_sal: [{ url: '', publicId: '' }],
    capacidad_min: null,
    capacidad_max: null,
    direccion_sal: '',
    precio_sal: null,
    latitud: '',
    longitud: '',
    video360: '',
    foto360: '',
    idCiudSalonEvento: '',
    idContactoSalon: '',
    idAmbienteSalon: [],
    idEspaciosSalon: [],
    idServiciosSalon: [],
    idTipoSalon: [],
    idUbicacionSalon: [],
});

// Options for q-select fields
const ciudadesOptions = ref([]);
const contactosOptions = ref([]);
const ambientesOptions = ref([]);
const espaciosOptions = ref([]);
const serviciosOptions = ref([]);
const tiposOptions = ref([]);
const ubicacionesOptions = ref([]);

const isEditMode = ref(false); // To differentiate between Add/Edit mode

// Check if there's an "id" in query params, if so it's an Edit form
const salonId = route.query.id || null;

// Fetch the salonEvento data if in edit mode
onMounted(async () => {
    if (salonId) {
        isEditMode.value = true;
        try {
            const response = await useSalonEvento.getPorId(salonId); // Fetch the salon data by ID
            if (response && !response.error) {
                data.value = { ...response };
                serviciosSeleccionados.value = [...data.value.idServiciosSalon]; // Populate selected services
            } else {
                $q.notify({ type: 'negative', message: response.error || 'Error fetching data' });
            }
        } catch (error) {
            console.error(error);
            $q.notify({ type: 'negative', message: 'Failed to load data' });
        }
    }
    await fetchRelatedData(); // Fetch related tables (Ciudades, Contactos, etc.)
});

// Fetch all related data (Ciudades, Contactos, Ambientes, etc.)
async function fetchRelatedData() {
    try {
        // Simulate fetching related data
        ciudadesOptions.value = await useSalonEvento.getCiudades();
        contactosOptions.value = await useSalonEvento.getContactos();
        ambientesOptions.value = await useSalonEvento.getAmbientes();
        espaciosOptions.value = await useSalonEvento.getEspacios();
        serviciosOptions.value = await useSalonEvento.getServicios(); // Available services
        tiposOptions.value = await useSalonEvento.getTipos();
        ubicacionesOptions.value = await useSalonEvento.getUbicaciones();

        serviciosDisponibles.value = [...serviciosOptions.value]; // Load available services in modal
    } catch (error) {
        console.error('Error fetching related data:', error);
    }
}

// Form submission
async function submitForm() {
    data.value.idServiciosSalon = [...serviciosSeleccionados.value]; // Update selected services before submitting
    try {
        if (isEditMode.value) {
            const response = await useSalonEvento.editar(salonId, data.value); // Update salon
            if (response && !response.error) {
                $q.notify({ type: 'positive', message: 'Salón actualizado exitosamente' });
                router.push('/panel-admin/salones');
            } else {
                $q.notify({ type: 'negative', message: response.error });
            }
        } else {
            const response = await useSalonEvento.registro(data.value); // Create new salon
            if (response && !response.error) {
                $q.notify({ type: 'positive', message: 'Salón agregado exitosamente' });
                router.push('/panel-admin/salones');
            } else {
                $q.notify({ type: 'negative', message: response.error });
            }
        }
    } catch (error) {
        console.error(error);
        $q.notify({ type: 'negative', message: 'Error al enviar los datos' });
    }
}

</script>

<template>
    <div class="formulario-salon">
        <q-card class="q-pa-md">
            <q-card-section>
                <q-form @submit="submitForm">

                    <!-- Nombre del salón -->
                    <p>Digite el nombre del salón:</p>
                    <q-input v-model="data.nombre_sal" label="Nombre del salón" filled :rules="[val => !!val || 'Campo obligatorio']" />

                    <!-- Descripción -->
                    <p>Escriba la descripción del salón:</p>
                    <q-input v-model="data.descripcion_sal" label="Descripción del salón" type="textarea" filled :rules="[val => !!val || 'Campo obligatorio']" />

                    <!-- Galería de imágenes -->
                    <p>Galería de imágenes:</p>
                    <q-input v-model="data.galeria_sal[0].url" label="URL de imagen" filled />
                    <q-input v-model="data.galeria_sal[0].publicId" label="ID público de imagen" filled />

                    <!-- Capacidades mínima y máxima -->
                    <p>Especifique la capacidad mínima:</p>
                    <q-input v-model.number="data.capacidad_min" label="Capacidad mínima" type="number" filled :rules="[val => val > 0 || 'Debe ser mayor a 0']" />

                    <p>Especifique la capacidad máxima:</p>
                    <q-input v-model.number="data.capacidad_max" label="Capacidad máxima" type="number" filled :rules="[val => val > 0 || 'Debe ser mayor a 0']" />

                    <!-- Dirección -->
                    <p>Dirección del salón:</p>
                    <q-input v-model="data.direccion_sal" label="Dirección del salón" filled />

                    <!-- Precio del salón -->
                    <p>Precio del salón:</p>
                    <q-input v-model.number="data.precio_sal" label="Precio del salón" type="number" filled :rules="[val => val > 0 || 'Debe ser mayor a 0']" />

                    <!-- Coordenadas -->
                    <p>Latitud:</p>
                    <q-input v-model="data.latitud" label="Latitud" filled />
                    <p>Longitud:</p>
                    <q-input v-model="data.longitud" label="Longitud" filled />

                    <!-- Video 360 -->
                    <p>URL del video 360:</p>
                    <q-input v-model="data.video360" label="URL de video 360 (opcional)" filled />

                    <!-- Foto 360 -->
                    <p>URL de la foto 360:</p>
                    <q-input v-model="data.foto360" label="URL de foto 360 (opcional)" filled />

                    <!-- Select for related IDs (Ciud, Contacto, etc.) -->
                    <p>Seleccione la ciudad del salón:</p>
                    <q-select v-model="data.idCiudSalonEvento" label="Ciudad del salón" :options="ciudadesOptions" option-label="nombre" filled />

                    <p>Seleccione el contacto del salón:</p>
                    <q-select v-model="data.idContactoSalon" label="Contacto del salón" :options="contactosOptions" option-label="nombre" filled />

                    <!-- Multiple Selects for IDs with many-to-many relationships -->
                    <p>Seleccione los ambientes del salón:</p>
                    <q-select v-model="data.idAmbienteSalon" label="Ambientes del salón" :options="ambientesOptions" option-label="nombre" filled multiple />

                    <p>Seleccione los espacios del salón:</p>
                    <q-select v-model="data.idEspaciosSalon" label="Espacios del salón" :options="espaciosOptions" option-label="nombre" filled multiple />

                    <!-- Servicios Section -->
                    <p>Seleccione los servicios del salón:</p>
                    <q-btn color="primary" @click="modalServicios = true">Ver Servicios</q-btn>
                    <q-checkbox v-for="servicio in serviciosOptions" v-model="serviciosSeleccionados" :val="servicio._id" :label="servicio.nombre" />

                    <p>Seleccione los tipos de salón:</p>
                    <q-select v-model="data.idTipoSalon" label="Tipos de salón" :options="tiposOptions" option-label="nombre" filled multiple />

                    <p>Seleccione las ubicaciones del salón:</p>
                    <q-select v-model="data.idUbicacionSalon" label="Ubicaciones del salón" :options="ubicacionesOptions" option-label="nombre" filled multiple />

                    <q-btn type="submit" color="primary" :label="isEditMode ? 'Actualizar' : 'Agregar'" />
                </q-form>
            </q-card-section>
        </q-card>

        <!-- Modal for viewing/adding services -->
        <q-dialog v-model="modalServicios" persistent>
            <q-card style="min-width: 600px;">
                <q-card-section>
                    <div class="q-pt-sm">
                        <h6>Administrar Servicios del Salón</h6>
                        <q-list bordered separator>
                            <q-item v-for="servicio in serviciosDisponibles" :key="servicio._id" clickable v-ripple>
                                <q-item-section>
                                    <q-checkbox v-model="serviciosSeleccionados" :val="servicio._id" :label="servicio.nombre" />
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cerrar" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<style scoped>
.formulario-salon {
    max-width: 600px;
    margin: 0 auto;
}
</style>
