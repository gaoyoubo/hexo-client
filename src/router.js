import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "*",
      redirect: "/main"
    },
    {
      path: "/main",
      name: "main",
      component: () => import("./views/Main.vue")
    },
    {
      path: "/create",
      name: "create",
      component: () => import("./views/Create.vue")
    },
    {
      path: "/edit",
      name: "edit",
      component: () => import("./views/Edit.vue")
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("./views/Settings.vue")
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
