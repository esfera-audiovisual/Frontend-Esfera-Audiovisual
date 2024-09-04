<script setup>
import { ref } from 'vue';
import Login from '../assets/login.jpg';
import {useStoreSalon} from '../stores/salon.js';
import {useRouter} from 'vue-router'

const email = ref("");
const password = ref("");
const useSalon = useStoreSalon();
const router = useRouter();
const isCleaning = ref(false);


function limpiar() {
  // Desactivar temporalmente los watchers
  isCleaning.value = true;
  useSalon.salonFiltroCiudadNombre = "";
  useSalon.salonFiltroCiudad = "";
  useSalon.salonFiltroAmbienteNombre = "";
  useSalon.salonFiltroAmbiente = "";
  useSalon.salonFiltroPersona = "";
  useSalon.salonFiltroPrecio = "";
  useSalon.salonFiltroEspacio = [];
  useSalon.salonFiltroServicio = [];
  useSalon.salonFiltroTipo = [];
  useSalon.salonFiltroUbicacion = [];
  useSalon.salonFiltroFecha = "";

  // Reactivar los watchers después de limpiar
  setTimeout(() => {
    isCleaning.value = false;
    router.push('/home'); // Redirigir explícitamente a /home después de limpiar
  }, 0);
}

</script>

<template>
    <div class="login-container">
        <div class="login-image">
            <q-img :src="Login"></q-img>
        </div>
        <div class="login-form">
                <h2 class="site-title text-uppercase text-bold" @click="limpiar">Esfera Audiovisual</h2>
            <q-form class="form">
                <p class="form-title">Inicia sesión con tu cuenta</p>
                <div class="input-container">
                    <q-input v-model="email" type="email" label="Correo" lazy-rules
                        :rules="[val => !!val || 'Ingrese su correo']" />
                </div>
                <div class="input-container">
                    <q-input v-model="password" type="password" label="Contraseña" lazy-rules
                        :rules="[val => !!val || 'Ingrese la contraseña']" />
                </div>
                <div class="q-pt-md">
                    <q-btn type="submit" color="primary" class="submit">Ingresar</q-btn>
                </div>
            </q-form>
            <p class="signup-link">
                ¿No tienes cuenta? <a href="#">Regístrate</a>
            </p>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.login-image {
    background-size: cover;
    background-position: center;
    width: 50%;
    height: 100%;
}

.login-form {
    width: 50%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.site-title {
    margin-bottom: 1rem;
    font-size: 2rem;
    color: #333;
}

.form {
    width: 100%;
    background-color: #fff;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.55);
}

.form-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #333;
}

.input-container {
    margin-bottom: 1rem;
}

.submit {
    background-color: #E53E3E;
    font-size: 1rem;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: 0.5rem;
    width: 100%;
}

.signup-link {
    margin-top: 1rem;
    color: #6B7280;
    font-size: 0.875rem;
    text-align: center;
}

.signup-link a {
    color: rgb(112, 27, 240);
    text-decoration: none;
}
</style>
