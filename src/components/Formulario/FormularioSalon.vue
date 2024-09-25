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
const modalSeleccion = ref(false); // Controla la visibilidad del modal
const tipoSeleccion = ref(''); // Indica el tipo de selección actual
const tituloModal = ref(''); // Título dinámico del modal
const opcionesSeleccion = ref([]); // Opciones que se mostrarán en el modal
const arraySeleccionado = ref([]); // El array correspondiente a lo seleccionado
const modalCrear = ref(false); // Controla la visibilidad del modal de creación
const tipoCrear = ref(''); // Indica el tipo de atributo que se está creando (servicio, tipo_salon, etc.)
const nuevoElemento = ref(''); // Almacena el nombre del nuevo atributo que se está creando

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
};

const modalEspacios = ref(false);
const modalUbicaciones = ref(false);


const data = ref({
  idServiciosSalon: [], // Para almacenar las IDs de los servicios seleccionados
  idTipoSalon: [], // Para los tipos de salón
  idAmbienteSalon: [], // Para los tipos de eventos
  idEspaciosSalon: [], // Para los espacios del salón
  idUbicacionSalon: [], // Para las ubicaciones del salón
  idContactoSalon: [], // Para los contactos del salón
});

const nombreCampos = {
  servicios: 'nombre_serv',
  espacios: 'nombre_esp',
  ubicaciones: 'nombre_ubi',
  tipos_evento: 'nombre_amb',
  tipos_salon: 'nombre_tip',
  contactos: 'nombre_cont'
};


function abrirModalSeleccion(tipo) {
  tipoSeleccion.value = tipo;
  console.log("soy tipo", tipo)

  switch (tipo) {
    case 'servicios':
      tituloModal.value = 'Administrar Servicios del Salón';
      opcionesSeleccion.value = servicio.value; // Cargar los servicios disponibles
      arraySeleccionado.value = data.value.idServiciosSalon; // Selección previa
      break;
    case 'tipos_salon':
      tituloModal.value = 'Administrar Tipos de Salón';
      opcionesSeleccion.value = tipoSalon.value;
      arraySeleccionado.value = data.value.idTipoSalon;
      break;
    case 'tipos_evento':
      tituloModal.value = 'Administrar Tipos de Eventos';
      opcionesSeleccion.value = tipoEvento.value;
      arraySeleccionado.value = data.value.idAmbienteSalon;
      break;
    case 'espacios':
      tituloModal.value = 'Administrar Espacios del Salón';
      opcionesSeleccion.value = espacio.value;
      arraySeleccionado.value = data.value.idEspaciosSalon;
      break;
    case 'ubicaciones':
      tituloModal.value = 'Administrar Ubicaciones del Salón';
      opcionesSeleccion.value = ubicacion.value;
      arraySeleccionado.value = data.value.idUbicacionSalon;
      break;
    case 'contactos':
      tituloModal.value = 'Administrar Contactos del Salón';
      opcionesSeleccion.value = contacto.value;
      arraySeleccionado.value = data.value.idContactoSalon;
      break;
  }

  modalSeleccion.value = true; // Abre el modal
}

function abrirModalCrear(tipo) {

  tipoCrear.value = tipo; // Asignamos el tipo de atributo que se está creando
  nuevoElemento.value = ''; // Reiniciamos el campo de texto
  modalCrear.value = true; // Abrimos el modal de creación
}

async function agregarNuevoElemento() {
  if (nuevoElemento.value.trim() === '') {
    notificar('negative', `El nombre del ${tipoCrear.value} no puede estar vacío`);
    return;
  }

  loading.value = true;

  try {
    // Usamos el mapa para determinar el nombre del campo correcto
    const nombreCampo = nombreCampos[tipoCrear.value];
    const dataElemento = { [nombreCampo]: nuevoElemento.value };  // Creamos el objeto con el campo dinámico

    // Dependiendo del tipo, hacemos la llamada a la API adecuada
    let response;
    if (tipoCrear.value === 'servicios') {
      response = await useServicio.registro(dataElemento);
      if (useServicio.estatus === 200) {
        notificar('positive', `Servicio creado y agregado exitosamente`);
        data.value.idServiciosSalon.push(useServicio.nuevoServicioSalon);
        opcionesSeleccion.value.push(useServicio.nuevoServicio);
      }
    } else if (tipoCrear.value === 'tipos_salon') {
      response = await useTipoSalon.registro(dataElemento);
      if (useTipoSalon.estatus === 200) {
        notificar('positive', `Tipo salón creado y agregado exitosamente`);
        data.value.idTipoSalon.push(useTipoSalon.nuevoTipoSalon);
        opcionesSeleccion.value.push(useTipoSalon.nuevoTipo);
      }
    } else if (tipoCrear.value === 'tipos_evento') {
      response = await useTipoEvento.registro(dataElemento);
      if (useTipoEvento.estatus === 200) {
        notificar('positive', `Tipo evento creado y agregado exitosamente`);
        data.value.idAmbienteSalon.push(useTipoEvento.nuevoAmbiente);
        opcionesSeleccion.value.push(useTipoEvento.nuevoAmb);
      }
    } else if (tipoCrear.value === 'espacios') {
      response = await useEspacio.registro(dataElemento);
      if (useEspacio.estatus === 200) {
        notificar('positive', `Espacio creado y agregado exitosamente`);
        data.value.idEspaciosSalon.push(useEspacio.nuevoEspacioSalon);
        opcionesSeleccion.value.push(useEspacio.nuevoEspacio);
      }
    } else if (tipoCrear.value === 'ubicaciones') {
      response = await useUbicacion.registro(dataElemento);
      if (useUbicacion.estatus === 200) {
        notificar('positive', `Ubicación creada y agregada exitosamente`);
        data.value.idUbicacionSalon.push(useUbicacion.nuevaUbicacionSalon);
        opcionesSeleccion.value.push(useUbicacion.nuevaUbicacion);
      }
    } else if (tipoCrear.value === 'contactos') {
      response = await useContactoSalon.registro(dataElemento);
      if (useContactoSalon.estatus === 200) {
        notificar('positive', `Contacto creado y agregado exitosamente`);
        data.value.idContactoSalon.push(useContactoSalon.nuevoContactoSalon);
        opcionesSeleccion.value.push(useContactoSalon.nuevoContacto);
      }
    }
  } catch (error) {
    console.error(`Error al agregar ${tipoCrear.value}:`, error);
    notificar('negative', `Hubo un error al agregar el ${tipoCrear.value}`);
  } finally {
    modalCrear.value = false;
    loading.value = false;
  }
}



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

function seleccionarElemento(seleccionado, idElemento) {
  if (!Array.isArray(arraySeleccionado.value)) {
    arraySeleccionado.value = [];
  }

  if (seleccionado) {
    if (!arraySeleccionado.value.includes(idElemento)) {
      arraySeleccionado.value.push(idElemento);
    }
  } else {
    const index = arraySeleccionado.value.indexOf(idElemento);
    if (index > -1) {
      arraySeleccionado.value.splice(index, 1);
    }
  }

  console.log("Seleccionados:", arraySeleccionado.value);
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
}

function prueba() {
  console.log("soy prueba", data)
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
          <q-btn color="primary" @click="abrirModalSeleccion('tipos_evento')">Ver Tipos de Eventos</q-btn>
        </div>

        <!-- 12. Selección de tipos de salón -->
        <div class="form-group">
          <p>Escoger los diferentes tipos de salón:</p>
          <q-btn color="primary" @click="abrirModalSeleccion('tipos_salon')">Ver Tipos de Salón</q-btn>
        </div>

        <!-- 13. Selección de espacios -->
        <div class="form-group">
          <p>Escoger los diferentes espacios del salón:</p>
          <q-btn color="primary" @click="abrirModalSeleccion('espacios')">Ver Espacios</q-btn>
        </div>

        <!-- 14. Selección de servicios -->
        <div class="form-group">
          <p>Escoger los diferentes servicios que ofrece el salón:</p>
          <q-btn color="primary" @click="abrirModalSeleccion('servicios')">Ver Servicios</q-btn>
        </div>

        <!-- 15. Selección de ubicación -->
        <div class="form-group">
          <p>Escoger la ubicación del salón:</p>
          <q-btn color="primary" @click="abrirModalSeleccion('ubicaciones')">Ver Ubicaciones</q-btn>
        </div>

        <!-- 16. Asignar contacto del salón -->
        <div class="form-group">
          <p>Asignar contacto del salón:</p>
          <q-btn color="primary" @click="abrirModalSeleccion('contactos')">Ver Contactos</q-btn>
        </div>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: center;">
          <q-btn color="primary" @click="prueba()">Agregar Salón</q-btn>
        </div>
      </q-card-section>
    </q-card>

    <!-- Dialog for viewing/adding services -->
    <q-dialog v-model="modalSeleccion" persistent>
      <q-card style="min-width: 600px;">
        <q-card-section>
          <div class="q-pt-sm">
            <h6>{{ tituloModal }}</h6>
            <p>Seleccione las opciones correspondientes:</p>
            <q-list bordered separator>
              <q-item v-for="opcion in opcionesSeleccion" :key="opcion._id" clickable v-ripple>
                <q-item-section>
                  <q-checkbox :model-value="arraySeleccionado.includes(opcion._id)"
                    @update:model-value="val => seleccionarElemento(val, opcion._id)"
                    :label="opcion.nombre_amb || opcion.nombre_serv || opcion.nombre_tip || opcion.nombre_ubi || opcion.nombre_esp || opcion.nombre_cont" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Aceptar" color="primary" v-close-popup />
          <q-btn flat :label="`Crear ${tipoSeleccion}`" color="secondary" @click="abrirModalCrear(tipoSeleccion)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalCrear" persistent>
      <q-card style="min-width: 600px;">
        <q-card-section>
          <div class="q-pt-sm">
            <!-- El título cambia dinámicamente según el tipo de atributo -->
            <h6>Agregar nuevo {{ tipoCrear }}</h6>
            <p>Digite el nombre del nuevo {{ tipoCrear }}:</p>
            <!-- El input también es dinámico -->
            <q-input v-model="nuevoElemento" :label="`Nombre del ${tipoCrear}`" filled />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <!-- El botón también cambia su texto según el tipo de atributo -->
          <q-btn flat :label="`Agregar ${tipoCrear}`" color="primary" :loading="loading" :disable="loading"
            @click="agregarNuevoElemento" />
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