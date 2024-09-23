import { ref } from "vue";
import axios from 'axios';
import { defineStore } from 'pinia';

const modelo = 'departamento';
const estatus = ref('');
const validacion = ref('');
const nuevoDepartamentoSalon = ref('');
const idDepartamentoSalon = ref('');
const departamentoSalonSeleccionado = ref('');
const editarDepartamentoSalonSelec = ref('');
const departamentoCiudad = ref('');

export const useStoreDepartamentoSalonEvento = defineStore(
    modelo,
    () => {
        const departamentosSalones = ref([]);

        // Obtener todos los departamentos
        const getAll = async () => {
            try {
                const response = await axios.get(`/${modelo}/all`);
                departamentosSalones.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Obtener departamento por ID
        const getPorId = async (id) => {
            try {
                const response = await axios.get(`/${modelo}/buscarId/${id}`);
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 400;
            }
        };

        // Obtener departamento por nombre
        const getPorNombre = async (nombre) => {
            try {
                const response = await axios.get(`/${modelo}/buscarNombre/${nombre}`);
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Registrar un nuevo departamento
        const registro = async (data) => {
            try {
                const response = await axios.post(`/${modelo}/registro`, data);
                estatus.value = response.status;
                nuevoDepartamentoSalon.value = response.data._id;
                return response.data;
            } catch (error) {
                console.log(error);
                validacion.value = error.response?.data?.error || 'Error en el registro';
                estatus.value = error.response?.status || 500;
            }
        };

        // Editar un departamento existente
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

        // Activar un departamento
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

        // Desactivar un departamento
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
            departamentosSalones,
            estatus,
            validacion,
            nuevoDepartamentoSalon,
            idDepartamentoSalon,
            departamentoSalonSeleccionado,
            editarDepartamentoSalonSelec,
            departamentoCiudad,
        };
    },
    {
        persist: true, // Para mantener el estado después de recargar la página
    }
);
