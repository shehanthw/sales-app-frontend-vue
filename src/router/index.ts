import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/RegisterView.vue"),
    meta: { requiresAuth: true }, 
  },
  {
    path: "/",
    name: "Dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/customers",
    name: "Customers",
    component: () => import("../views/CustomersView.vue"),
    meta: { requiresAuth: true }, // Protect it with your existing guard!
  },
  {
    path: "/products",
    name: "Products",
    component: () => import("../views/ProductsView.vue"),
    meta: { requiresAuth: true }, // Protect it with your existing guard!
  },
  {
    path: "/orders",
    name: "Orders",
    component: () => import("../views/OrdersView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/collections",
    name: "Collections",
    component: () => import("../views/CollectionsView.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
