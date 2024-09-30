import { createRouter, createWebHashHistory } from "vue-router";
import Nav from "../components/Nav.vue";
import Home from "../components/Home.vue";
import SalonFiltrado from "../components/SalonesFiltrados.vue";
import DetalleSalon from "../components/DetalleSalon.vue";
import Login from "../components/Login.vue";
import PanelAdmin from "../components/administrador/PanelAdmin.vue";
import MenuAdmin from "../components/administrador/MenuAdmin.vue";
import EditarPerfil from "../components/administrador/EditarPerfil.vue";
import Departamento from "../components/administrarTablas/Departamento.vue";
import Ciudad from "../components/administrarTablas/Ciudad.vue";
import SalonEvento from "../components/administrarTablas/SalonEvento.vue";
import TipoEvento from "../components/administrarTablas/TipoEvento.vue";
import EspacioSalon from "../components/administrarTablas/EspacioSalon.vue";
import ServicioSalon from "../components/administrarTablas/ServicioSalon.vue";
import TipoSalon from "../components/administrarTablas/TipoSalon.vue";
import UbicacionSalon from "../components/administrarTablas/UbicacionSalon.vue";
import ReglamentoSalon from "../components/administrarTablas/ReglamentoSalon.vue";
import ReservaSalon from "../components/administrarTablas/Reservas.vue";
import ContactoSalon from "../components/administrarTablas/ContactoSalon.vue";
import FormularioSalon from "../components/Formulario/FormularioSalon.vue";
import NuevaContraseña from "../components/administrador/NuevaContraseña.vue";
import recuperarContra from "../components/recuperarContraseña/RecuperarContrasena.vue";



const routes = [
  {
    path: "/",
    component: Nav,
    children: [
      { path: "", redirect: "/home" },
      {
        path: "/home",
        component: Home,
      },
      {
        path: "/busqueda",
        component: SalonFiltrado,
      },
      {
        path: "/detalle-salon",
        component: DetalleSalon,
      },
      {
        path: "/panel-admin",
        component: PanelAdmin,
        children: [
          { path: "", redirect: "/panel-admin/menu-admin" }, 
          { path: "menu-admin", component: MenuAdmin }, 
          { path: "editar-perfil" , component: EditarPerfil },
          { path: "nueva-contrasena" , component: NuevaContraseña },
          { path: "departamento", component: Departamento }, 
          { path: "ciudad", component: Ciudad }, 
          { path: "salon-evento", component: SalonEvento },
          { path: "tipo-evento", component: TipoEvento }, 
          { path: "espacio-salon", component: EspacioSalon }, 
          { path: "tipo-salon", component: TipoSalon }, 
          { path: "servicio-salon", component: ServicioSalon },
          { path: "ubicacion-salon", component: UbicacionSalon }, 
          { path: "reglamento-salon", component: ReglamentoSalon },
          { path: "reserva-salon", component: ReservaSalon },
          { path: "contacto-salon", component: ContactoSalon },
          { path: "formulario-salon" , component: FormularioSalon },
        ],
      },
    ],
  },
  {
    path: "/login",
    component: Login,
  },
  { path: "/recuperar-contrasena", component: recuperarContra },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
