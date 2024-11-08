<script setup>
import { ref } from "vue";
import { useStoreUsuarios } from "../../stores/usuario.js";
import VerificarCodigo from "./validarCodigo.vue";
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import logoEsfera from '../../assets/logo-con-nombre.png';

const router = useRouter();
const useUsuario = useStoreUsuarios();
const loadingCorreo = ref(false);
const msgButton = ref("Recuperar contraseña");
const validacion = ref("");
const email = ref("");
const componenteVerificar = ref(false);
const $q = useQuasar();

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
}

function correoValido() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
}

function validarCorreo() {
  if (email.value.trim() === '' || !correoValido()) {
    notificar('negative', "Por favor ingrese un correo electrónico válido");
    return false;
  }
  return true;
}

function validarCampo() {
  if (!validarCorreo()) {
    return;
  }
  enviarCodigo();
}

async function enviarCodigo() {
  loadingCorreo.value = true;
  msgButton.value = "";
  try {
    const response = await useUsuario.codigoRecuperar(email.value);

    if (useUsuario.estatus === 400) {
      notificar('negative', useUsuario.validacion);
    } else if (useUsuario.estatus === 200) {
      useUsuario.correoRecuperar = email.value;
      componenteVerificar.value = true;
    } else {
      notificar('negative', useUsuario.validacion);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadingCorreo.value = false;
    msgButton.value = "Recuperar contraseña";
  }
}
</script>

<template>
  <div class="container-fluid">
    <div style="width: 100%;">
      <div class="logo-container">
        <router-link to="/login">
          <q-img :src="logoEsfera" width="300px"></q-img>
        </router-link>
      </div>
    </div>

    <section v-if="!componenteVerificar" class="main-section">
      <div class="card col-12 col-md-8 col-lg-6 text-center">
        <div class="card-body">
          <h2 class="card-title">Recuperar contraseña</h2>
          <p>Por favor, digite su correo para el proceso de recuperación de contraseña.</p>
          <form @submit.prevent="validarCampo">
            <div class="form-group">
              <input type="email" id="email" placeholder="Ej: correo@gmail.com" class="form-control" v-model="email" />
            </div>
            <button value="Recuperar contraseña" type="submit" class="btn bg-primary">
              <div v-if="loadingCorreo">
                <q-spinner color="white" size="20px" />
              </div>
              {{ msgButton }}
            </button>
          </form>
        </div>
      </div>
    </section>

    <VerificarCodigo v-if="componenteVerificar" />
  </div>
</template>

<style scoped>
/* General Styles */
.container-fluid {

  min-height: 100vh;
  padding: 0 20px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 15px;
}

.card {
  margin: 20px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  font-size: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-control:focus {
  border-color: #aaa;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.btn {
  color: rgb(255, 255, 255);
  font-weight: bold;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.btn:hover {
  background-color: #d5b754;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.right-btn {
  color: white;
}

/* Responsivo */
@media screen and (max-width: 768px) {
  .container-fluid {
    padding: 0 10px;
  }

  .card-title {
    font-size: 22px;
  }

  .form-control {
    font-size: 14px;
  }

  .btn {
    font-size: 14px;
    padding: 8px 16px;
  }
}

@media screen and (max-width: 480px) {
  .container-fluid {
    padding: 0 5px;
  }

  .card-title {
    font-size: 20px;
  }

  .form-control {
    font-size: 14px;
    padding: 8px;
  }

  .btn {
    font-size: 14px;
    padding: 8px 16px;
  }
}

.main-section {
  display: flex;
  flex-direction: column;

  width: 100%;
  flex-grow: 1;
}
</style>
