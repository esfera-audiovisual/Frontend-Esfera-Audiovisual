<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreSalon } from '../stores/salon.js';
import { useStoreReglamentoSalon } from '../stores/reglamento.js';
import { useStoreReserva } from '../stores/reserva.js';
import { useRouter, useRoute } from 'vue-router';

const useSalon = useStoreSalon();
const useReserva = useStoreReserva();
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const useReglamento = useStoreReglamentoSalon();
const detalleSalon = ref('');
const reglamento = ref("");
const dialogoAbierto = ref(false);
const mensaje = ref('Hola, estamos pensando en celebrar nuestro evento en tus instalaciones. ¿Nos podrías enviar más información acerca de este salón para eventos? Gracias.');
const nombre = ref('');
const email = ref('');
const telefono = ref('');
const fecha = ref('');
const invitados = ref('');
const minDate = ref(getCurrentDate());
const salonId = ref('');
const modal360 = ref(false);
const showLoadingModal = ref(false);
const loadingReserva = ref(false);
const imagenSeleccionada = ref(null);


function notificar(tipo, msg, posicion = "top") {
  $q.notify({
    type: tipo,
    message: msg,
    position: posicion,
  });
}

function formatReglamento(texto) {
  // Si el texto es undefined o null, devolvemos una cadena vacía.
  return texto ? texto.replace(/\n/g, '<br>') : '';
}

function formatPrice(price) {
  if (price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  return price;
}

async function cargarSalon(id) {
  try {
    showLoadingModal.value = true;
    const response = await useSalon.getPorId(id);
    /* console.log("datos salonnn", response) */
    if (response) {
      detalleSalon.value = response;
    }
  } catch (error) {
    notificar('negative', 'Error al cargar los datos del salón.');
    console.error('Error al cargar salón:', error);
  } finally {
    showLoadingModal.value = false;
  }
}


async function getReglamentoSalon() {
  try {
    const response = await useReglamento.getPorSalonEvento(detalleSalon.value._id);
    if (response.estado === true) {
      reglamento.value = response;
    }
  } catch (error) {
    console.log(error);
  }
}

function getYouTubeEmbedUrl(url) {
  const videoId = url.split('v=')[1];  // Extrae el ID del video
  return `https://www.youtube.com/embed/${videoId}`;
}

const limpiar = () => {
  nombre.value = '';
  email.value = '';
  telefono.value = '';
  mensaje.value = 'Hola, estamos pensando en celebrar nuestro evento en tus instalaciones. ¿Nos podrías enviar más información acerca de este salón para eventos? Gracias.';
  invitados.value = '';
  fecha.value = '';
  dialogoAbierto.value = false;
}

const cerrarFormulario = () => {
  dialogoAbierto.value = false;
}

const enviarFormulario = async () => {
  loadingReserva.value = true;


  const data = {
    mensaje_res: mensaje.value,
    nombre_cliente: nombre.value,
    correo_cliente: email.value,
    telefono_cliente: telefono.value,
    cant_pers_res: invitados.value,
    fecha_res: fecha.value,
    idSalonEvento: detalleSalon.value._id
  };

  // Notificación de loading
  const loadingNotify = $q.notify({
    message: 'Enviando formulario...',
    spinner: true,
    timeout: 0,
    position: 'top',
  });

  try {
    const response = await useReserva.registro(data);
    /* console.log(response); */

    // Cierra la notificación de loading
    loadingNotify();

    if (useReserva.estatus === 200) {
      notificar('positive', "Reserva enviada con éxito, por favor revise su correo");
      loadingReserva.value = false;
      limpiar();
    } else if (useReserva.estatus === 400) {
      notificar('negative', useReserva.validacion

      );
    }
  } catch (error) {
    console.log(error);
    loadingNotify();
    notificar('negative', 'Error al enviar la reserva. Intenta nuevamente.');
  } finally {
    loadingReserva.value = false;
  }
};

function recorrido360() {
  modal360.value = true;
}

function cerrar360() {
  modal360.value = false;
}

function getCurrentDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

const galleryOpen = ref(false);

function openGallery(image) {
  galleryOpen.value = true;
  imagenSeleccionada.value = image; // Selecciona la primera imagen
  console.log(image.url)
}

function openGalleryPrin() {
  galleryOpen.value = true;
  imagenSeleccionada.value = detalleSalon.value.galeria_sal[0]; // Selecciona la primera imagen
}

function seleccionarImagen(image) {
  imagenSeleccionada.value = image; // Actualiza la imagen seleccionada al hacer clic
}

onMounted(async () => {
  const id = route.query.id; // Obtener el id del salón de la ruta
  if (id) {
    salonId.value = id;  // Guardar el id en la referencia
    await cargarSalon(id);  // Cargar los datos del salón
  }

  getReglamentoSalon();
})
</script>

<template>
  <q-page class="detalle-salon">
    <q-dialog v-model="showLoadingModal" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-spinner color="primary" size="30px" />
          <span class="q-ml-sm">Cargando...</span>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-card class="my-card" style="margin-left: 50px;" flat>
      <q-card-section class="q-pa-md">
        <!-- Encabezado con botón de regreso -->

        <div style="display: flex; width: 100%; flex-direction: column;">
          <div v-if="detalleSalon.galeria_sal" class="gallery-banner-container">
            <div class="gallery">
              <!-- Imagen principal -->
              <q-img v-if="detalleSalon.galeria_sal[0]" :src="detalleSalon.galeria_sal[0].url"
                class="gallery-image-large" :alt="detalleSalon.nombre_sal" :ratio="16 / 9" @click="openGalleryPrin()" />

              <!-- Galería secundaria -->
              <div class="gallery-column">
                <q-img v-for="(image, index) in detalleSalon.galeria_sal.slice(1, 4)" :key="image.publicId"
                  :src="image.url" class="gallery-image-small" :alt="detalleSalon.nombre_sal" :ratio="16 / 9"
                  @click="openGallery(image)">

                  <!-- Verificar si es la última imagen de la galería con slice -->
                  <template v-if="index === detalleSalon.galeria_sal.slice(1, 4).length - 1">
                    <!-- Mostrar mensaje "Ver más..." sobre la última imagen -->
                    <div class="overlay-text">Ver más...</div>
                  </template>
                </q-img>
              </div>
            </div>
          </div>

          <!-- Modal para galería de imágenes -->
          <q-dialog v-model="galleryOpen" full-width full-height>
            <q-card>
              <q-card-section>
                <!-- Botón de cerrar -->
                <q-btn flat round icon="close" @click="galleryOpen = false" class="absolute-top-right" />

                <!-- Imagen principal seleccionada -->
                <div class="gallery-main">
                  <img :src="imagenSeleccionada.url" class="gallery-main-item" :alt="detalleSalon.nombre_sal" />
                </div>

                <!-- Galería de miniaturas -->
                <div class="gallery-thumbnails">
                  <q-img v-for="(image, index) in detalleSalon.galeria_sal" :key="index" :src="image.url"
                    :alt="detalleSalon.nombre_sal" class="gallery-thumbnail-item" @click="seleccionarImagen(image)"
                    :class="{ 'active-thumbnail': imagenSeleccionada.url === image.url }" />
                </div>
              </q-card-section>
            </q-card>
          </q-dialog>




          <!-- Banner de información -->
          <div class="q-mb-md banner-info fixed-banner">
            <q-banner
              style="  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12); padding: 20px;">
              <p class="title text-bold text-h4">{{ detalleSalon.nombre_sal }}</p>
              <q-item-label v-if="detalleSalon && detalleSalon.idCiudSalonEvento" class="direccion text-bold">{{
                detalleSalon.idCiudSalonEvento.nombre_ciud }}, {{
                  detalleSalon.idCiudSalonEvento.idDepart.nombre_depart }}</q-item-label>
              <q-item-label class="precio">Desde $ {{ formatPrice(detalleSalon.precio_sal) }}</q-item-label>
              <q-item-label class="capacidad">Capacidad máxima de {{ detalleSalon.capacidad_max }}
                personas</q-item-label>
              <q-item-label class="direccion">Dirección: {{ detalleSalon.direccion_sal }}</q-item-label>
              <div style="display: flex; justify-content: center;">
                <q-btn class="btn" @click="dialogoAbierto = true">Pedir información...</q-btn>
              </div>
            </q-banner>

            <div class="text-center">
              <iframe v-if="detalleSalon.video_sal" :src="getYouTubeEmbedUrl(detalleSalon.video_sal)" width="90%"
                height="200px" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen class="q-mt-lg">
              </iframe>
            </div>

            <div class="q-pa-md" v-if="detalleSalon.video360 && !detalleSalon.video_sal">
              <p class="text-bold text-h6 text-uppercase">Recorrido Virtual</p>
              <q-btn flat label="Ver recorrido" class=" right-btn bg-primary" @click="recorrido360" />
            </div>
          </div>
        </div>

        <!-- Descripción -->
        <q-card-section class="description">
          <p class="text-bold text-h6 text-uppercase">Descripción</p>
          <p v-html="formatReglamento(detalleSalon.descripcion_sal)"></p>
        </q-card-section>

        <div class="q-pa-md" v-if="detalleSalon.video360 && detalleSalon.video_sal">
          <p class="text-bold text-h6 text-uppercase">Recorrido Virtual</p>
          <q-btn flat label="Ver recorrido" class=" right-btn bg-primary" @click="recorrido360" />
        </div>

        <q-separator />

        <q-expansion-item class="q-mt-md" expand-separator :default-opened="true">
          <template v-slot:header>
            <span class="custom-label">TIPOS DE EVENTOS</span>
          </template>
          <q-list>
            <q-item v-for="ambiente in detalleSalon.idAmbienteSalon" :key="ambiente._id"
              style="display: flex; align-items: center; gap: 5px;">
              <q-icon name="check_circle" color="green" />
              <q-item-section>{{ ambiente.nombre_amb }}</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-separator />

        <!-- Espacios -->
        <q-expansion-item class="q-mt-md" expand-separator :default-opened="true">
          <template v-slot:header>
            <span class="custom-label">ESPACIOS</span>
          </template>
          <q-list>
            <q-item v-for="espacio in detalleSalon.idEspaciosSalon" :key="espacio._id"
              style="display: flex; align-items: center; gap: 5px;">
              <q-icon name="check_circle" color="green" />
              <q-item-section>{{ espacio.nombre_esp }}</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Servicios -->
        <q-expansion-item class="q-mt-md" expand-separator :default-opened="true">
          <template v-slot:header>
            <span class="custom-label">SERVICIOS</span>
          </template>

          <q-list>
            <q-item v-for="servicio in detalleSalon.idServiciosSalon" :key="servicio._id"
              style="display: flex; align-items: center; gap: 5px;">
              <q-icon name="check_circle" color="green" />
              <q-item-section>{{ servicio.nombre_serv }}</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Ubicación -->
        <q-expansion-item class="q-mt-md" expand-separator :default-opened="true">
          <template v-slot:header>
            <span class="custom-label">UBICACION</span>
          </template>
          <q-list>
            <q-item v-for="tipo in detalleSalon.idTipoSalon" :key="tipo._id"
              style="display: flex; align-items: center; gap: 5px;">
              <q-icon name="check_circle" color="green" />
              <q-item-section>{{ tipo.nombre_tip }}</q-item-section>
            </q-item>
            <q-item v-for="ubicacion in detalleSalon.idUbicacionSalon" :key="ubicacion._id"
              style="display: flex; align-items: center; gap: 5px;">
              <q-icon name="check_circle" color="green" />
              <q-item-section>{{ ubicacion.nombre_ubi }}</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-separator />

        <q-card-section class="reglamento" v-if="reglamento">
          <h2 class="text-bold">Reglamento</h2>
          <p v-html="formatReglamento(reglamento.descripcion_regl)"></p>
        </q-card-section>


      </q-card-section>
    </q-card>



    <!-- Diálogo con formulario -->
    <q-dialog v-model="dialogoAbierto" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="text-h6">
          {{ detalleSalon.nombre_sal }}
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1 text-bold">Pide más información</div>
          <p class="text-body2">
            Rellena este formulario y {{ detalleSalon.nombre_sal }} se pondrá en contacto contigo en breve.
            Todos los datos que envíes serán tratados de forma confidencial.
          </p>

          <!-- Formulario -->
          <q-form @submit="enviarFormulario" class="q-gutter-md">
            <q-input filled v-model="mensaje" label="Mensaje" type="textarea" :rows="4" />
            <q-input filled v-model="nombre" label="Nombre y apellidos"
              :rules="[val => !!val || 'El nombre es obligatorio']" />
            <q-input filled v-model="email" label="E-mail" type="email"
              :rules="[val => !!val || 'El correo es obligatorio', val => /.+@.+\..+/.test(val) || 'Correo no válido']" />
            <q-input filled v-model="telefono" label="Teléfono" type="number"
              :rules="[val => !!val || 'El teléfono es obligatorio']" />
            <q-input filled v-model="fecha" label="Fecha del evento" type="date" :min="minDate"
              :rules="[val => !!val || 'La fecha es obligatoria', val => (val >= minDate) || 'La fecha no puede ser anterior a la de hoy.']" />

            <!-- Selección de invitados con q-radio -->
            <div class="text-body1 q-mt-md text-bold m-0">Nº de invitados</div>
            <div>
              <q-radio v-model="invitados" val="1-99" label="1-99"
                :rules="[val => !!val || 'El número de invitados es obligatorio']" />
              <q-radio v-model="invitados" val="100-199" label="100-199" />
              <q-radio v-model="invitados" val="200-299" label="200-299" />
              <q-radio v-model="invitados" val="300-399" label="300-399" />
              <q-radio v-model="invitados" val="400+" label="400+" />
            </div>

            <!-- Botones del diálogo -->
          </q-form>

        </q-card-section>

        <!-- Botones del diálogo -->
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="cerrarFormulario" :disabled="loadingReserva" />
          <q-btn label="Enviar" color="primary" @click="enviarFormulario" :disabled="loadingReserva" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modal360" persistent>
      <q-card style="min-width: 80%">
        <q-card-section class="text-h6 text-center text-bold text-uppercase">
          Recorrido Virtual 360 - {{ detalleSalon.nombre_sal }}
        </q-card-section>

        <q-card-section>

          <div class="text-center">
            <iframe :src="detalleSalon.video360" width="80%" height="570px" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen class="q-mt-lg">
            </iframe>
          </div>

        </q-card-section>

        <!-- Botones del diálogo -->
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" @click="cerrar360()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<style scoped>
.custom-label {
  font-weight: bolder;
  display: flex;
  align-items: center;
  font-size: 1rem;
}

.gallery-main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90vw;          /* Máximo ancho de la imagen principal en relación con la ventana */
  height: 80vh;         /* Máximo alto del contenedor de la imagen principal */
  max-height: 80vh;     /* Limita la altura máxima del contenedor */
  overflow: hidden;     /* Evita que las imágenes más grandes se desborden */
  padding: 20px;
  box-sizing: border-box;  /* Asegura que el padding no afecte el tamaño del contenedor */
}

.gallery-main-item {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Estilo para la galería de miniaturas en el modal */
.gallery-thumbnails {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 10px;
  overflow-x: auto;
}

.gallery-thumbnail-item {
  width: 100px;
  height: auto;
  cursor: pointer;
  border-radius: 4px;
  transition: transform 0.2s ease;
  opacity: 0.7;
}

.gallery-thumbnail-item:hover {
  transform: scale(1.1);
  opacity: 1;
}

/* Indicador de miniatura activa */
.active-thumbnail {
  border: 2px solid #007bff;
  opacity: 1;
}

.detalle-salon {
  height: 100%;
  width: 100%;
}

.my-card {
  max-width: 900px;
  width: 100%;
}


.precio {
  font-size: 1.2rem;
  color: black;
}

.btn {
  margin-top: 20px;
  background-color: black;
  color: white;
}

.tipo,
.capacidad,
.reglamento,
.direccion {
  font-size: 1.2rem;
  color: #000000;
}

.gallery-banner-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.gallery {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.gallery-image-large {
  flex: 3;
  margin-right: 10px;
}

.gallery-column {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
}

.gallery-image-small {
  width: 100%;
}

.overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  font-weight: bold;
  border-radius: 5px;
  text-align: center;
  pointer-events: none;
}

/* Galería con imágenes que respetan su tamaño original */
.gallery-normal {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 15px;
  /* Espacio entre las imágenes */
  padding: 30px;
  overflow-y: auto;
  /* Permitir desplazamiento vertical si hay muchas imágenes */
  max-height: 80vh;
  /* Limitar la altura total del modal */
}

/* Cada imagen dentro de la galería */
.gallery-normal-item {
  width: 100%;
  height: auto;
  object-fit: contain;
  /* No recortar las imágenes, mostrar todo su contenido */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

/* Efecto de hover sobre las imágenes */
.gallery-normal-item:hover {
  transform: scale(1.1);
  /* Efecto de zoom ligero al pasar el cursor */
}

/* Responsividad para pantallas pequeñas */
@media (max-width: 768px) {
  .gallery-normal {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    /* Ajustar el tamaño mínimo de las columnas */
  }
}


.gallery-image-large {
  width: 70%;
}

.gallery-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Banner fijo */
.fixed-banner {
  position: fixed;
  left: 65%;
  width: 450px;
  z-index: 1000;
}

/* Ajustes responsivos usando media queries */
@media (max-width: 1450px) {
  .fixed-banner {
    position: relative;
    /* Para que el banner no sea fijo en pantallas pequeñas */
    width: 100%;
    /* Toma todo el ancho disponible */
    left: 0;
    margin-top: 20px;
    transform: none;
    /* Elimina el translateX */
  }
}

@media (max-width: 900px) {
  .fixed-banner {
    position: relative;
    /* Para que el banner no sea fijo en pantallas pequeñas */
    width: 100%;
    /* Toma todo el ancho disponible */
    left: 0;
    margin-top: 20px;
    transform: none;
    /* Elimina el translateX */
  }

  .my-card {
    margin-left: 0;
    /* Eliminar el margen para pantallas pequeñas */
  }
}

.q-expansion-item {
  border-radius: 8px;
}

.description,
.reglamento {
  margin-top: 20px;
}

.description h2,
.reglamento h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.reglamento p {
  white-space: pre-line;
}

.right-btn {
  color: white;
}
</style>