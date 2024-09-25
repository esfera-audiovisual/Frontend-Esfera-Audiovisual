import { ref } from "vue";
import axios from "axios";
import { defineStore } from "pinia";

const modelo = "ambiente";
const estatus = ref("");
const validacion = ref("");
const nuevoAmb = ref('');
const nuevoAmbiente = ref("");
const idAmbiente = ref("");
const ambienteSeleccionado = ref("");
const editarAmbienteSelec = ref("");

export const useStoreAmbienteSalon = defineStore(
  modelo,
  () => {
    const ambientes = ref([]);
    const ambiente = ref({});

    const getAll = async () => {
      try {
        const response = await axios.get(`${modelo}/all`);
        ambientes.value = response.data;
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
        ambiente.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const getPorNombre = async (nombre) => {
      try {
        const response = await axios.get(`${modelo}/buscarPorNombre/${nombre}`);
        ambientes.value = response.data;
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
        nuevoAmb.value = response.data;
        nuevoAmbiente.value = response.data._id;
        estatus.value = response.status;
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
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const activar = async (id) => {
      try {
        const response = await axios.put(`${modelo}/activar/${id}`);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const inactivar = async (id) => {
      try {
        const response = await axios.put(`${modelo}/inactivar/${id}`);
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
      ambientes,
      ambiente,
      estatus,
      validacion,
      nuevoAmb,
      nuevoAmbiente,
      idAmbiente,
      ambienteSeleccionado,
      editarAmbienteSelec,
    };
  },
  {
    persist: true,
  }
);