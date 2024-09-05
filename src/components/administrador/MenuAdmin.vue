<script setup>
import { ref } from 'vue';
import Departamento from '../../assets/departamento.png';
import Ciudad from '../../assets/ciudades.jpg';
import SalonEvento from '../../assets/salon-evento.png';
import TipoEvento from '../../assets/tipo-evento.png';
import EspacioSalon from '../../assets/espacio-salon.png';
import ServicioSalon from '../../assets/servicio-salon.png';
import TipoSalon from '../../assets/tipo-salon.png';
import UbicacionSalon from '../../assets/ubicacion-salon.png';
import ReglamentoSalon from '../../assets/reglamento-salon.png'


const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<template>
    <q-layout view="hhh LpR fFf">

        <q-page-container>
            <div class="lcare">
                <div class="card-info"><router-link class="router" to="/departamento"><img :src="Departamento"
                            alt=""></router-link>Departamentos</div>
                <div class="card-info"><router-link class="router" to="/ciudad"><img :src="Ciudad" alt=""></router-link>Ciudades
                </div>
                <div class="card-info"><router-link class="router" to="/salon-evento"><img :src="SalonEvento" alt=""></router-link> Salones de
                    eventos
                </div>
                <div class="card-info"><router-link class="router" to="/tipo-evento"><img :src="TipoEvento" alt=""></router-link>Tipo
                    Evento
                </div>
                <div class="card-info"><router-link class="router" to="/espacio-salon"><img :src="EspacioSalon" alt=""></router-link>Espacios
                    Salón</div>
                <div class="card-info"><router-link class="router" to="/servicio-salon"><img :src="ServicioSalon" alt=""></router-link>Servicios
                    Salón
                </div>
                <div class="card-info"><router-link class="router" to="/tipo-salon"><img :src="TipoSalon" alt=""></router-link>Tipo Salón
                </div>
                <div class="card-info"><router-link class="router" to="/ubicacion-salon"><img :src="UbicacionSalon" alt=""></router-link>Ubicación
                    Salón
                </div>
                <div class="card-info"><router-link class="router" to="/reglamento-salon"><img :src="ReglamentoSalon" alt=""></router-link>Reglamento
                    Salón
                </div>
            </div>
            <router-view />
        </q-page-container>
    </q-layout>
</template>
  
<style>
img {
    width: 200px;
    height: 200px;
}

.cont {
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}

button {
    width: 100%;
    height: 50px;
}

.router {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.lcare {
    display: flex;
    gap: 30px;
    margin: 100px;
    flex-wrap: wrap;
    justify-content: center;
}

.card-info {
    box-sizing: border-box;
    width: 250px;
    height: 254px;
    background: rgba(217, 217, 217, 0.58);
    border: 1px solid #ccc;
    backdrop-filter: blur(6px);
    border-radius: 17px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-weight: bolder;
    color: black;
    padding: 10px;
    /* Espaciado interno de las tarjetas (opcional) */
    text-align: center;
    /* Alineación de texto al centro (opcional) */
}

.card-info:hover {
    border: 1px solid black;
    transform: scale(1.05);
}

.card-info:active {
    transform: scale(0.95) rotateZ(1.7deg);
}
</style>
  
