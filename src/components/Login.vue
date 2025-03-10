<script setup>
import { ref } from 'vue';
import Login from '../assets/imagen-administrador.png';
import { useStoreSalon } from '../stores/salon.js';
import { useStoreUsuarios } from '../stores/usuario.js'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import logoEsfera from '../assets/logo-con-nombre.png';

const cedula = ref("");
const password = ref("");
const showPassword = ref(false); // New ref for toggling password visibility
const useSalon = useStoreSalon();
const useUsuario = useStoreUsuarios();
const router = useRouter();
const isCleaning = ref(false);
const loading = ref(false);
const msgValidacion = ref("");
const $q = useQuasar();

function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
}

const login = async () => {
    loading.value = true;
    const data = {
        cedula: cedula.value,
        password: password.value,
    };

    try {
        const response = await useUsuario.login(data);

        if (useUsuario.estatus === 200) {
            /* console.log(response); */
            router.push('/panel-admin')
        } else if (useUsuario.estatus === 400 || useUsuario.estatus === 401) {
            notificar('negative', 'Usuario o contraseña incorrectos');
            return;
        }
    } catch (error) {
        console.log(error);
        notificar('negative', 'Usuario o contraseña incorrectos');
    } finally {
        loading.value = false;
    }
};

function limpiar() {
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

    setTimeout(() => {
        isCleaning.value = false;
        router.push('/home');
    }, 0);
}
</script>

<template>
    <div class="login-container">
        <div class="login-image">
            <q-img :src="Login" class="login-img"></q-img>
        </div>
        <div class="login-form">
            <div class="logo-container">
                <q-img :src="logoEsfera" class="logo-login" width="400px" @click="limpiar"></q-img>
            </div>
            <q-form class="form" @submit.prevent="login">
                <p class="form-title">Inicia sesión con tu cuenta</p>
                <div class="input-container">
                    <q-input v-model="cedula" type="number" label="Usuario" lazy-rules
                        :rules="[val => !!val || 'Ingrese su cédula']" />
                </div>
                <div class="input-container">
                    <q-input v-model="password" :type="showPassword ? 'text' : 'password'" label="Contraseña" lazy-rules
                        :rules="[val => !!val || 'Ingrese la contraseña']">
                        <template v-slot:append>
                            <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                @click="showPassword = !showPassword" />
                        </template>
                    </q-input>
                </div>
                <div class="q-pt-md">
                    <q-btn type="submit" color="primary" class="submit" :loading="loading"
                        :disable="loading">Ingresar</q-btn>
                </div>
            </q-form>
            <p class="signup-link">
                ¿Olvidaste tu contraseña? <router-link to="/recuperar-contrasena">
                    <a href="#">Haz clic aquí</a>
                </router-link>
            </p>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
}

.login-image {
    width: 50%;
    height: 100vh;
}

.login-img {
    max-width: 100%;
    height: 100vh;
    object-fit: cover;
}

.logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 20px;
    cursor: pointer;
}

.login-form {
    width: 50%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.logo-login {
    margin-bottom: 20px;
}

.site-title {
    margin-bottom: 1rem;
    font-size: 1.9rem;
    color: #333;
    cursor: pointer;
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

/* Media query para pantallas menores a 800px */
@media (max-width: 800px) {
    .login-image {
        display: none;
    }

    .login-form {
        width: 100%;
    }

    .logo-container {
        display: flex;
        flex-direction: column;
        margin: 0;
    }

    .logo-login {
        margin: 0px
    }
}
</style>
