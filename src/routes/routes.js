import { createRouter, createWebHashHistory } from "vue-router";
import Nav from "../components/Nav.vue"; 
import Home from "../components/Home.vue";
import SalonFiltrado from "../components/SalonesFiltrados.vue";
import DetalleSalon from "../components/DetalleSalon.vue";

const routes = [
  {
    path: "/",
    component: Nav,
    children: [
      { path: "", redirect: "/home" }, // Redirige la ruta raíz a "/home"
      {
        path: "home",
        component: Home,
      },
      {
        path: "busqueda",
        component: SalonFiltrado,
      },
      {
        path: "detalle-salon",
        component: DetalleSalon,
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
