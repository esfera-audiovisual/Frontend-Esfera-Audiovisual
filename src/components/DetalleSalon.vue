<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreSalon } from '../stores/salon.js';
import { useStoreReglamentoSalon } from '../stores/reglamento.js';
import { useStoreReserva } from '../stores/reserva.js';
import { useRouter } from 'vue-router';

const useSalon = useStoreSalon();
const useReserva = useStoreReserva();
const $q = useQuasar();
const router = useRouter();
const useReglamento = useStoreReglamentoSalon();
const detalleSalon = ref(useSalon.detalleSalon);
const reglamento = ref("");
const dialogoAbierto = ref(false);
const mensaje = ref('Hola, estamos pensando en celebrar nuestro evento en tus instalaciones. ¿Nos podrías enviar más información acerca de este salón para eventos? Gracias.');
const nombre = ref('');
const email = ref('');
const telefono = ref('');
const fecha = ref('');
const invitados = ref('');

function notificar(tipo, msg, posicion = "top") {
  $q.notify({
    type: tipo,
    message: msg,
    position: posicion,
  });
}


async function getReglamentoSalon() {
  try {
    const response = await useReglamento.getPorSalonEvento(detalleSalon.value._id);
    reglamento.value = response;
    console.log(reglamento)
  } catch (error) {
    console.log(error);
  }
}

/* const goBack = () => {
  if (useSalon.devolverHomeDetalle === true) {
    router.push('/home');
    useSalon.devolverHomeDetalle = false;
  } else {
    router.push('/busqueda');
  }
}; */

/* const enviarFormulario = () => {
  console.log('Formulario enviado:', {
    mensaje_res: mensaje.value,
    nombre_cliente: nombre.value,
    correo_cliente: email.value,
    telefono_cliente: telefono.value,
    cant_pers_res: invitados.value,
    fecha_res: fecha.value,
    idSalonEvento: detalleSalon.value._id
  })

  dialogoAbierto.value = false
} */

const limpiar = () => {
  nombre.value = '';
  email.value = '';
  telefono.value = '';
  mensaje.value = 'Hola, estamos pensando en celebrar nuestro evento en tus instalaciones. ¿Nos podrías enviar más información acerca de este salón para eventos? Gracias.';
  invitados.value = '';
  fecha.value = '';
}

const cerrarFormulario = () => {
  dialogoAbierto.value = false;
}

const enviarFormulario = async () => {
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
    console.log(response);

    // Cierra la notificación de loading
    loadingNotify();

    if (useReserva.estatus === 200) {
      notificar('positive', "Reserva enviada con éxito");
      limpiar();
    } else if (useReserva.estatus === 400) {
      notificar('negative', useReserva.validacion);
    }
  } catch (error) {
    console.log(error);
    loadingNotify();
    notificar('negative', 'Error al enviar la reserva. Intenta nuevamente.');
  }
};


onMounted(() => {
  getReglamentoSalon();
})
</script>

<template>
  <q-page class="detalle-salon">
    <q-card class="my-card" style="margin-left: 50px;" flat>
      <q-card-section class="q-pa-md">
        <!-- Encabezado con botón de regreso -->

        <div style="display: flex; width: 100%; flex-direction: column;">
          <div v-if="detalleSalon.galeria_sal.length" class="gallery-banner-container">
            <!-- Galería de imágenes -->
            <div class="gallery">
              <q-img v-if="detalleSalon.galeria_sal[0]" :src="detalleSalon.galeria_sal[0].url"
                class="gallery-image-large" :alt="detalleSalon.nombre_sal" :ratio="16 / 9" />
              <div class="gallery-column">
                <q-img v-for="(image, index) in detalleSalon.galeria_sal.slice(1, 4)" :key="image.publicId"
                  :src="image.url" class="gallery-image-small" :alt="detalleSalon.nombre_sal" :ratio="16 / 9" />
              </div>
            </div>
          </div>
          <!-- Banner de información -->
          <div class="q-mb-md banner-info fixed-banner">
            <q-banner
              style="  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12); padding: 25px;">
              <h2 class="title text-bold">{{ detalleSalon.nombre_sal }}</h2>
              <q-item-label class="precio">Precio: {{ detalleSalon.precio_sal }}</q-item-label>
              <q-item-label class="capacidad">Capacidad: {{ detalleSalon.capacidad_max }} personas</q-item-label>
              <q-item-label class="direccion">Dirección: {{ detalleSalon.direccion_sal }}</q-item-label>
              <div style="display: flex; justify-content: center;">
                <q-btn class="btn" @click="dialogoAbierto = true">Pedir información...</q-btn>
              </div>
            </q-banner>

            <div class="q-pa-md" v-if="detalleSalon.video360"> 
              <p class="text-h5 text-bold mt-4">Recorrido Virtual</p>
              <a>{{ detalleSalon.video360 }}</a>
            </div>
          </div>

        </div>


        <!-- Descripción -->
        <q-card-section class="description">
          <h2 class="text-bold">Descripción</h2>
          <p>{{ detalleSalon.descripcion_sal }}</p>
        </q-card-section>

        <q-separator />

        <!-- Espacios -->
        <q-expansion-item class="q-mt-md" label="ESPACIOS" expand-separator :default-opened="true">
          <q-list>
            <q-item v-for="espacio in detalleSalon.idEspaciosSalon" :key="espacio._id"
              style="display: flex; align-items: center; gap: 5px;">
              <q-icon name="check_circle" color="green" />
              <q-item-section>{{ espacio.nombre_esp }}</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Servicios -->
        <q-expansion-item class="q-mt-md" label="SERVICIOS" expand-separator :default-opened="true">
          <q-list>
            <q-item v-for="servicio in detalleSalon.idServiciosSalon" :key="servicio._id"
              style="display: flex; align-items: center; gap: 5px;">
              <q-icon name="check_circle" color="green" />
              <q-item-section>{{ servicio.nombre_serv }}</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Ubicación -->
        <q-expansion-item class="q-mt-md" label="UBICACION" expand-separator :default-opened="true">
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

        <q-card-section class="reglamento">
          <h2 class="text-bold">Reglamento</h2>
          <p>{{ reglamento.descripcion_regl }}</p>
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
            <q-input filled v-model="fecha" label="Fecha del evento" type="date"
              :rules="[val => !!val || 'La fecha es obligatoria']" />

            <!-- Selección de invitados con q-radio -->
            <div class="text-body1 q-mt-md text-bold m-0">Nº de invitados</div>
            <div>
              <q-radio v-model="invitados" val="0-99" label="0-99"
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
          <q-btn flat label="Cancelar" color="primary" @click="cerrarFormulario" />
          <q-btn label="Enviar" color="primary" @click="enviarFormulario" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>
.detalle-salon {
  height: 100%;
  width: 100%;
}

.my-card {
  max-width: 900px;
  width: 100%;
}

.title {
  font-size: 2rem;
  margin: 0;
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
  font-size: 1rem;
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
  gap: 10px;
}

.gallery-image-small {
  width: 100%;
}

/* Banner fijo */
.fixed-banner {
  position: fixed;
  left: 65%;
  width: 450px;

  /* Ajusta el ancho según sea necesario */

  z-index: 1000;
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
</style>
