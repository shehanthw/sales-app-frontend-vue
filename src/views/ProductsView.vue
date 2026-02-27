<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">Products</h1>
      <button @click="showForm = !showForm" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
        {{ showForm ? 'Cancel' : '+ New Product' }}
      </button>
    </div>

    <div v-if="showForm" class="bg-white shadow rounded-lg p-6 mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ editingId ? 'Edit' : 'Create' }} Product</h3>
      <div class="space-y-4">
        <input v-model="form.name" placeholder="Product name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        <textarea v-model="form.description" placeholder="Description" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input v-model.number="form.buying_price" type="number" step="0.01" placeholder="Buying price" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <input v-model.number="form.selling_price" type="number" step="0.01" placeholder="Selling price" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input v-model.number="form.weight" type="number" placeholder="Weight (g)" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <input v-model.number="form.quantity" type="number" placeholder="Quantity" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <button @click="saveProduct" class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">Save</button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="p in paginatedProducts" :key="p.id" class="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ p.name }}</h3>
          <p class="text-gray-600 text-sm">{{ p.description }}</p>
        </div>
        <div class="text-sm text-gray-700 mb-4">
          <p>Buy: <span class="font-medium">{{ p.buying_price }}</span></p>
          <p>Sell: <span class="font-medium">{{ p.selling_price }}</span></p>
          <p>Weight: <span class="font-medium">{{ p.weight }} g</span></p>
          <p>Qty: <span class="font-medium">{{ p.quantity }}</span></p>
        </div>
        <div class="flex gap-2">
          <button @click="editProduct(p)" class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition">Edit</button>
          <button @click="deleteProduct(p.id!)" class="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition">Delete</button>
        </div>
      </div>
    </div>

    <!-- <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
      <button @click="previousPage" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition">← Previous</button>
      <span class="text-gray-700 font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition">Next →</button>
    </div> -->

    <div v-if="totalPages > 1" class="mt-8 flex lg:justify-end justify-center items-center mb-4 w-full">
      <div class="flex items-center gap-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition"
        >
          ← Previous
        </button>
        <span class="text-gray-700 font-medium"
          >Page {{ currentPage }} of {{ totalPages }}</span
        >
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../api/api';
import type { Product } from '../types/product';

const products = ref<Product[]>([]);
const showForm = ref(false);
const editingId = ref<number | null>(null);
const currentPage = ref(1);
const itemsPerPage = 5;

const form = ref<Product>({
  name: '',
  description: '',
  buying_price: 0,
  selling_price: 0,
  weight: 0,
  quantity: 0,
});

const totalPages = computed(() => Math.max(1, Math.ceil(products.value.length / itemsPerPage)));

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return products.value.slice(start, start + itemsPerPage);
});

const fetchProducts = async () => {
  try {
    const { data } = await api.get('/api/products');
    products.value = Array.isArray(data) ? data : [];
    currentPage.value = 1;
  } catch (err) {
    console.error('Failed to fetch products', err);
  }
};

const saveProduct = async () => {
  try {
    const payload = {
      name: form.value.name,
      description: form.value.description,
      buying_price: parseFloat(String(form.value.buying_price)) || 0,
      selling_price: parseFloat(String(form.value.selling_price)) || 0,
      weight: parseInt(String(form.value.weight)) || 0,
      quantity: parseInt(String(form.value.quantity)) || 0,
    };

    if (editingId.value) {
      await api.put(`/api/products/${editingId.value}`, payload);
    } else {
      await api.post('/api/products', payload);
    }

    resetForm();
    fetchProducts();
  } catch (err) {
    alert('Error saving product');
  }
};

const editProduct = (p: Product) => {
  editingId.value = p.id!;
  form.value = { ...p } as Product;
  showForm.value = true;
};

const deleteProduct = async (id: number) => {
  if (confirm('Delete this product?')) {
    await api.delete(`/api/products/${id}`);
    fetchProducts();
  }
};

const resetForm = () => {
  form.value = { name: '', description: '', buying_price: 0, selling_price: 0, weight: 0, quantity: 0 };
  editingId.value = null;
  showForm.value = false;
};

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

onMounted(fetchProducts);
</script>
