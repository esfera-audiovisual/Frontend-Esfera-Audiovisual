import { ref } from "vue";
import axios from 'axios';
import { defineStore } from 'pinia';

const modelo = 'contacto';

export const useStoreContactoSalon = defineStore(
    modelo,
    () => {
        const contactosSalon = ref([]);
        const estatus = ref('');
        const validacion = ref('');
        const nuevoContacto = ref('');
        const nuevoContactoSalon = ref('');
        const idContactoSalon = ref('');
        const contactoSalonSeleccionado = ref(null);

        // Obtener todos los contactos de salón
        const getAll = async () => {
            try {
                const response = await axios.get(`/${modelo}/all`);
                contactosSalon.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Obtener contacto por ID
        const getPorId = async (id) => {
            try {
                const response = await axios.get(`/${modelo}/buscarId/${id}`);
                contactoSalonSeleccionado.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 400;
            }
        };

        // Obtener contactos por nombre
        const getPorNombre = async (nombre) => {
            try {
                const response = await axios.get(`/${modelo}/buscarNombre/${nombre}`);
                contactosSalon.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Registrar un nuevo contacto de salón
        const registro = async (data) => {
            try {
                const response = await axios.post(`/${modelo}/registro`, data);
                nuevoContacto.value = response.data;
                nuevoContactoSalon.value = response.data._id;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                validacion.value = error.response?.data?.error || 'Error en el registro';
                estatus.value = error.response?.status || 500;
            }
        };

        // Editar un contacto de salón existente
        const editar = async (id, data) => {
            try {
                const response = await axios.put(`/${modelo}/editar/${id}`, data);
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Activar un contacto de salón
        const activar = async (id) => {
            try {
                const response = await axios.put(`/${modelo}/activar/${id}`);
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Desactivar un contacto de salón
        const inactivar = async (id) => {
            try {
                const response = await axios.put(`/${modelo}/inactivar/${id}`);
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        return {
            getAll,
            getPorId,
            getPorNombre,
            registro,
            editar,
            activar,
            inactivar,
            contactosSalon,
            estatus,
            validacion,
            nuevoContacto,
            nuevoContactoSalon,
            idContactoSalon,
            contactoSalonSeleccionado,
        };
    },
    {
        persist: true, // Para mantener el estado después de recargar la página
    }
);
