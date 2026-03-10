<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <div class="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Products</h1>
        <p class="text-gray-500 text-sm">Manage inventory, pricing, and stock levels.</p>
      </div>
      <button
        @click="openCreateForm"
        class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all"
      >
        {{ showForm ? "Close Form" : "+ New Product" }}
      </button>
    </div>

    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <div class="relative flex-grow max-w-md">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          🔍
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search name, category, or barcode..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
        />
      </div>
    </div>

    <div v-if="showForm" key="product-modal">
      <CreateProduct 
        :form="form"
        :editingId="editingId"
        :saveProduct="saveProduct"
        @close="cancelForm"
      />
    </div>

    <div v-if="paginatedProducts.length > 0">
      <ListProducts 
        :paginatedProducts="paginatedProducts"
        :totalPages="totalPages"
        :currentPage="currentPage"
        :nextPage="nextPage"
        :previousPage="previousPage"
        :editProduct="editProduct"
        :deleteProduct="deleteProduct"
      />
    </div>

    <div v-else class="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
      <p class="text-gray-500 text-lg">No products found matching "{{ searchQuery }}"</p>
      <button @click="searchQuery = ''" class="mt-2 text-blue-600 font-semibold hover:underline">Clear search</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import api from '../api/api';
import type { Product } from '../types/product';
import CreateProduct from '../components/products/CreateProduct.vue';
import ListProducts from '../components/products/ListProducts.vue';

// --- STATE ---
const products = ref<Product[]>([]);
const showForm = ref(false);
const editingId = ref<number | null>(null);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;

const initialFormState: Product = {
  product_name: "",
  description: "",
  category: "",
  unit: "pcs",
  quantity: 0,
  weight: 0,
  barcode: "",
  buying_price: 0,
  selling_price: 0,
  is_active: true,
};

const form = ref<Product>({ ...initialFormState });

// --- COMPUTED: Funnel logic (All -> Filtered -> Paginated) ---
const filteredProducts = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return products.value;

  return products.value.filter((p) => {
    return (
      p.product_name.toLowerCase().includes(query) ||
      (p.category && p.category.toLowerCase().includes(query)) ||
      (p.barcode && p.barcode.includes(query))
    );
  });
});

const totalPages = computed(() => 
  Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage))
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

// --- WATCHERS ---
watch(searchQuery, () => {
  currentPage.value = 1; // Reset to page 1 on search
});

// --- METHODS ---
const fetchProducts = async () => {
  try {
    const { data } = await api.get('/api/products');
    products.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('API Error:', err);
  }
};

const saveProduct = async () => {
  try {
    // Production Fix: Ensure numbers are actually numbers before sending to Python/FastAPI
    const payload = {
      ...form.value,
      buying_price: Number(form.value.buying_price),
      selling_price: Number(form.value.selling_price),
      quantity: Math.floor(Number(form.value.quantity)),
      weight: parseFloat(String(form.value.weight)) || 0
    };

    if (editingId.value) {
      await api.put(`/api/products/${editingId.value}`, payload);
    } else {
      await api.post('/api/products', payload);
    }

    await fetchProducts(); // Refresh list
    resetForm();           // Close and clear
  } catch (err) {
    console.error(err);
    alert('Failed to save. Check your connection or field values.');
  }
};

const editProduct = (p: Product) => {
  editingId.value = p.id || null;
  form.value = { ...p };
  showForm.value = true;
};

const deleteProduct = async (id: number) => {
  if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
    try {
      await api.delete(`/api/products/${id}`);
      await fetchProducts();
    } catch (err) {
      alert('Error deleting product.');
    }
  }
};

const openCreateForm = () => {
  resetForm();
  showForm.value = true;
};

const resetForm = () => {
  form.value = { ...initialFormState };
  editingId.value = null;
  showForm.value = false;
};

const cancelForm = () => {
  resetForm();
};

const previousPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

onMounted(fetchProducts);
</script>