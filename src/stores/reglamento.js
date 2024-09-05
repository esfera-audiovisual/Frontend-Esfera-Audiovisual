import { ref } from "vue";
import axios from 'axios';
import { defineStore } from 'pinia';

const modelo = 'reglamento';
const estatus = ref('');
const validacion = ref('');
const nuevoReglamentoSalon = ref('');
const idReglamentoSalon = ref('');
const reglamentoSalonSeleccionado = ref('');
const editarReglamentoSalonSelec = ref('');

export const useStoreReglamentoSalon = defineStore(
    modelo,
    () => {
        const reglamentosSalones = ref([]);

        const getAll = async () => {
            try {
                const response = await axios.get(`/${modelo}/all`);
                reglamentosSalones.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

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

        const getPorSalonEvento = async (idSalonEvento) => {
            try {
                const response = await axios.get(`/${modelo}/buscarPorSalon/${idSalonEvento}`);
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.log(error);
                estatus.value = error.response?.status || 500;
            }
        };

        const registro = async (data) => {
            try {
                const response = await axios.post(`/${modelo}/registro`, data);
                estatus.value = response.status;
                nuevoReglamentoSalon.value = response.data._id;
                return response.data;
            } catch (error) {
                console.log(error);
                validacion.value = error.response?.data?.error || 'Error en el registro';
                estatus.value = error.response?.status || 500;
            }
        };

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
            getPorSalonEvento,
            registro,
            editar,
            activar,
            inactivar,
            reglamentosSalones,
            estatus,
            validacion,
            nuevoReglamentoSalon,
            idReglamentoSalon,
            reglamentoSalonSeleccionado,
            editarReglamentoSalonSelec,
        };
    },
    {
        persist: true,
    }
);
