<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStoreUsuarios } from '../../stores/usuario.js';
import { useQuasar } from "quasar";

const $q = useQuasar();
const storeUsuarios = useStoreUsuarios();
const router = useRouter();

const userData = ref({ ...storeUsuarios.usuario });
const isLoading = ref(false);

async function guardarCambios() {
    isLoading.value = true;

    try {
        const res = await storeUsuarios.editar(userData.value._id, userData.value);

        // Check for estatus 200 (success)
        if (storeUsuarios.estatus === 200) {
            $q.notify({
                color: 'positive',
                message: 'Cambios guardados correctamente',
                position: 'top',
            });
            storeUsuarios.usuario = res; // Update user data in store
        }
        // Check for estatus 401 (session expired)
        else if (storeUsuarios.estatus === 401) {
            $q.notify({
                color: 'negative',
                message: 'Tu sesión ha expirado. Inicia sesión nuevamente para continuar',
                position: 'top',
            });
            router.push('/login'); // Optionally redirect to login
        }
    } catch (error) {
        // Catch any other errors
        $q.notify({
            color: 'negative',
            message: 'Error al intentar guardar los cambios',
            position: 'top',
        });
        console.error(error);
    } finally {
        isLoading.value = false;
    }
}

function cambiarContraseña() {
    router.push('/panel-admin/nueva-contrasena');
}
</script>

<template>
    <q-card class="profile-card">
        <div style="display: flex; flex-direction: column; align-items: center;">
            <h4>Editar Perfil</h4>
            <q-input v-model="userData.nombre" label="Nombre"  style="width: 300px;" />
            <q-input v-model="userData.apellido" label="Apellido"  style="width: 300px;" />
            <q-input v-model="userData.cedula" label="Identificación"  style="width: 300px;" />
            <q-input v-model="userData.correo" label="Correo" style="width: 300px;" />
            <q-input v-model="userData.telefono" label="Teléfono" style="width: 300px;" />
            <q-btn @click="guardarCambios" class="bg-primary" style="margin-top: 20px; color: white">
                <q-spinner-hourglass v-if="isLoading" /> Guardar cambios
            </q-btn>
            <q-btn @click="cambiarContraseña" style="margin-top: 20px;">Cambiar Contraseña</q-btn>
        </div>
    </q-card>
</template>


<style scoped>
q-input[readonly] {
    background-color: #f9f9f9;
    color: #333;
    cursor: not-allowed;
}

.profile-card {
    width: 400px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
