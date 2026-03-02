<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <nav
      v-if="$route.name !== 'Login'"
      class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-8">
            <div
              class="flex items-center gap-2 group cursor-pointer"
              @click="$router.push('/')"
            >
              <div
                class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 group-hover:scale-105 transition"
              >
                S
              </div>
              <span class="font-black text-xl tracking-tight text-gray-900">
                SALES<span class="text-blue-600">PRO</span>
              </span>
            </div>

            <div class="hidden md:flex items-center gap-1">
              <router-link
                v-for="link in navLinks"
                :key="link.path"
                :to="link.path"
                :class="[
                  $route.path === link.path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                  'px-4 py-2 rounded-lg text-sm font-bold transition-all relative group',
                ]"
              >
                {{ link.name }}
                <div
                  v-if="$route.path === link.path"
                  class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                ></div>
              </router-link>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="relative user-menu-container hidden sm:block">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                >
                  AD
                </div>
                <span class="text-sm font-bold text-gray-700">Admin</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-400 transition-transform"
                  :class="{ 'rotate-180': userMenuOpen }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <transition name="dropdown">
                <div
                  v-if="userMenuOpen"
                  class="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 origin-top-right"
                >
                  <div class="px-4 py-3 border-b border-gray-50 mb-1">
                    <p
                      class="text-[10px] text-gray-400 font-black uppercase tracking-widest"
                    >
                      Signed in as
                    </p>
                    <p class="text-sm font-bold text-gray-900 truncate">
                      admin@salespro.com
                    </p>
                  </div>

                  <div class="px-3">
                    <button
                      @click="handleLogout"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 transition-colors rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </transition>
            </div>

            <button
              @click="toggleMobile"
              class="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg
                v-if="!mobileOpen"
                class="h-6 w-6"
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
      </div>

      <transition name="mobile-anim">
        <div
          v-if="mobileOpen"
          class="md:hidden bg-white border-t border-gray-100 p-4 space-y-2 shadow-xl"
        >
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            @click="toggleMobile"
            :class="[
              $route.path === link.path
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                : 'text-gray-700 hover:bg-gray-50',
              'block px-4 py-3 rounded-xl font-bold transition-all',
            ]"
          >
            {{ link.name }}
          </router-link>
          <div class="pt-2 border-t border-gray-50 mt-2">
            <button
              @click="handleLogout"
              class="w-full px-4 py-3 text-left text-red-600 font-bold flex items-center gap-2"
            >
              Logout
            </button>
          </div>
        </div>
      </transition>
    </nav>

    <main
      :class="['min-h-screen', $route.name !== 'Login' ? 'pt-20 pb-10' : '']"
    >
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import api from "./api/api";
import "./style.css";

const router = useRouter();
const mobileOpen = ref(false);
const userMenuOpen = ref(false);

const navLinks = [
  { name: "Dashboard", path: "/" },
  { name: "Customers", path: "/customers" },
  { name: "Products", path: "/products" },
  { name: "Orders", path: "/orders" },
];

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value;
};

const handleLogout = async () => {
  try {
    await api.post("/api/logout");
    userMenuOpen.value = false;
    mobileOpen.value = false;
    router.push("/login");
  } catch (err) {
    console.error("Logout failed", err);
  }
};

// Logic to close dropdown when clicking anywhere else
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".user-menu-container")) {
    userMenuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
});
</script>

<style>
/* Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.1s ease-out;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* Mobile Menu Animation */
.mobile-anim-enter-active,
.mobile-anim-leave-active {
  transition: all 0.3s ease;
}
.mobile-anim-enter-from,
.mobile-anim-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
