import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { healthCheck } from "../api/auth";

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
    meta: { requiresAuth: true },
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

router.beforeEach(async (to, _from, next) => {
    const isAuthenticated = await healthCheck();

    // Check if the page we are going to HAS 'requiresAuth: true'
    const routeRequiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (routeRequiresAuth && !isAuthenticated) {
        // User tried to go to a private page but isn't logged in
        next({ name: "Login" });
    } else {
        // Page is public OR user is logged in
        next();
    }
});

export default router;


