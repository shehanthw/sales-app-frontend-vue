<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">Products</h1>
      <button
        @click="cancelForm()"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
      >
        {{ showForm ? "Cancel" : "+ New Product" }}
      </button>
    </div>

    <div v-if="showForm">
        <CreateProduct 
          :form="form"
          :handleClose="resetForm"
          :saveProduct="saveProduct"
          @close="showForm = false"
          :editingId="form.id"
        />
    </div>

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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../api/api';
import type { Product } from '../types/product';
import CreateProduct from '../components/products/CreateProduct.vue';
import ListProducts from '../components/products/ListProducts.vue';

const products = ref<Product[]>([]);
const showForm = ref(false);
const editingId = ref<number | null>(null);
const currentPage = ref(1);
const itemsPerPage = 5;

const form = ref<Product>({
  product_name: "",
  description: "",
  category: "",
  unit: "pcs", // Good default
  quantity: 0,
  weight: 0,
  barcode: "",
  buying_price: 0,
  selling_price: 0,
  is_active: true,
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
      product_name: form.value.product_name,
      description: form.value.description,
      category: form.value.category,
      unit: form.value.unit,
      quantity: form.value.quantity,
      weight: form.value.weight,
      barcode: form.value.barcode,
      buying_price: parseFloat(String(form.value.buying_price)) || 0,
      selling_price: parseFloat(String(form.value.selling_price)) || 0,
      is_active: form.value.is_active,
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
  form.value = { product_name: "", description: "", category: "", unit: "pcs", quantity: 0, weight: 0, barcode: "", buying_price: 0, selling_price: 0, is_active: true };
  editingId.value = null;
  showForm.value = false;
};

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const cancelForm = () => {
  resetForm();
  showForm.value = !showForm.value;
};

onMounted(fetchProducts);
</script>
