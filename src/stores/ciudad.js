import { ref } from "vue";
import axios from "axios";
import { defineStore } from "pinia";

const modelo = "ciudad";
const estatus = ref("");
const validacion = ref("");
const nuevaCiudad = ref("");
const idCiudad = ref("");
const ciudadSeleccionada = ref("");
const editarCiudadSelec = ref("");

export const useStoreCiudad = defineStore(
  modelo,
  () => {
    const ciudades = ref([]);

    const getAll = async () => {
      try {
        const response = await axios.get(`${modelo}/all`);
        ciudades.value = response.data;
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
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const getCiudadesPorDepartamento = async (idDepartamento) => {
      try {
        const response = await axios.get(
          `${modelo}/ciudad-por-departamento/${idDepartamento}`
        );
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
        estatus.value = response.status;
        nuevaCiudad.value = response.data._id;
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
      getCiudadesPorDepartamento,
      getPorNombre,
      registro,
      editar,
      activar,
      inactivar,
      ciudades,
      estatus,
      validacion,
      nuevaCiudad,
      idCiudad,
      ciudadSeleccionada,
      editarCiudadSelec,
    };
  },
  {
    persist: true,
  }
);
