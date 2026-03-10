<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">Orders</h1>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
      >
        + New Order
      </button>
    </div>

    <!-- Search order -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <!-- <div class="relative flex-grow max-w-md">
        <span
          class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"
        >
          🔍
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by status.."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
        />
      </div> -->

      <Dropdown
        v-model="searchedCustomer"
        :options="customers"
        optionLabel="name"
        optionValue="id"
        :disabled="false"
        class="w-full"
        placeholder="Search by customer"
      />

      <!-- Status list dropdown -->
      <div>
        <Dropdown
          v-model="searchedStatus"
          :options="statusList"
          optionLabel="name"
          optionValue="id"
          :disabled="false"
          class="w-full"
          placeholder="Search by status"
        />
      </div>
    </div>

    <!-- Order create form -->
    <OrderForm
      :show="showOrderModal"
      :customers="customers"
      :products="products"
      :form="orderForm"
      @save="handleSaveOrder"
      @cancel="cancelForm"
    />

    <!-- Order edit form -->
    <EditForm
      :show="showEditOrderModal"
      :customers="customers"
      :products="products"
      :form="orderForm"
      @save="handleSaveOrder"
      @cancel="cancelForm"
      :cancel="cancelForm"
      :fetchData="fetchData"
    />

    <div class="grid grid-cols-1 gap-4 p-4">
      <OrdersList
        v-for="o in paginatedOrders"
        :key="o.id"
        :order="o"
        :customers="customers"
        @edit="openEditModal"
      />

      <div v-if="paginatedOrders.length < 1" class="w-full text-center text-xl">
        No Orders Found!
      </div>

      <OrderDetailsDialog
        v-if="isDialogOpen"
        :order="selectedOrder"
        :customers="customers"
        @close="isDialogOpen = false"
      />
    </div>

    <div
      v-if="totalPages > 1"
      class="mt-8 flex items-center justify-center gap-2 mb-5"
    >
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-600 disabled:bg-gray-300 text-white rounded-lg"
      >
        ← Previous
      </button>
      <span class="text-gray-700"
        >Page {{ currentPage }} of {{ totalPages }}</span
      >
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-600 disabled:bg-gray-300 text-white rounded-lg"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import api from "../api/api";
import OrderForm from "../components/Order/CreateForm.vue";
import EditForm from "../components/Order/EditForm.vue";
import OrdersList from "../components/Order/OrdersList.vue";
import OrderDetailsDialog from "../components/Order/OrderDetailsDialog.vue";
import { getAllCustomers } from "../api/customers";
import Dropdown from "../components/Dropdown.vue";
import {
  getOrderById,
  getProductsByOrderId,
  postOrder,
  getCollectionsByOrderIdOrSellerID,
} from "../api/orders";

// --- State Management ---
const orders = ref<any[]>([]);
const customers = ref<any[]>([]);
const products = ref<any[]>([]);
const showOrderModal = ref(false);
const showEditOrderModal = ref(false);
const isDialogOpen = ref(false);
const selectedOrder = ref(null);
const currentPage = ref(1);
const itemsPerPage = 5;
const searchQuery = ref("");
const searchedCustomer = ref("");
const searchedStatus = ref("");
const statusList = ref([
  { id: 1, name: "pending" },
  { id: 2, name: "completed" },
  { id: 3, name: "closed" },
]);

// Unified reactive form state
const orderForm = reactive({
  customer_id: null,
  number_of_installments: 1,
  down_payment: 0,
  notes: "",
  items: [] as any[],
  interval_days: 30,
  collections: [] as any[],
});

// --- Logic ---
const fetchData = async () => {
  try {
    const [cRes, pRes, oRes] = await Promise.all([
      getAllCustomers(),
      api.get("/api/products/"),
      api.get("/api/orders/"),
    ]);
    customers.value = cRes.data;
    products.value = pRes.data;
    orders.value = oRes.data;
  } catch (err) {
    console.error("Fetch failed", err);
  }
};

const openCreateModal = () => {
  resetForm();
  showOrderModal.value = true;
};

const openEditModal = async (id: any) => {
  resetForm();

  try {
    const response = await getOrderById(id);
    const orderData = response.data[0];
    const items = await getProductsByOrderId(orderData.id);
    const collections = await getCollectionsByOrderIdOrSellerID(orderData.id);

    orderForm.customer_id = orderData.customer_id;
    orderForm.number_of_installments = orderData.number_of_installments;
    orderForm.down_payment = orderData.down_payment;
    orderForm.notes = orderData.notes;
    orderForm.interval_days = orderData.interval_days || 30;
    orderForm.items = items.data;
    orderForm.collections = collections.data;
    showEditOrderModal.value = true;
  } catch (err) {
    console.error("Failed to fetch order details", err);
  }
};

const handleSaveOrder = async (payload: any) => {
  const { collections, id, ...dataWithoutCollection } = payload;
  await postOrder(dataWithoutCollection)
    .then(() => {
      fetchData();
      cancelForm();
      alert("Order created successfuly!");
    })
    .catch((err) => {
      const message = err.response?.data?.detail || "Something went wrong";
      alert(message);
    });
};

const resetForm = () => {
  Object.assign(orderForm, {
    id: null,
    customer_id: null,
    number_of_installments: 1,
    down_payment: 0,
    notes: "",
    items: [],
    interval_days: 30,
    collections: "",
  });
};

const cancelForm = () => {
  showOrderModal.value = false;
  showEditOrderModal.value = false;
  resetForm();
};

const filteredOrders = computed(() => {
  let result = orders.value;

  // 1. Filter by Search Query (Status or Date)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter((o) => {
      const status = o.status ? o.status.toLowerCase() : "";
      const date = o.created_at ? o.created_at : "";
      return status.includes(query) || date.includes(query);
    });
  }

  // 2. Filter by Customer (Additive)
  if (searchedCustomer.value) {
    result = result.filter((o) => {
      return String(o.customer_id) === String(searchedCustomer.value);
    });
  }

  // 3. Filter by Status list (Additive)
  if (searchedStatus.value) {
    const selectedStatus = statusList.value.find(
      (s) => String(s.id) === String(searchedStatus.value),
    );
    result = result.filter((o) => {
      return String(o.status) === String(selectedStatus?.name);
    });
  }

  return result;
});

// --- Pagination ---
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredOrders.value.length / itemsPerPage)),
);
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredOrders.value.slice(start, start + itemsPerPage);
});

watch(searchQuery, () => {
  currentPage.value = 1;
});

watch(searchedCustomer, () => {
  currentPage.value = 1;
});

watch(searchedStatus, () => {
  currentPage.value = 1;
});

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

onMounted(fetchData);
</script>
