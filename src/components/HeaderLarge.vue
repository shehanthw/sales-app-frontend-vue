<template>
  <div
    v-if="userMenuOpen"
    class="absolute right-0 mt-5 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 origin-top-right"
  >
    <div class="px-4 py-3 border-b border-gray-50 mb-1">
      <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">
        Signed in as
      </p>
      <p class="text-sm font-bold text-gray-900 truncate">admin@salespro.com</p>
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
</template>

<script setup lang="ts">

    const props = defineProps<{
        userMenuOpen: boolean;
        handleLogout: () => void;
    }>();

</script>
