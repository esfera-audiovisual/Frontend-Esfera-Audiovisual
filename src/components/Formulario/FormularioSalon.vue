<script setup>
import { ref, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreSalon } from '../../stores/salon.js';
import { useStoreAmbienteSalon } from '../../stores/ambiente.js';
import { useStoreCiudad } from '../../stores/ciudad.js';
import { useStoreTipoSalon } from '../../stores/tipo.js';
import { useStoreEspacioSalon } from '../../stores/espacio.js';
import { useStoreServicioSalon } from '../../stores/servicio.js';
import { useStoreUbicacionSalon } from '../../stores/ubicacion.js';
import { useStoreContactoSalon } from '../../stores/contacto.js';

const $q = useQuasar();
const useSalonEvento = useStoreSalon();
const useCiudad = useStoreCiudad();
const useTipoEvento = useStoreAmbienteSalon();
const useTipoSalon = useStoreTipoSalon();
const useEspacio = useStoreEspacioSalon();
const useServicio = useStoreServicioSalon();
const useUbicacion = useStoreUbicacionSalon();
const useContactoSalon = useStoreContactoSalon();
const ciudades = ref([]);
const tipoEvento = ref([]);
const tipoSalon = ref([]);
const espacio = ref([]);
const servicio = ref([]);
const ubicacion = ref([]);
const contacto = ref([]);
const modalCrearServicio = ref(false);
const loading = ref(false);  // Variable para controlar el estado de carga
const nuevoServicio = ref('');  // Aquí almacenamos el nombre del nuevo servicio



function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
};

const modalServicios = ref(false);
const modalTiposEventos = ref(false);
const modalTiposSalon = ref(false);
const modalEspacios = ref(false);
const modalUbicaciones = ref(false);


const data = ref({
  idServiciosSalon: []  // Inicializa este campo como un array vacío
});


async function agregarServicio() {
  if (nuevoServicio.value.trim() === '') {
    notificar('negative', 'El nombre del servicio no puede estar vacío');
    return;
  }

  loading.value = true;  // Activamos el loading

  try {
    // Llamamos a la función de registro de la tienda Pinia
    const dataserv = { nombre_serv: nuevoServicio.value };
    console.log("data servicio", data)

    const response = await useServicio.registro(dataserv);
    // Notificar éxito
    console.log(response)
    if (useServicio.estatus === 200) {
      notificar('positive', 'Servicio creado exitosamente');
      data.value.idServiciosSalon.push(useServicio.nuevoServicioSalon);
      getServicios();
    }

    nuevoServicio.value = '';
  } catch (error) {
    console.error('Error al agregar servicio:', error);
    notificar('negative', 'Hubo un error al agregar el servicio');
  } finally {
    modalCrearServicio.value = false;
    loading.value = false;  // Desactivamos el loading cuando termina la petición

  }
}


async function getCiudades() {
  try {
    const response = await useCiudad.getAll();
    ciudades.value = response; // Asegúrate de que `ciudades` sea la propiedad correcta
    console.log(response);
  } catch (error) {
    console.error('Error al obtener ciudades:', error);
  }
}

async function getTipoEventos() {
  try {
    const response = await useTipoEvento.getAll();
    tipoEvento.value = response// Asegúrate de que `tipoEventos` sea la propiedad correcta
    console.log(response);
  } catch (error) {
    console.error('Error al obtener tipos de eventos:', error);
  }
}

async function getTipoSalones() {
  try {
    const response = await useTipoSalon.getAll();
    tipoSalon.value = response; // Asegúrate de que `tipoSalones` sea la propiedad correcta
    console.log(response);
  } catch (error) {
    console.error('Error al obtener tipos de salones:', error);
  }
}

async function getEspacios() {
  try {
    const response = await useEspacio.getAll();
    espacio.value = response; // Asegúrate de que `espacios` sea la propiedad correcta
    console.log(response);
  } catch (error) {
    console.error('Error al obtener espacios:', error);
  }
}

async function getServicios() {
  try {
    const response = await useServicio.getAll();
    servicio.value = response; // Asegúrate de que `servicios` sea la propiedad correcta
    console.log("servicios", servicio)
    console.log(response);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
  }
}

async function getUbicaciones() {
  try {
    const response = await useUbicacion.getAll();
    ubicacion.value = response; // Asegúrate de que `ubicaciones` sea la propiedad correcta
    console.log(response);
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
  }
}

async function getContactosSalon() {
  try {
    const response = await useContactoSalon.getAll();
    contacto.value = response; // Asegúrate de que `contactos` sea la propiedad correcta
    console.log(response);
  } catch (error) {
    console.error('Error al obtener contactos del salón:', error);
  }
}

function seleccionarServicio(seleccionado, servicioId) {
  // Verificamos que el array esté inicializado antes de hacer cualquier operación
  if (!Array.isArray(data.value.idServiciosSalon)) {
    data.value.idServiciosSalon = []; // Inicializamos como array vacío si no lo está
  }

  if (seleccionado) {
    // Si seleccionamos el servicio, lo añadimos al array solo si no existe ya
    if (!data.value.idServiciosSalon.includes(servicioId)) {
      data.value.idServiciosSalon.push(servicioId);
    }
  } else {
    // Si deseleccionamos el servicio, lo eliminamos del array si existe
    const index = data.value.idServiciosSalon.indexOf(servicioId);
    if (index > -1) {
      data.value.idServiciosSalon.splice(index, 1);
    }
  }

  console.log("soy data", data)
}


onMounted(() => {
  getCiudades();
  getTipoEventos();
  getTipoSalones();
  getEspacios();
  getServicios();
  getUbicaciones();
  getContactosSalon();
})

</script>

<template>
  <div class="formulario-salon">
    <q-card class="q-pa-md" style="margin: 30px 0;">
      <q-card-section>
        <!-- 1. Nombre del salón -->
        <div class="form-group">
          <p>Digite el nombre del salón:</p>
          <q-input v-model="data.nombre_sal" label="Nombre del salón" filled
            :rules="[val => !!val || 'Campo obligatorio']" />
        </div>

        <!-- 2. Seleccionar imágenes del salón -->
        <div class="form-group">
          <p>Seleccione las imágenes del salón:</p>
          <q-input v-model="data.galeria_sal" label="" filled type="file" accept="image/*" />
        </div>

        <!-- 3. Descripción del salón -->
        <div class="form-group">
          <p>Escriba la descripción del salón:</p>
          <q-input v-model="data.descripcion_sal" label="Descripción del salón" type="textarea" filled
            :rules="[val => !!val || 'Campo obligatorio']" />
        </div>

        <!-- 4. Capacidad mínima del salón -->
        <div class="form-group">
          <p>Especifique la capacidad mínima:</p>
          <q-input v-model.number="data.capacidad_min" label="Capacidad mínima" type="number" filled
            :rules="[val => val > 0 || 'Debe ser mayor a 0']" />
        </div>

        <!-- 5. Capacidad máxima del salón -->
        <div class="form-group">
          <p>Especifique la capacidad máxima:</p>
          <q-input v-model.number="data.capacidad_max" label="Capacidad máxima" type="number" filled
            :rules="[val => val > 0 || 'Debe ser mayor a 0']" />
        </div>

        <!-- 6. Dirección exacta del salón -->
        <div class="form-group">
          <p>Dirección exacta del salón de eventos:</p>
          <q-input v-model="data.direccion_sal" label="Dirección del salón" filled />
        </div>

        <!-- 7. Precio máximo del salón -->
        <div class="form-group">
          <p>Precio máximo del salón:</p>
          <q-input v-model.number="data.precio_sal" label="Precio del salón" type="number" filled
            :rules="[val => val > 0 || 'Debe ser mayor a 0']" />
        </div>

        <!-- 8. Latitud -->
        <div class="form-group">
          <p>Latitud:</p>
          <q-input v-model="data.latitud" label="Latitud" filled />
        </div>

        <!-- 9. Longitud -->
        <div class="form-group">
          <p>Longitud:</p>
          <q-input v-model="data.longitud" label="Longitud" filled />
        </div>

        <!-- 10. Enlace de video 360 -->
        <div class="form-group">
          <p>Enlace del video de realidad virtual o video 360 (opcional):</p>
          <q-input v-model="data.video360" label="URL de video 360 (opcional)" filled />
        </div>

        <!-- 11. Selección de tipos de eventos -->
        <div class="form-group">
          <p>Escoger los diferentes tipos de eventos que se pueden realizar en este salón:</p>
          <q-btn color="primary" @click="modalTiposEventos = true">Ver Tipos de Eventos</q-btn>
        </div>

        <!-- 12. Selección de tipos de salón -->
        <div class="form-group">
          <p>Escoger los diferentes tipos de salón:</p>
          <q-btn color="primary" @click="modalTiposSalon = true">Ver Tipos de Salón</q-btn>
        </div>

        <!-- 13. Selección de espacios -->
        <div class="form-group">
          <p>Escoger los diferentes espacios del salón:</p>
          <q-btn color="primary" @click="modalEspacios = true">Ver Espacios</q-btn>
        </div>

        <!-- 14. Selección de servicios -->
        <div class="form-group">
          <p>Escoger los diferentes servicios que ofrece el salón:</p>
          <q-btn color="primary" @click="modalServicios = true">Ver Servicios</q-btn>
        </div>

        <!-- 15. Selección de ubicación -->
        <div class="form-group">
          <p>Escoger la ubicación del salón:</p>
          <q-btn color="primary" @click="modalUbicaciones = true">Ver Ubicaciones</q-btn>
        </div>

        <!-- 16. Asignar contacto del salón -->
        <div class="form-group">
          <p>Asignar contacto del salón:</p>
          <q-btn color="primary" @click="modalUbicaciones = true">Asignar contacto</q-btn>
        </div>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: center;">
          <q-btn color="primary">Agregar Salón</q-btn>
        </div>
      </q-card-section>
    </q-card>

    <!-- Dialog for viewing/adding services -->
    <q-dialog v-model="modalServicios" persistent>
      <q-card style="min-width: 600px;">
        <q-card-section>
          <div class="q-pt-sm">
            <h6>Administrar Servicios del Salón</h6>
            <p>Seleccione los servicios que tiene el salón:</p>
            <q-list bordered separator>
              <!-- Listado de servicios con q-checkbox -->
              <q-item v-for="servicio in servicio" :key="servicio._id" clickable v-ripple>
                <q-item-section>
                  <q-checkbox :model-value="data.idServiciosSalon.includes(servicio._id)"
                    @update:model-value="val => seleccionarServicio(val, servicio._id)" :label="servicio.nombre_serv" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Aceptar" color="primary" v-close-popup />
          <!-- Botón para abrir el modal de crear servicio -->
          <q-btn flat label="Crear servicio" color="secondary" @click="modalCrearServicio = true" />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <!-- Modal crear servicio -->
    <q-dialog v-model="modalCrearServicio" persistent>
      <q-card style="min-width: 600px;">
        <q-card-section>
          <div class="q-pt-sm">
            <h6>Agregar nuevo servicio</h6>
            <p>Digite el nombre del nuevo servicio:</p>
            <q-input v-model="nuevoServicio" label="Nombre del servicio" filled />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Agregar" color="primary" :loading="loading" :disable="loading" @click="agregarServicio" />
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

.form-group {
  margin-bottom: 20px;
}

q-btn {
  margin-top: 10px;
}
</style>