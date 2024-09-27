import { ref } from "vue";
import axios from "axios";
import { defineStore } from "pinia";
import { useQuasar } from "quasar";

const modelo = "salon-evento";
const estatus = ref("");
const validacion = ref("");
const nuevoSalon = ref("");
const idSalon = ref("");
const urlImagen = ref("");
const publicImagen = ref("");
const salonSeleccionado = ref("");
const editarSalonSelec = ref("");
const salonFiltroCiudad = ref("");
const salonFiltroCiudadNombre = ref("");
const salonFiltroAmbiente = ref("");
const salonFiltroAmbienteNombre = ref("");
const salonFiltroPersona = ref("");
const salonFiltroFecha = ref("");
const salonFiltroPrecio = ref(0);
const salonFiltroEspacio = ref([]);
const salonFiltroServicio = ref([]);
const salonFiltroTipo = ref([]);
const salonFiltroUbicacion = ref([]);
const salonesFiltrados = ref([]);
const detalleSalon = ref("");
const salonCiudLatitud = ref("");
const salonCiudLongitud = ref("");
const devolverHomeDetalle = ref(false);
const loading = ref(false);
const idSalonSelec = ref('');


export const useStoreSalon = defineStore(
  modelo,
  () => {
    const salones = ref([]);
    const $q = useQuasar();
    function notificar(tipo, msg) {
      $q.notify({
        type: tipo,
        message: msg,
        position: "top",
      });
    }

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
        const response = await axios.get(`${modelo}/${id}`);
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

    const registro = async (data) => {
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
        notificar("negative", error.response.data.error);
      }
    };

    const subirGrupoFotos = async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "fotossalon");

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dsdnk8yhz/image/upload`,
          formData,
          config
        );

        console.log('fotos-cloudinary', response)

        urlImagen.value = response.data.secure_url;
        publicImagen.value = response.data.public_id;

        // Devuelve tanto el secure_url como el public_id de Cloudinary
        return {
          secure_url: response.data.secure_url,
          public_id: response.data.public_id,
        };
      } catch (error) {
        console.error("Error al subir la foto:", error);
        throw error; // Re-lanza el error para que pueda manejarse donde se llama la función
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
      registro,
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
      salonFiltroFecha,
      salonFiltroPrecio,
      salonFiltroEspacio,
      salonFiltroServicio,
      salonFiltroTipo,
      salonFiltroUbicacion,
      salonesFiltrados,
      loading,
      detalleSalon,
      salonCiudLatitud,
      salonCiudLongitud,
      devolverHomeDetalle,
      subirGrupoFotos,
      urlImagen,
      publicImagen,
      idSalonSelec,
    };
  },
  {
    persist: true,
  }
);
