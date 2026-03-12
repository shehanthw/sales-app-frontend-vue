<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">Daily Collections</h1>
    </div>

    <!-- Filters Section -->
    <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Date Range Filter -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700"
          >Date Range</label
        >
        <div class="grid md:flex gap-2 items-center">
          <input
            v-model="startDate"
            type="date"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
          />
          <span class="text-gray-500 text-center">to</span>
          <input
            v-model="endDate"
            type="date"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
          />
        </div>
      </div>

      <!-- Collector Filter -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700"
          >Filter by Collector</label
        >
        <Dropdown
          v-model="selectedCollector"
          :options="collectors"
          optionLabel="name"
          optionValue="id"
          placeholder="All Collectors"
          class="w-full"
        />
      </div>

      <!-- Status Filter -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700"
          >Installment Status</label
        >
        <select
          v-model="selectedStatus"
          class="w-full px-4 py-2.5 border bg-white border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
        >
          <option value="">All Statuses</option>
          <option value="paid">Completed</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
    </div>

    <div class="mb-5 flex justify-end">
      <label for="">Total: {{ filteredInstallments.length }}</label>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <InstallmentCard
        :installments="paginatedInstallments"
        :handleFilters="handleFilters"
      />
    </div>

    <!-- No installments label -->
    <div
      class="text-center text-xl font-medium"
      v-if="filteredInstallments.length < 1"
    >
      No installments found!
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="mt-8 flex items-center justify-center gap-2 mb-5"
    >
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-600 disabled:bg-gray-300 text-white rounded-lg hover:bg-gray-700 transition"
      >
        ← Previous
      </button>
      <span class="text-gray-700"
        >Page {{ currentPage }} of {{ totalPages }}</span
      >
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-600 disabled:bg-gray-300 text-white rounded-lg hover:bg-gray-700 transition"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { getAllUsers } from "../api/auth";
import Dropdown from "../components/Dropdown.vue";
import {
  getInstallmentsByCollectorAndDueDate,
  getInstallmentsByDueDate,
  getOverdueInstallments,
  getAllInstallments,
} from "../api/orders";
import InstallmentCard from "../components/collections/InstallmentCard.vue";
import type { Installment } from "../types/collection";

// State
const startDate = ref("");
const endDate = ref("");
const selectedCollector = ref("");
const collectors = ref([]);
const selectedStatus = ref("");
const installments = ref<Installment[]>([]);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 6; // Slightly different from orders page for variety

// Computed
const filteredInstallments = computed(() => {
  // Since filtering is done on the backend, we just return all installments
  // If you want to add client-side filtering in the future, you can modify this
  return installments.value;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredInstallments.value.length / itemsPerPage))
);

const paginatedInstallments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredInstallments.value.slice(start, start + itemsPerPage);
});

// Methods
const getCollectors = async () => {
  const users = await getAllUsers();
  collectors.value = users;
};

const handleFilters = async () => {
  // Reset to first page when filters change
  currentPage.value = 1;

  // Build filter parameters
  const hasDateRange = startDate.value && endDate.value;
  const hasStatus = selectedStatus.value;
  const hasCollector = selectedCollector.value;

  try {
    let response;

    if (hasDateRange && hasStatus && hasCollector) {
      response = await getInstallmentsByCollectorAndDueDate(
        startDate.value,
        endDate.value,
        selectedStatus.value.toLowerCase(),
        selectedCollector.value,
      );
    } else if (hasDateRange && hasStatus) {
      response = await getInstallmentsByDueDate(
        startDate.value,
        endDate.value,
        selectedStatus.value.toLowerCase()
      );
    } else if (!hasDateRange && !hasStatus && !hasCollector) {
      // If no filters, you might want to show all installments or default to overdue
      response = await getOverdueInstallments();
    } else {
      // Handle other filter combinations or fetch all
      response = await getAllInstallments(); // You'll need to create this API function
    }

    installments.value = response.data;
  } catch (error) {
    console.error("Error fetching installments:", error);
    installments.value = [];
  }
};

// Pagination methods
const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Watchers
watch([startDate, endDate, selectedStatus, selectedCollector], () => {
  handleFilters();
});

// Lifecycle
onMounted(() => {
  getCollectors();
  handleFilters();
});
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>