<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreSalon } from '../../stores/salon.js';
import { useStoreAmbienteSalon } from '../../stores/ambiente.js';
import { useStoreCiudad } from '../../stores/ciudad.js';
import { useStoreTipoSalon } from '../../stores/tipo.js';
import { useStoreEspacioSalon } from '../../stores/espacio.js';
import { useStoreServicioSalon } from '../../stores/servicio.js';
import { useStoreUbicacionSalon } from '../../stores/ubicacion.js';
import { useStoreContactoSalon } from '../../stores/contacto.js';
import { useRouter } from 'vue-router'

const $q = useQuasar();
const router = useRouter();
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
const loading = ref(false);  // Variable para controlar el estado de carga
const modalSeleccion = ref(false); // Controla la visibilidad del modal
const modalContactoSalon = ref(false);
const modalGaleriaVisible = ref(false);
const tipoSeleccion = ref(''); // Indica el tipo de selección actual
const tituloModal = ref(''); // Título dinámico del modal
const opcionesSeleccion = ref([]); // Opciones que se mostrarán en el modal
const arraySeleccionado = ref([]); // El array correspondiente a lo seleccionado
const arrayContacto = ref([]);
const modalCrear = ref(false); // Controla la visibilidad del modal de creación
const modalCrearContacto = ref(false);
const tipoCrear = ref(''); // Indica el tipo de atributo que se está creando (servicio, tipo_salon, etc.)
const nuevoElemento = ref(''); // Almacena el nombre del nuevo atributo que se está creando
const searchQuery = ref('');
const salonId = ref(null);  // Guardar el id del salón
const editMode = ref(false);  // Modo edición

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
};

const data = ref({
  idCiudSalonEvento: null,
  galeria_sal: [],
  idServiciosSalon: [], // Para almacenar las IDs de los servicios seleccionados
  idTipoSalon: [], // Para los tipos de salón
  idAmbienteSalon: [], // Para los tipos de eventos
  idEspaciosSalon: [], // Para los espacios del salón
  idUbicacionSalon: [], // Para las ubicaciones del salón
  idContactoSalon: null, // Para los contactos del salón
});

const nombreCampos = {
  servicio: 'nombre_serv',
  espacio: 'nombre_esp',
  ubicacion: 'nombre_ubi',
  tipo_evento: 'nombre_amb',
  tipo_salon: 'nombre_tip',
};

const nuevoContacto = ref({
  nombre_cont: '',
  correo_cont: '',
  telefono_cont: ''
});

async function subirFotosSalon(files) {
  if (!files || files.length === 0) return;

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const response = await useSalonEvento.subirGrupoFotos(file);

      const imagenSubida = {
        url: response.secure_url,
        publicId: response.public_id,
      };

      data.value.galeria_sal.push(imagenSubida);  // Guardamos la imagen en el array
      console.log("Imagen subida:", imagenSubida);
    }
  } catch (error) {
    console.error("Error al subir las fotos:", error);
  }
}

// Function to handle file input change event
function onFileChange(event) {
  console.log("soy event", event)
  const files = event.target.files;
  subirFotosSalon(files);
}

// Updated function to remove image using publicId (without relying on position)
function removeImage(publicId) {
  if (!publicId) {
    notificar('negative', 'No se pudo encontrar el identificador de la imagen.');
    return;
  }

  try {
    const index = data.value.galeria_sal.findIndex(img => img.publicId === publicId);
    if (index !== -1) {
      data.value.galeria_sal.splice(index, 1);
      console.log("Imagen eliminada de la galería:", publicId);
    } else {
      notificar('negative', 'Imagen no encontrada en la galería.');
    }
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    notificar('negative', 'Hubo un error al eliminar la imagen.');
  }
}

async function cargarSalon(id) {
  try {
    const response = await useSalonEvento.getPorId(id);
    if (response) {
      data.value = {
        ...data.value,
        ...response,
        idCiudSalonEvento: response.idCiudSalonEvento._id,  // Asegúrate de que solo sea el _id
        idContactoSalon: response.idContactoSalon?._id || null,
        idAmbienteSalon: response.idAmbienteSalon.map(ambiente => ambiente._id),  // Solo los _ids de los ambientes
        idEspaciosSalon: response.idEspaciosSalon.map(espacio => espacio._id),
        idServiciosSalon: response.idServiciosSalon.map(servicio => servicio._id),
        idTipoSalon: response.idTipoSalon.map(tipo => tipo._id),
        idUbicacionSalon: response.idUbicacionSalon.map(ubicacion => ubicacion._id),
      };
      arrayContacto.value = response.idContactoSalon?._id || null;
    }
  } catch (error) {
    notificar('negative', 'Error al cargar los datos del salón.');
    console.error('Error al cargar salón:', error);
  }
}


function abrirModalSeleccion(tipo) {
  tipoSeleccion.value = tipo;
  console.log("soy tipo", tipo)

  switch (tipo) {
    case 'servicio':
      tituloModal.value = 'Administrar Servicios del Salón';
      opcionesSeleccion.value = servicio.value; // Cargar los servicios disponibles
      arraySeleccionado.value = data.value.idServiciosSalon; // Selección previa
      break;
    case 'tipo_salon':
      tituloModal.value = 'Administrar Tipos de Salón';
      opcionesSeleccion.value = tipoSalon.value;
      arraySeleccionado.value = data.value.idTipoSalon;
      break;
    case 'tipo_evento':
      tituloModal.value = 'Administrar Tipos de Eventos';
      opcionesSeleccion.value = tipoEvento.value;
      arraySeleccionado.value = data.value.idAmbienteSalon;
      break;
    case 'espacio':
      tituloModal.value = 'Administrar Espacios del Salón';
      opcionesSeleccion.value = espacio.value;
      arraySeleccionado.value = data.value.idEspaciosSalon;
      break;
    case 'ubicacion':
      tituloModal.value = 'Administrar Ubicaciones del Salón';
      opcionesSeleccion.value = ubicacion.value;
      arraySeleccionado.value = data.value.idUbicacionSalon;
      break;
  }

  modalSeleccion.value = true; // Abre el modal
}

function abrirModalCrear(tipo) {
  tipoCrear.value = tipo; // Asignamos el tipo de atributo que se está creando
  nuevoElemento.value = ''; // Reiniciamos el campo de texto
  modalCrear.value = true; // Abrimos el modal de creación
}

function abrirModalContacto() {
  // Asigna el valor del contacto actual al abrir el modal
  if (data.value.idContactoSalon) {
    arraySeleccionado.value = data.value.idContactoSalon; // Contacto previamente seleccionado
  }
  modalContactoSalon.value = true;
}

function abrirModalGaleria() {
  modalGaleriaVisible.value = true;
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
    if (tipoCrear.value === 'servicio') {
      response = await useServicio.registro(dataElemento);
      if (useServicio.estatus === 200) {
        notificar('positive', `Servicio creado y agregado exitosamente`);
        data.value.idServiciosSalon.push(useServicio.nuevoServicioSalon);
        opcionesSeleccion.value.push(useServicio.nuevoServicio);
      }
    } else if (tipoCrear.value === 'tipo_salon') {
      response = await useTipoSalon.registro(dataElemento);
      if (useTipoSalon.estatus === 200) {
        notificar('positive', `Tipo salón creado y agregado exitosamente`);
        data.value.idTipoSalon.push(useTipoSalon.nuevoTipoSalon);
        opcionesSeleccion.value.push(useTipoSalon.nuevoTipo);
      }
    } else if (tipoCrear.value === 'tipo_evento') {
      response = await useTipoEvento.registro(dataElemento);
      if (useTipoEvento.estatus === 200) {
        notificar('positive', `Tipo evento creado y agregado exitosamente`);
        data.value.idAmbienteSalon.push(useTipoEvento.nuevoAmbiente);
        opcionesSeleccion.value.push(useTipoEvento.nuevoAmb);
      }
    } else if (tipoCrear.value === 'espacio') {
      response = await useEspacio.registro(dataElemento);
      if (useEspacio.estatus === 200) {
        notificar('positive', `Espacio creado y agregado exitosamente`);
        data.value.idEspaciosSalon.push(useEspacio.nuevoEspacioSalon);
        opcionesSeleccion.value.push(useEspacio.nuevoEspacio);
      }
    } else if (tipoCrear.value === 'ubicacion') {
      response = await useUbicacion.registro(dataElemento);
      if (useUbicacion.estatus === 200) {
        notificar('positive', `Ubicación creada y agregada exitosamente`);
        data.value.idUbicacionSalon.push(useUbicacion.nuevaUbicacionSalon);
        opcionesSeleccion.value.push(useUbicacion.nuevaUbicacion);
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

async function agregarNuevoContacto() {
  if (
    nuevoContacto.value.nombre_cont.trim() === '' ||
    nuevoContacto.value.correo_cont.trim() === '' ||
    nuevoContacto.value.telefono_cont.trim() === ''
  ) {
    notificar('negative', 'Todos los campos del contacto deben estar completos');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(nuevoContacto.value.correo_cont)) {
    notificar('negative', 'Ingrese un correo electrónico válido');
    return;
  }

  loading.value = true;
  try {
    const dataContacto = {
      nombre_cont: nuevoContacto.value.nombre_cont,
      correo_cont: nuevoContacto.value.correo_cont,
      telefono_cont: nuevoContacto.value.telefono_cont
    };

    const response = await useContactoSalon.registro(dataContacto);
    if (useContactoSalon.estatus === 200) {
      notificar('positive', 'Contacto creado y agregado exitosamente');

      // Agregamos el nuevo contacto a la lista de contactos disponibles
      contacto.value.push(useContactoSalon.nuevoContacto);

      // Asignamos el nuevo contacto como seleccionado
      const nuevoContactoId = useContactoSalon.nuevoContactoSalon;
      data.value.idContactoSalon = nuevoContactoId;
      arrayContacto.value = nuevoContactoId;
      console.log("agregar contacto", nuevoContactoId)

      // Limpiar el formulario
      nuevoContacto.value = {
        nombre_cont: '',
        correo_cont: '',
        telefono_cont: ''
      };
    }
  } catch (error) {
    console.error('Error al agregar contacto:', error);
    notificar('negative', 'Hubo un error al agregar el contacto');
  } finally {
    modalCrearContacto.value = false;
    loading.value = false;
  }
}

async function getCiudades() {
  try {
    const response = await useCiudad.getAll();
    ciudades.value = response;
    console.log(response);
  } catch (error) {
    console.error('Error al obtener ciudades:', error);
  }
}

async function getTipoEventos() {
  try {
    const response = await useTipoEvento.getAll();
    tipoEvento.value = response;
    console.log(response);
  } catch (error) {
    console.error('Error al obtener tipos de eventos:', error);
  }
}

async function getTipoSalones() {
  try {
    const response = await useTipoSalon.getAll();
    tipoSalon.value = response;
  } catch (error) {
    console.error('Error al obtener tipos de salones:', error);
  }
}

async function getEspacios() {
  try {
    const response = await useEspacio.getAll();
    espacio.value = response;
    console.log(response);
  } catch (error) {
    console.error('Error al obtener espacios:', error);
  }
}

async function getServicios() {
  try {
    const response = await useServicio.getAll();
    servicio.value = response;
    console.log("servicios", servicio)
    console.log(response);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
  }
}

async function getUbicaciones() {
  try {
    const response = await useUbicacion.getAll();
    ubicacion.value = response;
    console.log(response);
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
  }
}

async function getContactosSalon() {
  try {
    const response = await useContactoSalon.getAll();
    contacto.value = response;
    console.log(response);
  } catch (error) {
    console.error('Error al obtener contactos del salón:', error);
  }
}

function customFilter(val, update) {
  searchQuery.value = val.toLowerCase(); // Solo actualiza searchQuery
  update();  // Deja que Vue actualice los datos basados en la propiedad computada
}

// Ciudades filtradas
const filteredCiudades = computed(() => {
  return ciudades.value.map(ciudad => ({
    _id: ciudad._id,
    label: `${ciudad.nombre_ciud}, ${ciudad.idDepart.nombre_depart}` // Asegúrate de que la etiqueta contenga ciudad y departamento
  }));
});


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

function seleccionarContacto(val, opcion) {
  if (val) {
    data.value.idContactoSalon = opcion._id;  // Actualiza con el ID del contacto seleccionado
    arrayContacto.value = opcion._id;
  } else {
    data.value.idContactoSalon = null;  // Puedes manejar la deselección si lo prefieres
  }
  console.log("Contacto seleccionado:", data.value.idContactoSalon);
}


// Validar campos de data antes de enviar
function validarData() {
  // Definir las reglas de validación para cada campo
  if (!data.value.idCiudSalonEvento) {
    notificar('negative', 'Debe seleccionar una ciudad para el salón.');
    return false;
  }

  if (!data.value.nombre_sal || data.value.nombre_sal.trim() === '') {
    notificar('negative', 'El nombre del salón es obligatorio.');
    return false;
  }

  if (!data.value.descripcion_sal || data.value.descripcion_sal.trim() === '') {
    notificar('negative', 'La descripción del salón es obligatoria.');
    return false;
  }

  if (!data.value.capacidad_min || data.value.capacidad_min <= 0) {
    notificar('negative', 'La capacidad mínima debe ser mayor a 0.');
    return false;
  }

  if (!data.value.capacidad_max || data.value.capacidad_max <= 0 || data.value.capacidad_max < data.value.capacidad_min) {
    notificar('negative', 'La capacidad máxima debe ser mayor a la mínima.');
    return false;
  }

  if (!data.value.precio_sal || data.value.precio_sal <= 0) {
    notificar('negative', 'El precio debe ser mayor a 0.');
    return false;
  }

  if (!data.value.direccion_sal || data.value.direccion_sal.trim() === '') {
    notificar('negative', 'La dirección del salón es obligatoria.');
    return false;
  }

  // Opcional: validaciones para latitud y longitud si es que son obligatorias
  if (!data.value.latitud || !data.value.longitud) {
    notificar('negative', 'Debe proporcionar las coordenadas del salón.');
    return false;
  }

  // Validar que al menos un tipo de evento esté seleccionado
  if (!data.value.idAmbienteSalon.length) {
    notificar('negative', 'Debe seleccionar al menos un tipo de evento.');
    return false;
  }

  // Validar que al menos un tipo de salón esté seleccionado
  if (!data.value.idTipoSalon.length) {
    notificar('negative', 'Debe seleccionar al menos un tipo de salón.');
    return false;
  }

  // Validar que al menos un servicio esté seleccionado
  if (!data.value.idServiciosSalon.length) {
    notificar('negative', 'Debe seleccionar al menos un servicio.');
    return false;
  }

  // Validar que al menos una ubicación esté seleccionada
  if (!data.value.idUbicacionSalon.length) {
    notificar('negative', 'Debe seleccionar al menos una ubicación.');
    return false;
  }

  // Validar que un contacto esté asignado
  if (!data.value.idContactoSalon) {
    notificar('negative', 'Debe asignar un contacto al salón.');
    return false;
  }

  // Si todo está correcto
  return true;
}

async function agregarSalon() {
  // Primero validamos los datos
  if (!validarData()) {
    return;  // Si la validación falla, detenemos el flujo
  }

  loading.value = true;  // Mostramos un indicador de carga

  try {
    // Enviar la petición para registrar el salón
    const response = await useSalonEvento.registro(data.value);

    if (useSalonEvento.estatus === 200) {
      notificar('positive', 'El salón ha sido registrado exitosamente.');
      router.push('/panel-admin/salon-evento')
      // Aquí puedes limpiar el formulario o redirigir si es necesario
      limpiarFormulario();
    } else {
      notificar('negative', 'Hubo un error al registrar el salón.');
    }
  } catch (error) {
    console.error('Error al registrar el salón:', error);
    notificar('negative', 'Hubo un error en el registro.');
  } finally {
    loading.value = false;  // Ocultamos el indicador de carga
  }
}

// Función para editar salón
async function editarSalon() {
  if (!validarData()) return;  // Valida los datos antes de enviarlos

  loading.value = true;
  try {
    const response = await useSalonEvento.editar(salonId.value, data.value);  // Edita el salón con el id y los nuevos datos
    if (response) {
      notificar('positive', 'El salón ha sido actualizado exitosamente.');
      router.push('/panel-admin/salon-evento');  // Redirigir a la lista de salones
    }
  } catch (error) {
    notificar('negative', 'Error al actualizar el salón.');
    console.error('Error al actualizar salón:', error);
  } finally {
    loading.value = false;
  }
}


function limpiarFormulario() {
  // Resetear el objeto `data` para limpiar el formulario
  data.value = {
    galeria_sal: [],
    idCiudSalonEvento: null,
    idServiciosSalon: [],
    idTipoSalon: [],
    idAmbienteSalon: [],
    idEspaciosSalon: [],
    idUbicacionSalon: [],
    idContactoSalon: null,
    nombre_sal: '',
    descripcion_sal: '',
    capacidad_min: null,
    capacidad_max: null,
    direccion_sal: '',
    precio_sal: null,
    latitud: '',
    longitud: '',
    video360: '',
  };
}


onMounted(async () => {
  const id = useSalonEvento.idSalonSelec;  // Obtener el id del salón de la ruta

  if (id) {
    // Modo edición
    salonId.value = id;  // Guardar el id en la referencia
    editMode.value = true;  // Cambiar a modo edición
    await cargarSalon(id);  // Cargar los datos del salón
  } else {
    // Modo agregar
    limpiarFormulario();  // Limpiar datos si no hay id
    editMode.value = false;  // Cambiar a modo creación
  }

  // Cargar listas desde los stores
  getCiudades();
  getTipoEventos();
  getTipoSalones();
  getEspacios();
  getServicios();
  getUbicaciones();
  getContactosSalon();
});

</script>

<template>
  <div class="formulario-salon">
    <q-card class="q-pa-md" style="margin: 30px 0;">
      <q-card-section>
        <!-- 1. Ciudad del salón -->
        <div class="form-group">
          <p>Seleccione la ciudad del salón:</p>
          <q-select v-model="data.idCiudSalonEvento" :options="filteredCiudades" option-value="_id" option-label="label"
            label="Seleccionar ciudad" filled emit-value map-options use-input input-debounce="0"
            hint="Escriba para buscar una ciudad" :rules="[val => !!val || 'Debe seleccionar una ciudad']"
            no-options-value="Sin coincidencias" @filter="customFilter" />
        </div>

        <!-- 1. Nombre del salón -->
        <div class="form-group">
          <p>Digite el nombre del salón:</p>
          <q-input v-model="data.nombre_sal" label="Nombre del salón" filled
            :rules="[val => !!val || 'Digite el nombre del salón']" />
        </div>
        <!-- 2. Seleccionar imágenes del salón -->
        <div class="form-group">
          <p>Seleccione las imágenes del salón (mínimo 4 fotos, cada foto debe pesar menos de 10MB) :</p>
          <input type="file" @change="onFileChange" multiple accept="image/*" />
        </div>
        <!-- Show uploaded images with a delete option -->
        <div class="form-group">
          <q-btn color="primary" @click="abrirModalGaleria">
            Ver Galería de Imágenes
          </q-btn>
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
          <p>Precio mínimo de la reserva del salón:</p>
          <q-input v-model.number="data.precio_sal" label="Precio del salón" type="number" filled
            :rules="[val => val > 0 || 'Debe ser mayor a 0']" />
        </div>

        <!-- 8. Latitud -->
        <div class="form-group">
          <p>Latitud del salón (Google maps)</p>
          <q-input v-model="data.latitud" label="Latitud" filled
            :rules="[val => val > 0 || 'Ingrese la latitud del salón']" />
        </div>

        <!-- 9. Longitud -->
        <div class="form-group">
          <p>Longitud del salón (Google maps):</p>
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
          <q-btn color="primary" @click="abrirModalSeleccion('tipo_evento')">Ver Tipos de Eventos</q-btn>
        </div>

        <!-- 12. Selección de tipos de salón -->
        <div class="form-group">
          <p>Escoger los diferentes tipos de salón:</p>
          <q-btn color="primary" @click="abrirModalSeleccion('tipo_salon')">Ver Tipos de Salón</q-btn>
        </div>

        <!-- 13. Selección de espacios -->
        <div class="form-group">
          <p>Escoger los diferentes espacios del salón:</p>
          <q-btn color="primary" @click="abrirModalSeleccion('espacio')">Ver Espacios</q-btn>
        </div>

        <!-- 14. Selección de servicios -->
        <div class="form-group">
          <p>Escoger los diferentes servicios que ofrece el salón:</p>
          <q-btn color="primary" @click="abrirModalSeleccion('servicio')">Ver Servicios</q-btn>
        </div>

        <!-- 15. Selección de ubicación -->
        <div class="form-group">
          <p>Escoger la ubicación del salón:</p>
          <q-btn color="primary" @click="abrirModalSeleccion('ubicacion')">Ver Ubicaciones</q-btn>
        </div>

        <!-- 16. Asignar contacto del salón -->
        <div class="form-group">
          <p>Asignar contacto del salón:</p>
          <q-btn color="primary" @click="abrirModalContacto()">Ver Contactos</q-btn>
        </div>
      </q-card-section>

      <q-card-section>
        <div style="display: flex; justify-content: center;">
          <!-- Botón de enviar -->
          <q-btn color="green" @click="editMode ? editarSalon() : agregarSalon()">
            {{ editMode ? 'Guardar Cambios' : 'Agregar Salón' }}
          </q-btn>

        </div>
      </q-card-section>
    </q-card>

    <!-- Modales -->
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

    <q-dialog v-model="modalContactoSalon" persistent>
      <q-card style="min-width: 600px;">
        <q-card-section>
          <div class="q-pt-sm">
            <h6>Administrar Contacto del Salón</h6>
            <p>Seleccione el contacto del salón</p>
            <q-list bordered separator>
              <q-item v-for="opcion in contacto" :key="opcion._id" clickable v-ripple>
                <q-item-section>
                  <!-- Cambiar v-model a arraySeleccionado ya que será único -->
                  <q-radio v-model="arrayContacto" :val="opcion._id" :label="opcion.nombre_cont"
                    @update:model-value="val => seleccionarContacto(val, opcion)" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Aceptar" color="primary" v-close-popup />
          <q-btn flat label="Crear Contacto" color="secondary" @click="modalCrearContacto = true;" />
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

    <!-- Modal crear contacto -->
    <q-dialog v-model="modalCrearContacto" persistent>
      <q-card style="min-width: 600px;">
        <q-card-section>
          <div class="q-pt-sm">
            <h6>Agregar nuevo contacto</h6>
            <p>Digite los detalles del nuevo contacto:</p>

            <div class="container">
              <div class="form-group">
                <p>Digite el nombre del contacto del salón</p>
                <q-input v-model="nuevoContacto.nombre_cont" label="Nombre del contacto" filled />
              </div>

              <div class="form-group">
                <p>Digite el correo del contacto del salón</p>
                <q-input v-model="nuevoContacto.correo_cont" label="Correo del contacto" filled type="email" />
              </div>

              <div class="form-group">
                <p>Digite el teléfono del contacto del salón</p>
                <q-input v-model="nuevoContacto.telefono_cont" label="Teléfono del contacto" filled type="tel" />
              </div>
            </div>

          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="`Agregar Contacto" color="primary" :loading="loading" :disable="loading"
            @click="agregarNuevoContacto" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalGaleriaVisible" persistent>
      <q-card style="min-width: 800px; max-height: 80vh; display: flex; flex-direction: column;">

        <!-- Título fijo -->
        <q-card-section class="sticky-title">
          <div class="q-pt-sm">
            <h6 class="text-uppercase text-bold">Galería de Imágenes del Salón</h6>
          </div>
        </q-card-section>

        <!-- Sección de imágenes con scroll -->
        <q-card-section class="scrollable-content" style="overflow-y: auto; flex-grow: 1;">
          <div class="row q-gutter-md">
            <div v-for="(image, index) in data.galeria_sal" :key="index" class="col-3">
              <img :src="image.url" alt="Imagen del salón" style="width: 100%; height: auto; object-fit: cover;" />
              <q-btn color="negative" size="sm" @click="removeImage(image.publicId)">Eliminar</q-btn>
            </div>
          </div>
        </q-card-section>

        <!-- Botón fijo -->
        <q-card-actions class="sticky-footer" align="right">
          <q-btn flat label="Cerrar" class="bg-primary" style="color: white;" v-close-popup />
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

.sticky-title {
  position: sticky;
  display: flex;
  justify-content: center;
  top: 0;
  background-color: white;
  /* Aseguramos que el título tenga un fondo visible */
  z-index: 1;
  padding-top: 10px;
  padding-bottom: 10px;
}

.scrollable-content {
  flex-grow: 1;
  max-height: 60vh;
  /* Ajusta según el espacio disponible */
  overflow-y: auto;
}

.sticky-footer {
  position: sticky;
  bottom: 0;
  background-color: white;
  /* Fondo blanco para asegurar visibilidad */
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>