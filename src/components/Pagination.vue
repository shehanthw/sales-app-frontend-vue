<template>
    <div class="mt-5 flex justify-center lg:justify-end items-center gap-4">
      <button 
        @click="previousPage" 
        :disabled="currentPage === 1"
        class="border px-4 py-1 cursor-pointer rounded-md hover:border-neutral-400 shadow-sm"
      >
        <
      </button>
      <div class="px-4 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-tighter">
        Page {{ currentPage }} / {{ totalPages }}
      </div>
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="border px-4 py-1 cursor-pointer rounded-md hover:border-neutral-400 shadow-sm"
      >
        >
      </button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  totalPages: number;
  currentPage: number;
  previousPage: () => void;
  nextPage: () => void;
}>();
</script>