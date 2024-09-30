<script setup>
import { ref } from "vue";
import { useStoreUsuarios } from "../../stores/usuario.js";
import { useRouter } from 'vue-router';
import NuevaPassword from "./nuevaContraseña.vue";
import { useQuasar } from 'quasar';

const router = useRouter();
const codigo = ref("");
const useUsuario = useStoreUsuarios();
const email = useUsuario.email;
const validacion = ref("");
const componenteNuevaPass = ref(false);
const loadVerificar = ref(false);
const msgButton = ref("Enviar");

const $q = useQuasar();

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
}

async function confirmarCodigo() {
  try {
    loadVerificar.value = true;
    msgButton.value = "";
    const response = await useUsuario.confirmarCodigo(codigo.value);

    if (useUsuario.estatus === 200) {
      componenteNuevaPass.value = true;
    } else if (useUsuario.estatus == 400) {
      notificar('negative', useUsuario.validacion);
      return;
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadVerificar.value = false;
    msgButton.value = "Enviar";
  }
}

// Validaciones
function validarCampos() {
  if (codigo.value === null || codigo.value === "") {
    notificar('negative', 'Por favor digite el código');
    return;
  }
  confirmarCodigo();
}

function home() {
  router.push('/login')
}
</script>

<template>
  <div class="container-fluid">
    <section v-if="!componenteNuevaPass" style="display: flex; justify-content: center; align-items: center;">
      <div class="card col-12 col-md-8 col-lg-6 text-center">
        <div class="card-body">
          <h2 class="card-title">Verificar código</h2>
          <p class="card-text">Por favor, digite el código de verificación enviado a {{ email }}</p>
          <form @submit.prevent="validarCampos">
            <div class="form-group">
              <input type="number" id="codigo" placeholder="Digite el código..." class="form-control"
                v-model="codigo" />
            </div>
            <button value="Enviar" type="submit" class="btn bg-primary">
              <div v-if="loadVerificar">
                <q-spinner color="white" size="20px" />
              </div>
              {{ msgButton }}
            </button>
          </form>
        </div>
      </div>
    </section>

    <section v-if="componenteNuevaPass">
      <NuevaPassword />
    </section>
  </div>
</template>

<style scoped>
.card {
  margin: 20px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-text {
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
}

.btn:hover {
  background-color: #d5b754;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Responsivo */
@media screen and (max-width: 768px) {
  .company-name {
    font-size: 16px;
  }
}

@media screen and (max-width: 480px) {
  .company-name {
    font-size: 14px;
  }
}
</style>
