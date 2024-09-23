import { ref } from "vue";
import axios from 'axios';
import { defineStore } from 'pinia';

const modelo = 'reserva';

export const useStoreReserva = defineStore(
    modelo,
    () => {
        // Variables reactivas
        const reservas = ref([]);
        const reservaSeleccionada = ref(null);
        const estatus = ref('');
        const validacion = ref('');

        // Obtener todas las reservas
        const getAll = async () => {
            try {
                const response = await axios.get(`/${modelo}/all`);
                reservas.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.error(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Obtener una reserva por ID
        const getPorId = async (id) => {
            try {
                const response = await axios.get(`/${modelo}/${id}`);
                reservaSeleccionada.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.error(error);
                estatus.value = error.response?.status || 400;
            }
        };

        // Obtener reservas por nombre del cliente
        const getPorNombreCliente = async (nombre_cliente) => {
            try {
                const response = await axios.get(`/${modelo}/cliente/${nombre_cliente}`);
                reservas.value = response.data;
                estatus.value = response.status;
                return response.data;
            } catch (error) {
                console.error(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Registrar una nueva reserva
        const registro = async (data) => {
            try {
                const response = await axios.post(`/${modelo}/registro`, data);
                estatus.value = response.status;
                reservas.value.push(response.data); // Añadir la nueva reserva a la lista
                return response.data;
            } catch (error) {
                console.error(error);
                validacion.value = error.response?.data?.error || 'Error en el registro';
                estatus.value = error.response?.status || 500;
            }
        };

        // Editar una reserva existente
        const editar = async (id, data) => {
            try {
                const response = await axios.put(`/${modelo}/editar/${id}`, data);
                estatus.value = response.status;
                const index = reservas.value.findIndex(res => res._id === id);
                if (index !== -1) reservas.value[index] = response.data; // Actualiza la reserva en la lista
                return response.data;
            } catch (error) {
                console.error(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Activar una reserva
        const activar = async (id) => {
            try {
                const response = await axios.put(`/${modelo}/activar/${id}`);
                estatus.value = response.status;
                const index = reservas.value.findIndex(res => res._id === id);
                if (index !== -1) reservas.value[index] = response.data; // Actualiza la reserva activada
                return response.data;
            } catch (error) {
                console.error(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Inactivar una reserva
        const inactivar = async (id) => {
            try {
                const response = await axios.put(`/${modelo}/inactivar/${id}`);
                estatus.value = response.status;
                const index = reservas.value.findIndex(res => res._id === id);
                if (index !== -1) reservas.value[index] = response.data; // Actualiza la reserva inactivada
                return response.data;
            } catch (error) {
                console.error(error);
                estatus.value = error.response?.status || 500;
            }
        };

        // Generar enlace de WhatsApp para contacto
        const generarEnlaceWhatsApp = async () => {
            try {
                const response = await axios.get(`/${modelo}/contacto`);
                estatus.value = response.status;
                return response.data.link;
            } catch (error) {
                console.error(error);
                estatus.value = error.response?.status || 500;
            }
        };

        return {
            getAll,
            getPorId,
            getPorNombreCliente,
            registro,
            editar,
            activar,
            inactivar,
            generarEnlaceWhatsApp,
            reservas,
            reservaSeleccionada,
            estatus,
            validacion
        };
    },
    {
        persist: true, // Mantener persistencia para guardar el estado incluso después de recargar la página
    }
);
