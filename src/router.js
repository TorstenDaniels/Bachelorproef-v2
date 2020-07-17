import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/home")
    },
    {
      path: "/profiel/:id",
      name: "profile",
      component: () => import("./views/profile")
    },
    {
      path: "/agenda",
      name: "agenda",
      component: () => import("./views/agenda")
    },
    {
      path: "/patienten",
      name: "patienten",
      component: () => import("./views/patienten")
    }
  ]
});