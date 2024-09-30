<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStoreUsuarios } from "../../stores/usuario.js";
import { useQuasar } from 'quasar';

const router = useRouter();
const useUsuario = useStoreUsuarios();
const showOne = ref(true);
const showTwo = ref(false);

// Enviar nueva contraseña
const data = ref({
  correo: useUsuario.email,
  codigo: useUsuario.codigoCorreo,
  password: ""
});
const checkPassword = ref("");
const validacion = ref("");
const showPasswordError = ref(false);
const showConfirmPasswordError = ref(false);
const msgButton = ref("Cambiar contraseña");
const loadNuevaPass = ref(false);
const $q = useQuasar();

function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
}

async function nuevaPassword() {
  try {
    loadNuevaPass.value = true;
    msgButton.value = "";

    const response = await useUsuario.nuevaPassword(data.value);

    if (!response) return;

    if (useUsuario.estatus == 200) {
      showOne.value = false;
      showTwo.value = true;
    } else if (useUsuario.estatus === 400) {
      notificar('negative', useUsuario.validacion);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loadNuevaPass.value = false;
    msgButton.value = "Cambiar contraseña";
  }
}

// Validaciones
const vali = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;


function validarCampos() {
  showPasswordError.value = !vali.test(data.value.password);
  showConfirmPasswordError.value = checkPassword.value !== data.value.password;

  if(showConfirmPasswordError.value){
    notificar('negative', "Las contraseñas no coinciden");
  }

  if (!showPasswordError.value && !showConfirmPasswordError.value) {
    nuevaPassword();
  }
}



const tipoContrasena = ref("password");
const iconoContrasena = ref("fa fa-eye-slash");

function ocultarContrasena() {
  if (tipoContrasena.value === "password") {
    tipoContrasena.value = "text";
    iconoContrasena.value = "fa fa-eye";
  } else {
    tipoContrasena.value = "password";
    iconoContrasena.value = "fa fa-eye-slash";
  }
}


function home() {
  router.push('/login');
}
</script>

<template>
  <main>
    <section class="container" v-if="showOne">
      <form class="form" @submit.prevent="validarCampos">
        <div class="form-group">
          <label class="text-bold text-h6" for="password">Por favor, ingrese la nueva contraseña</label>
          <div class="input-wrapper">
            <input :type="tipoContrasena" id="password" class="form-control" v-model="data.password" placeholder="Nueva contraseña..." />
            <i :class="iconoContrasena" @click="ocultarContrasena" class="toggle-password"></i>
          </div>
          <p class="text-center text-negative text-bold" v-if="showPasswordError">
            La contraseña debe contener una minúscula, una mayúscula, un número, un
            carácter especial y 8 caracteres como mínimo.
          </p>

          <label class="text-bold text-h6" for="confirm-password">Confirmar Contraseña</label>
          <div class="input-wrapper">
            <input :type="tipoContrasena" id="confirm-password" class="form-control" v-model="checkPassword" placeholder="Confirmar contraseña..." />
            <i :class="iconoContrasena" @click="ocultarContrasena" class="toggle-password"></i>
          </div>
          <button value="Enviar" type="submit" class="btn bg-primary">
              <div v-if="loadNuevaPass">
                <q-spinner color="white" size="20px" />
              </div>
              {{ msgButton }}
            </button>
        </div>
      </form>
    </section>

    <section v-if="showTwo" id="second">
      <article id="stext">
        <div id="stext11">
          <p id="smessage">¡La contraseña ha sido cambiada exitosamente!</p>
          <div id="stext2">
            <p id="smessage2">Ahora puede ingresar al sistema</p>
            <button type="submit" class="btn bg-primary" @click="home">Ir al inicio</button>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>


<style scoped>

.input-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.form-control {
  width: 100%;
}

.container {
  max-width: 600px;
  margin: 20px auto;
  padding: 30px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}



.form-group {
  margin-bottom: 20px;
}

.input-group {
  position: relative;
}

.input-group-text {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background: transparent;
  border: none;
}

.form-control {
  width: 100%;
  font-size: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 10px 0px;
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


.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}



#stext {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

#stext11 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 40%;
  padding: 25px;
  min-height: 40vh;
  gap: 20px;
}

#smessage {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

#smessage2 {
  font-size: 16px;
}

#stext2 {
  width: 100%;
  text-align: center;
}

/* Responsivo */
@media screen and (max-width: 768px) {
  .container {
    width: 90%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  #stext11 {
    width: 70%;
  }

  #smessage {
    font-size: 20px;
  }

  #smessage2 {
    font-size: 14px;
  }
}

@media screen and (max-width: 480px) {
  .container {
    width: 100%;
    box-shadow: none;
  }

  #stext11 {
    width: 90%;
    box-shadow: none;
  }

  #smessage {
    font-size: 18px;
  }

  #smessage2 {
    font-size: 12px;
  }
}
</style>

