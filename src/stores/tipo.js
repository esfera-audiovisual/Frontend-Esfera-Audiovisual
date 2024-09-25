import { ref } from "vue";
import axios from 'axios';
import { defineStore } from 'pinia';

const modelo = 'tipo';
const estatus = ref('');
const validacion = ref('');
const nuevoTipo = ref('');
const nuevoTipoSalon = ref('');
const idTipoSalon = ref('');
const tipoSalonSeleccionado = ref('');
const editarTipoSalonSelec = ref('');

export const useStoreTipoSalon = defineStore(
  modelo,
  () => {
    const tipoSalones = ref([]);

    const getAll = async () => {
      try {
        const response = await axios.get(`/${modelo}/all`);
        tipoSalones.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const getPorId = async (id) => {
      try {
        const response = await axios.get(`/${modelo}/buscarId/${id}`);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const registro = async (data) => {
      try {
        const response = await axios.post(`/${modelo}/registro`, data);
        estatus.value = response.status;
        nuevoTipo.value = response.data;
        nuevoTipoSalon.value = response.data._id;
        return response.data;
      } catch (error) {
        console.log(error);
        validacion.value = error.response.data.error;
        estatus.value = error.response.status;
      }
    };

    const editar = async (id, data) => {
      try {
        const response = await axios.put(`/${modelo}/editar/${id}`, data);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const activar = async (id) => {
      try {
        const response = await axios.put(`/${modelo}/activar/${id}`);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const inactivar = async (id) => {
      try {
        const response = await axios.put(`/${modelo}/inactivar/${id}`);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    return {
      getAll,
      getPorId,
      registro,
      editar,
      activar,
      inactivar,
      tipoSalones,
      estatus,
      validacion,
      nuevoTipo,
      nuevoTipoSalon,
      idTipoSalon,
      tipoSalonSeleccionado,
      editarTipoSalonSelec,
    };
  },
  {
    persist: true,
  }
);