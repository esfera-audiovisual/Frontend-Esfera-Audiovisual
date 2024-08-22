import { ref } from "vue";
import axios from "axios";
import { defineStore } from "pinia";

const modelo = "espacio";
const estatus = ref("");
const validacion = ref("");
const nuevoEspacioSalon = ref("");
const idEspacioSalon = ref("");
const espacioSalonSeleccionado = ref("");
const editarEspacioSalonSelec = ref("");
const EspacioSalonHome = ref("");

export const useStoreEspacioSalon = defineStore(
  modelo,
  () => {
    const espaciosSalon = ref([]);

    const getAll = async () => {
      try {
        const response = await axios.get(`${modelo}/all`);
        console.log(response);
        espaciosSalon.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const getPorId = async (id) => {
      try {
        const response = await axios.get(`${modelo}/buscarId/${id}`);
        console.log(response);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const getPorNombre = async (nombre) => {
      try {
        const response = await axios.get(`${modelo}/buscarNombre/${nombre}`);
        console.log(response);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const registro = async (data) => {
      try {
        const response = await axios.post(`${modelo}/registro`, data);
        console.log(response);
        estatus.value = response.status;
        nuevoEspacioSalon.value = response.data._id;
        return response.data;
      } catch (error) {
        console.log(error);
        validacion.value = error.response.data.error;
        estatus.value = error.response.status;
      }
    };

    const editar = async (id, data) => {
      try {
        const response = await axios.put(`${modelo}/editar/${id}`, data);
        estatus.value = response.status;
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const activar = async (id) => {
      try {
        const response = await axios.put(`${modelo}/activar/${id}`);
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const inactivar = async (id) => {
      try {
        const response = await axios.put(`${modelo}/inactivar/${id}`);
        console.log(response);
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
      espaciosSalon,
      estatus,
      validacion,
      nuevoEspacioSalon,
      idEspacioSalon,
      espacioSalonSeleccionado,
      editarEspacioSalonSelec,
      EspacioSalonHome,
    };
  },
  {
    persist: true,
  }
);