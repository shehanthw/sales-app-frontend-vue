<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="p in paginatedProducts"
        :key="p.id"
        class="group bg-white border border-gray-200 shadow-sm hover:shadow-md rounded-xl p-5 transition-all duration-200 flex flex-col justify-between"
      >
        <div>
          <div class="flex justify-between items-start mb-2">
            <span class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded">
              {{ p.category || 'Uncategorized' }}
            </span>
            <span 
              :class="p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              class="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="p.is_active ? 'bg-green-500' : 'bg-red-500'"></span>
              {{ p.is_active ? 'ACTIVE' : 'INACTIVE' }}
            </span>
          </div>

          <h3 class="text-lg font-bold text-gray-900 truncate mb-1">
            {{ p.product_name }}
          </h3>
          <p class="text-gray-500 text-xs line-clamp-2 mb-4 min-h-[32px]">
            {{ p.description || 'No description provided.' }}
          </p>

          <div class="grid grid-cols-2 gap-3 mb-6">
            <div class="bg-blue-50 p-2 rounded-lg">
              <p class="text-[10px] text-blue-600 font-semibold uppercase">Selling Price</p>
              <p class="text-lg font-bold text-blue-900">${{ p.selling_price.toFixed(2) }}</p>
            </div>
            <div class="bg-gray-50 p-2 rounded-lg">
              <p class="text-[10px] text-gray-500 font-semibold uppercase">Stock Level</p>
              <p class="text-lg font-bold" :class="p.quantity < 10 ? 'text-orange-600' : 'text-gray-900'">
                {{ p.quantity }} <span class="text-xs font-normal text-gray-500">{{ p.unit }}</span>
              </p>
            </div>
          </div>

          <div class="space-y-1.5 border-t border-gray-100 pt-3 mb-4">
            <div class="flex justify-between text-xs">
              <span class="text-gray-500">Buying Cost:</span>
              <span class="font-medium text-gray-700">${{ p.buying_price.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-gray-500">Weight:</span>
              <span class="font-medium text-gray-700">{{ p.weight }}g</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-gray-500">Barcode:</span>
              <span class="font-mono text-gray-700">{{ p.barcode || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-2 mt-auto">
          <button
            @click="editProduct(p)"
            class="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition"
          >
            ✏️ Edit
          </button>
          <button
            @click="deleteProduct(p.id!)"
            class="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-lg transition"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
    
    <Pagination 
      v-if="totalPages > 0"
      :totalPages="totalPages"
      :currentPage="currentPage"
      :previousPage="previousPage"
      :nextPage="nextPage"
    />
  </div>
</template>

<script setup lang="ts">
import Pagination from "../Pagination.vue";
import type { Product } from "../../types/product";

const props = defineProps<{
  paginatedProducts: Product[];
  totalPages: number;
  currentPage: number;
  nextPage: () => void;
  previousPage: () => void;
  editProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
}>();
</script>
