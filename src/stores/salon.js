import { ref } from "vue";
import axios from "axios";
import { defineStore } from "pinia";

const modelo = "salon-evento";
const estatus = ref("");
const validacion = ref("");
const nuevoSalon = ref("");
const idSalon = ref("");
const salonSeleccionado = ref("");
const editarSalonSelec = ref("");
const salonFiltroCiudad = ref("");
const salonFiltroCiudadNombre = ref("")
const salonFiltroAmbiente = ref("");
const salonFiltroAmbienteNombre = ref("");
const salonFiltroPersona = ref("");
const salonFiltroPrecio = ref("");
const salonFiltroEspacio = ref([]);
const salonFiltroServicio = ref([]);
const salonFiltroTipo = ref([]);
const salonFiltroUbicacion = ref([])
const salonesFiltrados = ref([]);
const detalleSalon = ref("");
const loading = ref(false);

export const useStoreSalon = defineStore(
  modelo,
  () => {
    const salones = ref([]);

    const getAll = async () => {
      try {
        const response = await axios.get(`${modelo}/all`);
        salones.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const getSalonesFiltrados = async (filters) => {
      try {
        const response = await axios.get(`${modelo}/salones`, {
          params: filters,
        });
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

    const getPorCiudad = async (idCiudad) => {
      try {
        const response = await axios.get(
          `${modelo}/buscarPorCiudad/${idCiudad}`
        );
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const agregar = async (data) => {
      try {
        const response = await axios.post(`${modelo}/registro`, data);
        estatus.value = response.status;
        nuevoSalon.value = response.data._id;
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
      getSalonesFiltrados,
      getPorId,
      getPorCiudad,
      agregar,
      editar,
      activar,
      inactivar,
      salones,
      estatus,
      validacion,
      nuevoSalon,
      idSalon,
      salonSeleccionado,
      editarSalonSelec,
      salonFiltroCiudad,
      salonFiltroCiudadNombre,
      salonFiltroAmbiente,
      salonFiltroAmbienteNombre,
      salonFiltroPersona,
      salonFiltroPrecio,
      salonFiltroEspacio,
      salonFiltroServicio,
      salonFiltroTipo,
      salonFiltroUbicacion,
      salonesFiltrados,
      loading,
      detalleSalon,
    };
  },
  {
    persist: true,
  }
);
