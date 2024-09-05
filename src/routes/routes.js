import { createRouter, createWebHashHistory } from "vue-router";
import Nav from "../components/Nav.vue";
import Home from "../components/Home.vue";
import SalonFiltrado from "../components/SalonesFiltrados.vue";
import DetalleSalon from "../components/DetalleSalon.vue";
import Login from "../components/Login.vue";
import PanelAdmin from "../components/administrador/PanelAdmin.vue";
import MenuAdmin from "../components/administrador/MenuAdmin.vue";

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
        ],
      },
    ],
  },
  {
    path: "/login",
    component: Login,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
