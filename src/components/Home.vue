<script setup>
import { ref, onMounted } from 'vue';
import { useStoreSalon } from '../stores/salon.js';
import { useRouter } from 'vue-router';


const useSalon = useStoreSalon();
const router = useRouter();
const salones = ref([]);
const autoplay = true;
const salonesNuevos = ref([]);
const loading = ref(false);
const imageIndices = ref({});
const salonesDestacados = ref([]);
const slide = ref(1)

function getNombresAmbiente(idAmbienteSalon) {
    if (idAmbienteSalon && idAmbienteSalon.length > 0) {
        return idAmbienteSalon.map(ambiente => ambiente.nombre_amb).join(', ');
    } else {
        return 'No hay ambiente asignado';
    }
}

async function getSalones() {
    loading.value = true;
    try {
        const response = await useSalon.getAll();
        if (useSalon.estatus === 200) {
            salones.value = [...response];
            salonesNuevos.value = response.filter(salon => salon.estado === true).sort(() => Math.random() - 0.5);

            salones.value.forEach(salon => {
                imageIndices.value[salon._id] = 0; // Initialize the image index for each salon
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

async function getSalonesDestacados() {
    loading.value = true;
    try {
        const response = await useSalon.getSalonDestacado(); // Traer los salones destacados desde la tienda Pinia
        if (useSalon.estatus === 200) {
            salonesDestacados.value = [...response].filter(salon => salon.estado === true); // Guardar los salones destacados
        }
        /* console.log("salon destacado", response) */
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

function irDetalleSalon(salon) {
    useSalon.detalleSalon = salon;
    /* console.log(useSalon.detalleSalon) */
    useSalon.salonFiltroCiudadNombre = "";
    useSalon.salonFiltroCiudad = "";
    useSalon.salonFiltroAmbienteNombre = "";
    useSalon.salonFiltroAmbiente = "";
    useSalon.salonFiltroPersona = "";
    useSalon.salonFiltroFecha = "";
    useSalon.salonFiltroPrecio = "";
    useSalon.salonFiltroEspacio = [];
    useSalon.salonFiltroServicio = [];
    useSalon.salonFiltroTipo = [];
    useSalon.salonFiltroUbicacion = [];
    useSalon.idSalonSelec = salon._id;
    const url = router.resolve({ path: '/detalle-salon', query: { id: salon._id } }).href;
    window.open(url, '_blank');
}

function nextImage(salonId) {
    const salon = salones.value.find(salon => salon._id === salonId);
    if (salon) {
        imageIndices.value[salonId] = (imageIndices.value[salonId] + 1) % salon.galeria_sal.length;
    }
}

function prevImage(salonId) {
    const salon = salones.value.find(salon => salon._id === salonId);
    if (salon) {
        imageIndices.value[salonId] = (imageIndices.value[salonId] - 1 + salon.galeria_sal.length) % salon.galeria_sal.length;
    }
}

function formatPrice(price) {
    if (price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return price;
}

onMounted(() => {
    useSalon.salonFiltroCiudadNombre = "";
    useSalon.salonFiltroCiudad = "";
    useSalon.salonFiltroAmbienteNombre = "";
    useSalon.salonFiltroAmbiente = "";
    useSalon.salonFiltroPersona = "";
    useSalon.salonFiltroFecha = "";
    useSalon.salonFiltroPrecio = "";
    useSalon.salonFiltroEspacio = [];
    useSalon.salonFiltroServicio = [];
    useSalon.salonFiltroTipo = [];
    useSalon.salonFiltroUbicacion = [];
    getSalones();
    getSalonesDestacados();
});
</script>

<template>
    <div class="home-container">
        <!-- Sección de Salones Destacados -->
        <section class="featured-salons">
            <div class="bg-primary-deg">
                <h2 id="h2">Salones Destacados</h2>
            </div>

            <div v-if="loading" class="loading-container">
                <q-spinner color="dark" size="2em" />
                <p>Cargando salones...</p>
            </div>
            <div v-else-if="salonesDestacados.length > 0">
                <!-- Componente QCarousel de Quasar mostrando solo salones destacados -->
                <q-carousel animated v-model="slide" :autoplay="autoplay" navigation infinite arrows height="500px"
                    color="black" transition-prev="slide-right" transition-next="slide-left" class="carousel-destacados"
                    @mouseenter="autoplay = false" @mouseleave="autoplay = true">
                    <!-- Iterar sobre los salonesDestacados -->
                    <q-carousel-slide v-for="salon in salonesDestacados" :key="salon._id" :name="salon.posicion_banner"
                        :img-src="salon.galeria_sal.length > 0 ? salon.galeria_sal[1].url : ''" class="carousel-slide"
                        @click="irDetalleSalon(salon)" style="background-size: cover;background-position: center;" />
                </q-carousel>
            </div>
            <div v-else>
                <p>No hay salones destacados disponibles en este momento.</p>
            </div>
        </section>

        <section class="gallery-section">
            <div class="bg-primary-deg">
                <h2 id="h2">Salones Recientes</h2>
            </div>
            <div v-if="loading" class="loading-container">
                <q-spinner color="dark" size="2em" />
                <p>Cargando salones...</p>
            </div>
            <div v-else class="featured-salons-container">
                <div v-for="salon in salonesNuevos" :key="salon._id" class="featured-salon-card">
                    <q-card class="featured-card">
                        <div class="image-carousel">
                            <q-btn round icon="chevron_left" flat @click="prevImage(salon._id)"
                                class="carousel-arrow" />
                            <q-img :src="salon.galeria_sal[imageIndices[salon._id]].url" class="featured-image" />
                            <q-btn round icon="chevron_right" flat @click="nextImage(salon._id)"
                                class="carousel-arrow" />
                        </div>
                        <q-card-section class="featured-details" @click="irDetalleSalon(salon)">
                            <VMenu class="vmenu">
                                <div class="text-h6 salon-name">{{ salon.nombre_sal }}</div>
                                <template #popper>
                                    <div class="descripVmenu">{{ salon.nombre_sal }}</div>
                                </template>
                            </VMenu>
                            <div class="text-subtitle2">{{ salon.idCiudSalonEvento.nombre_ciud }}, {{
                                salon.idCiudSalonEvento.idDepart.nombre_depart }}</div>
                            <div style="display: flex; gap: 20px;">
                                <div class="text-subtitle2">
                                    <q-icon name="groups" size="18px" />
                                    {{ salon.capacidad_min }} a {{ salon.capacidad_max }}
                                </div>
                                <div class="text-subtitle2">
                                    Desde {{ formatPrice(salon.precio_sal) }} $
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </section>

        <!-- Sección de Testimonios -->
        <section class="testimonials-section">
            <div class="bg-primary-deg">
                <h2 id="h2">Testimonios de clientes</h2>
            </div>
            <div class="testimonials-container">
                <q-card class="testimonial-card">
                    <q-card-section>
                        <q-icon name="format_quote" size="24px" />
                        <p>¡Excelente servicio! El salón fue perfecto para nuestra boda. Todo fue tal como lo
                            prometieron.
                        </p>
                        <p class="client-name">- Carlos M.</p>
                    </q-card-section>
                </q-card>
                <q-card class="testimonial-card">
                    <q-card-section>
                        <q-icon name="format_quote" size="24px" />
                        <p>La experiencia fue maravillosa. Definitivamente alquilaré con ellos nuevamente.</p>
                        <p class="client-name">- Andrea G.</p>
                    </q-card-section>
                </q-card>
            </div>
        </section>
    </div>
</template>

<style scoped>
.bg-primary-deg {
    background-color: #000000;
    width: 100%;
    padding: 15px;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.carousel-slide {
    /* Usamos object-fit: cover para asegurar que la imagen ocupe todo el espacio disponible */
    object-position: center;
    width: 100%;
    height: 100%;
}

.carousel-caption {
    position: absolute;
    bottom: 10px;
    left: 20px;
    right: 20px;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 10px;
}

@font-face {
  font-family: 'LEMONMILK-Medium';
  src: url('../assets/fuentes/LEMONMILK-Medium.otf') format('opentype');
  font-weight: bold;
  font-style: normal;
}

#h2 {
  font-family: 'LEMONMILK-Medium', sans-serif;
  color: white;  /* Puedes ajustar el color a tu preferencia */
  font-weight: normal;  /* Ajusta el peso si es necesario */
  font-size: 3rem;
  margin: 10px;
}

.image-carousel {
    display: flex;
    align-items: center;
    position: relative;
}

.carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    color: #333;
    /* Dark color for the icon */
    border-radius: 50%;
    /* Rounded corners */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    /* Subtle shadow */
    padding: 10px;
    /* Ensure the arrow has enough padding */
    font-size: 18px;
    /* Adjust the icon size */
}

.carousel-arrow:hover {
    background-color: rgba(255, 255, 255, 0.9);
    /* Slightly less transparent on hover */
    color: #000;
    /* Darker icon color on hover */
    cursor: pointer;
    /* Change cursor on hover */
}



.carousel-arrow:first-of-type {
    left: 10px;
    /* Adjust positioning */
}

.carousel-arrow:last-of-type {
    right: 10px;
    /* Adjust positioning */
}


.featured-image {
    height: 150px;
    object-fit: cover;
    width: 100%;
}



/* Estilo para la sección de salones destacados */
.featured-salons {
    width: 100%;
    margin-bottom: 40px;
}

.featured-salons-container {
    display: flex;
    gap: 20px;
    overflow-x: scroll;
    padding-bottom: 15px;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    width: 100%;
}

.featured-salon-card {
    flex-shrink: 0;
    scroll-snap-align: start;
    width: 280px;
}

.salon-name {
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}



/* Personalizar el scrollbar en Firefox */
.featured-salons-container {
    padding: 20px;
    scrollbar-width: thin;
    /* Anchura del scrollbar */
    scrollbar-color: #4d4d4d #f1f1f1;
    /* Colores del thumb y la pista */
}

.featured-card {
    width: 100%;
}

.featured-image {
    height: 150px;
    object-fit: cover;
}

.featured-details {
    padding: 10px;
}

.vmenu {
    max-height: 50px;
}

.descripVmenu {
    padding: 1rem;
    word-wrap: break-word;
    height: fit-content;
    max-height: 300px;
    max-width: 300px;
}

/* Estilo para la galería */
.gallery-section {
    margin-bottom: 40px;
}

.gallery-container {
    display: flex;
    gap: 20px;
    overflow-x: scroll;
}

.gallery-image {
    width: 200px;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
}

/* Estilo para la sección de testimonios */
.testimonials-section {
    margin-bottom: 40px;
}

.testimonials-container {
    display: flex;
    gap: 20px;
    padding: 40px;
}

.testimonial-card {
    flex: 1;
    padding: 20px;
    background-color: #f7f7f7;
}

.client-name {
    margin-top: 10px;
    font-weight: bold;
    font-style: italic;
    color: #555;
}

/* Estilo para la sección de salones */
.salones {
    display: flex;
    flex-direction: column;
    margin-top: 80px;
    gap: 20px;
    width: 90%;
    margin-left: 80px;
}



.salon-card {
    width: 100%;
    max-width: 800px;
    display: flex;
    justify-content: start;
}

.my-card {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.card-content {
    display: flex;
    flex-direction: row;
    padding: 0;
}

.card-image {
    flex: 4.5;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
}

.card-details {
    flex: 5.5;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 20px;
}
</style>