import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import api, { type AuthCheckResponse } from "../api/api";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard logic
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const { data } = await api.get<AuthCheckResponse>("/api/check");
      if (data.logged_in) {
        next();
      } else {
        next({ name: "Login" });
      }
    } catch (error) {
      next({ name: "Login" });
    }
  } else {
    next();
  }
});

export default router;
