<template>
  <div class="min-h-screen bg-gray-50">
    <nav
      v-if="$route.name !== 'Login'"
      class="fixed top-0 left-0 right-0 bg-white shadow z-50"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <div class="hidden sm:flex items-center gap-6">
            <router-link
              to="/"
              :class="[
                'font-medium transition',
                $route.path === '/'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-blue-600',
              ]"
              >Dashboard</router-link
            >
            <router-link
              to="/customers"
              :class="[
                'font-medium transition',
                $route.path === '/customers'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-blue-600',
              ]"
              >Customers</router-link
            >
            <router-link
              to="/products"
              :class="[
                'font-medium transition',
                $route.path === '/products'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-blue-600',
              ]"
              >Products</router-link
            >
            <router-link
              to="/orders"
              :class="[
                'font-medium transition',
                $route.path === '/orders'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-blue-600',
              ]"
              >Orders</router-link
            >
          </div>

          <div class="flex items-center ml-auto">
            <button
              @click="handleLogout"
              class="hidden sm:inline-flex px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>

            <button
              @click="toggleMobile"
              class="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Open menu"
            >
              <svg
                v-if="!mobileOpen"
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                v-else
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="mobileOpen" class="sm:hidden border-t border-gray-100">
          <div class="px-2 pt-2 pb-3 space-y-3">

            <div class="flex w-full justify-end">
              <button
                @click="
                  () => {
                    toggleMobile();
                    handleLogout();
                  }
                "
                class="text-left px-3 py-1 rounded-md border-red-600 border text-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>

            <router-link
              to="/"
              @click="toggleMobile"
              :class="[
                'block px-3 py-2 rounded-md text-base font-medium transition',
                $route.path === '/'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
              >Dashboard</router-link
            >
            <router-link
              to="/customers"
              @click="toggleMobile"
              :class="[
                'block px-3 py-2 rounded-md text-base font-medium transition',
                $route.path === '/customers'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
              >Customers</router-link
            >
            <router-link
              to="/products"
              @click="toggleMobile"
              :class="[
                'block px-3 py-2 rounded-md text-base font-medium transition',
                $route.path === '/products'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
              >Products</router-link
            >
            <router-link
              to="/orders"
              @click="toggleMobile"
              :class="[
                'block px-3 py-2 rounded-md text-base font-medium transition',
                $route.path === '/orders'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
              >Orders</router-link
            >
            
          </div>
        </div>
      </div>
    </nav>

    <main :class="['pt-16', $route.name !== 'Login' ? 'pt-16' : 'py-8']">
      <div class="mt-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import "./style.css";
import api from "./api/api";

const router = useRouter();
const mobileOpen = ref(false);

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value;
};

const handleLogout = async () => {
  try {
    await api.post("/api/logout");
    router.push("/login");
  } catch (err) {
    console.error("Logout failed", err);
  }
};
</script>
