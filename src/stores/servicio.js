import { ref } from "vue";
import axios from 'axios';
import { defineStore } from 'pinia';

const modelo = 'servicio';
const estatus = ref('');
const validacion = ref('');
const nuevoServicio = ref('');
const nuevoServicioSalon = ref('');
const idServicioSalon = ref('');
const servicioSalonSeleccionado = ref('');
const editarServicioSalonSelec = ref('');

export const useStoreServicioSalon = defineStore(
  modelo,
  () => {
    const servicioSalones = ref([]);

    const getAll = async () => {
      try {
        const response = await axios.get(`/${modelo}/all`);
        servicioSalones.value = response.data;
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
        nuevoServicio.value = response.data;
        nuevoServicioSalon.value = response.data._id;
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
      servicioSalones,
      estatus,
      validacion,
      nuevoServicio,
      nuevoServicioSalon,
      idServicioSalon,
      servicioSalonSeleccionado,
      editarServicioSalonSelec,
    };
  },
  {
    persist: true,
  }
);