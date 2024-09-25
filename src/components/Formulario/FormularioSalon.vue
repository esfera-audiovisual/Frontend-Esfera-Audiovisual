<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreSalon } from '../../stores/salon.js';

const $q = useQuasar();
const useSalonEvento = useStoreSalon();

const modalServicios = ref(false);
const modalTiposEventos = ref(false);
const modalTiposSalon = ref(false);
const modalEspacios = ref(false);
const modalUbicaciones = ref(false);

const serviciosDisponibles = ref([]);
const serviciosSeleccionados = ref([]);

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
    idContactoSalon: '',
});

</script>

<template>
    <div class="formulario-salon">
      <q-card class="q-pa-md">
        <q-card-section>
  
          <!-- 1. Nombre del salón -->
          <p>Digite el nombre del salón:</p>
          <q-input 
            v-model="data.nombre_sal" 
            label="Nombre del salón" 
            filled 
            :rules="[val => !!val || 'Campo obligatorio']" 
          />
  
          <!-- 2. Seleccionar imágenes del salón -->
          <p>Seleccione las imágenes del salón:</p>
          <q-input 
            v-model="data.galeria_sal[0].url" 
            label="" 
            filled 
            type="file" 
            accept="image/*" 
          />
  
          <!-- 3. Descripción del salón -->
          <p>Escriba la descripción del salón:</p>
          <q-input 
            v-model="data.descripcion_sal" 
            label="Descripción del salón" 
            type="textarea" 
            filled 
            :rules="[val => !!val || 'Campo obligatorio']" 
          />
  
          <!-- 4. Capacidad mínima del salón -->
          <p>Especifique la capacidad mínima:</p>
          <q-input 
            v-model.number="data.capacidad_min" 
            label="Capacidad mínima" 
            type="number" 
            filled 
            :rules="[val => val > 0 || 'Debe ser mayor a 0']" 
          />
  
          <!-- 5. Capacidad máxima del salón -->
          <p>Especifique la capacidad máxima:</p>
          <q-input 
            v-model.number="data.capacidad_max" 
            label="Capacidad máxima" 
            type="number" 
            filled 
            :rules="[val => val > 0 || 'Debe ser mayor a 0']" 
          />
  
          <!-- 6. Dirección exacta del salón -->
          <p>Dirección exacta del salón de eventos:</p>
          <q-input 
            v-model="data.direccion_sal" 
            label="Dirección del salón" 
            filled 
          />
  
          <!-- 7. Precio máximo del salón -->
          <p>Precio máximo del salón:</p>
          <q-input 
            v-model.number="data.precio_sal" 
            label="Precio del salón" 
            type="number" 
            filled 
            :rules="[val => val > 0 || 'Debe ser mayor a 0']" 
          />
  
          <!-- 8. Latitud -->
          <p>Latitud:</p>
          <q-input 
            v-model="data.latitud" 
            label="Latitud" 
            filled 
          />
  
          <!-- 9. Longitud -->
          <p>Longitud:</p>
          <q-input 
            v-model="data.longitud" 
            label="Longitud" 
            filled 
          />
  
          <!-- 10. Enlace de video 360 -->
          <p>Enlace del video de realidad virtual o video 360 (opcional):</p>
          <q-input 
            v-model="data.video360" 
            label="URL de video 360 (opcional)" 
            filled 
          />
  
          <!-- 11. Selección de tipos de eventos -->
          <p>Escoger los diferentes tipos de eventos que se pueden realizar en este salón:</p>
          <q-btn color="primary" @click="modalTiposEventos = true">Ver Tipos de Eventos</q-btn>
  
          <!-- 12. Selección de tipos de salón -->
          <p>Escoger los diferentes tipos de salón:</p>
          <q-btn color="primary" @click="modalTiposSalon = true">Ver Tipos de Salón</q-btn>
  
          <!-- 13. Selección de espacios -->
          <p>Escoger los diferentes espacios del salón:</p>
          <q-btn color="primary" @click="modalEspacios = true">Ver Espacios</q-btn>
  
          <!-- 14. Selección de servicios -->
          <p>Escoger los diferentes servicios que ofrece el salón:</p>
          <q-btn color="primary" @click="modalServicios = true">Ver Servicios</q-btn>
  
          <!-- 15. Selección de ubicación -->
          <p>Escoger la ubicación del salón:</p>
          <q-btn color="primary" @click="modalUbicaciones = true">Ver Ubicaciones</q-btn>
  
          <!-- 16. Asignar contacto del salón -->
          <p>Asignar contacto del salón:</p>
          <q-btn color="primary" @click="modalUbicaciones = true">Asignar contacto</q-btn>
  
        </q-card-section>
      </q-card>
  
      <!-- Dialog for viewing/adding services -->
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
  