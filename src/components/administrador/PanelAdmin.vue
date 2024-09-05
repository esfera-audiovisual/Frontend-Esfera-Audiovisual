<script setup>
import { ref } from 'vue';
import { useStoreUsuarios } from '../../stores/usuario.js';
import Perfil from '../../assets/perfil.png'

const leftDrawerOpen = ref(false);
const useUsuario = useStoreUsuarios();

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<template>
    <q-layout view="hHh lpR lFf">
        <q-header bordered class="bg-primary text-white" style="position: fixed; top: 17%;">
            <q-toolbar>
                <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
                <q-toolbar-title class="text-center">
                    ADMINISTRAR SALONES
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" side="left" elevated >
            <div class="container-info">
                <div class="cont" style="display: flex; justify-content: center;">
                    <q-img :src="Perfil" style="max-width: 200px;"></q-img>
                </div>
                <p class="user text-h5">{{ useUsuario.usuario.nombre }}</p>
                <p class="user text-h5">Administrativo</p>
            </div>
            <div class="container-button">
                <button class="btn">Departamentos</button>
                <button class="btn">Ciudades</button>
                <button class="btn">Salones</button>
                <button class="btn">Tipo de evento</button>
                <button class="btn">Espacios Salón</button>
                <button class="btn">Servicios Salón</button>
                <button class="btn">Tipo de Salón</button>
                <button class="btn">Ubicación de Salón</button>
                <button class="btn">Reglamento de Salón</button>
            </div>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>



<style scoped>


.container-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Centra los botones horizontalmente */
    gap: 20px;
}

.btn {
    width: 200px;
    /* Tamaño fijo para el ancho del botón */
    height: 50px;
    /* Tamaño fijo para la altura del botón */
    display: flex;
    align-items: center;
    /* Centra el texto verticalmente */
    justify-content: center;
    /* Centra el texto horizontalmente */
    text-align: center;
    /* Asegura que el texto esté centrado */
    border: none;
    /* Sin borde */
    border-radius: 4px;
    /* Esquinas redondeadas */
    font-size: 16px;
    /* Tamaño del texto */
    cursor: pointer;
    /* Cursor tipo mano */
    transition: background-color 0.3s;
    /* Efecto de transición para el hover */
}

.btn:hover {
    background-color: black;
    /* Color de fondo al pasar el ratón */
    color: white;
    /* Color del texto al pasar el ratón */
}

.user {
    justify-content: center;
    align-items: center;
    display: flex;
}

.cont {
    align-items: center;
    justify-content: center;
    display: flex;
}

.btns-m {
    margin: 25px;
    margin-top: 40px;
}

.text {
    color: #fff;
    text-decoration: none;
}

.router {
    width: 100%;
    height: 100%;
    text-decoration: none;
}

</style>

