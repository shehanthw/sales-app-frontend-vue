<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="c in paginatedCustomers"
        :key="c.id"
        class="group bg-white border border-gray-200 shadow-sm hover:shadow-md rounded-xl p-5 transition-all duration-200 flex flex-col"
      >
        <div class="flex items-start gap-4 mb-4">
          <div class="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
            {{ c.name.charAt(0).toUpperCase() }}
          </div>
          <div class="overflow-hidden">
            <h3 class="text-lg font-bold text-gray-900 truncate" :title="c.name">
              {{ c.name }}
            </h3>
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer ID: #{{ c.id }}</span>
          </div>
        </div>

        <div class="space-y-2 mb-5 flex-grow">
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <span class="text-gray-400 text-base">📧</span>
            <a :href="`mailto:${c.email}`" class="hover:text-blue-600 truncate">{{ c.email || 'No email provided' }}</a>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <span class="text-gray-400 text-base">📞</span>
            <a :href="`tel:${c.phone}`" class="hover:text-blue-600">{{ c.phone || 'No phone' }}</a>
          </div>
          <div v-if="c.address" class="flex items-start gap-3 text-sm text-gray-600 mt-3 pt-3 border-t border-gray-50">
            <span class="text-gray-400 text-base mt-0.5">📍</span>
            <p class="line-clamp-2 italic">{{ c.address }}</p>
          </div>
        </div>

        <div class="flex gap-2 pt-4 border-t border-gray-100">
          <button
            @click="editCustomer(c)"
            class="flex-1 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition"
          >
            Edit
          </button>
          
          <button
            v-if="c.latitude && c.longitude"
            @click="openGoogleMaps(c)"
            class="flex-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1"
          >
            Map
          </button>

          <button
            @click="deleteCustomer(c.id!)"
            class="p-2 bg-white border border-red-100 hover:bg-red-50 text-red-500 rounded-lg transition"
            title="Delete Customer"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="mt-10 flex justify-center lg:justify-end items-center gap-4">
      <button 
        @click="previousPage" 
        :disabled="currentPage === 1"
        class="p-2 rounded-full border border-gray-300 disabled:opacity-30 hover:bg-gray-100 transition"
      >
        ←
      </button>
      <div class="px-4 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-tighter">
        Page {{ currentPage }} / {{ totalPages }}
      </div>
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="p-2 rounded-full border border-gray-300 disabled:opacity-30 hover:bg-gray-100 transition"
      >
        →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Customer } from '../../types/customer';

const props = defineProps<{
    paginatedCustomers: Customer[];
    totalPages: number;
    currentPage: number;
    editCustomer: (customer: Customer) => void;
    deleteCustomer: (id: number) => void;
    openGoogleMaps: (customer: Customer) => void;
    previousPage: () => void;
    nextPage: () => void;
}>();
</script>
