import { ref } from "vue";
import axios from 'axios';
import { defineStore } from 'pinia';

const modelo = 'ubicacion';
const estatus = ref('');
const validacion = ref('');
const nuevaUbicacionSalon = ref('');
const idUbicacionSalon = ref('');
const ubicacionSalonSeleccionado = ref('');
const editarUbicacionSalonSelec = ref('');

export const useStoreUbicacionSalon = defineStore(
  modelo,
  () => {
    const ubicacionesSalon = ref([]);

    const getAll = async () => {
      try {
        const response = await axios.get(`/${modelo}/all`);
        ubicacionesSalon.value = response.data;
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

    const getPorNombre = async (nombre) => {
      try {
        const response = await axios.get(`/${modelo}/buscarNombre/${nombre}`);
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
        nuevaUbicacionSalon.value = response.data._id;
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
      getPorNombre,
      registro,
      editar,
      activar,
      inactivar,
      ubicacionesSalon,
      estatus,
      validacion,
      nuevaUbicacionSalon,
      idUbicacionSalon,
      ubicacionSalonSeleccionado,
      editarUbicacionSalonSelec,
    };
  },
  {
    persist: true,
  }
);