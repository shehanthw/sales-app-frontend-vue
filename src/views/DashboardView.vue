<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-600">Welcome back! Here's your sales overview.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Stats Cards -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium mb-2">Total Customers</h3>
        <p class="text-3xl font-bold text-blue-600">{{ customersCount ?? '—' }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium mb-2">Total Products</h3>
        <p class="text-3xl font-bold text-blue-600">{{ productsCount ?? '—' }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium mb-2">Active Orders</h3>
        <p class="text-3xl font-bold text-green-600">0</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium mb-2">Revenue</h3>
        <p class="text-3xl font-bold text-purple-600">$0</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api/api';

const customersCount = ref<number | null>(null);
const productsCount = ref<number | null>(null);

const fetchCustomerCount = async () => {
  try {
    const { data } = await api.get('/api/customers');
    customersCount.value = Array.isArray(data) ? data.length : (data?.length ?? 0);
  } catch (err) {
    console.error('Failed to fetch customer count', err);
    customersCount.value = 0;
  }
};

const fetchProductsCount = async () => {
  try {
    const { data } = await api.get('/api/products');
    productsCount.value = Array.isArray(data) ? data.length : (data?.length ?? 0);
  } catch (err) {
    console.error('Failed to fetch products count', err);
    productsCount.value = 0;
  }
};

onMounted(() => {
  fetchCustomerCount();
  fetchProductsCount();
});
</script>
