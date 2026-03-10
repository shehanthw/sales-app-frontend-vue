<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <div class="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Customers</h1>
        <p class="text-gray-500 text-sm">Manage your client directory and locations.</p>
      </div>
      <button
        @click="cancelForm()"
        class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all"
      >
        {{ showForm ? "Cancel" : "+ New Customer" }}
      </button>
    </div>

    <div class="mb-6">
      <div class="relative max-w-md">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          🔍
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, phone, or NIC..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
        />
      </div>
    </div>

    <div v-if="showForm" key="customer-modal">
      <CreateCustomer
        :form="form"
        :customers="customers"
        :getLocation="getLocation"
        :gettingLocation="gettingLocation"
        :locationMessage="locationMessage"
        :locationError="locationError"
        :saveCustomer="saveCustomer"
        @close="showForm = false"
        :editingId="form.id"
      />
    </div>

    <div v-if="filteredCustomers.length > 0">
      <ListCustomers
        :paginatedCustomers="paginatedCustomers"
        :totalPages="totalPages"
        :currentPage="currentPage"
        :editCustomer="editCustomer"
        :deleteCustomer="deleteCustomer"
        :openGoogleMaps="openGoogleMaps"
        :previousPage="previousPage"
        :nextPage="nextPage"
      />
    </div>

    <div v-else class="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
      <p class="text-gray-500 text-lg">No customers found matching "{{ searchQuery }}"</p>
      <button @click="searchQuery = ''" class="mt-2 text-blue-600 font-semibold hover:underline">Clear search</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import type { Customer } from "../types/customer";
import { getAllCustomers, postCustomer, putCustomer, removeCustomer } from "../api/customers";
import CreateCustomer from "../components/customers/CreateCustomer.vue";
import ListCustomers from "../components/customers/ListCustomers.vue";

// --- STATE ---
const customers = ref<Customer[]>([]);
const searchQuery = ref("");
const showForm = ref(false);
const editingId = ref<number | null>(null); 
const gettingLocation = ref(false);
const locationMessage = ref<string>("");
const locationError = ref(false);
const currentPage = ref(1);
const itemsPerPage = 5;

const form = ref<Customer>({
  name: "",
  email: "",
  phone: "",
  nic: "",
  address: "",
  latitude: "",
  longitude: "",
});

// --- COMPUTED (The Funnel) ---

// 1. Filter original list by search query
const filteredCustomers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return customers.value;

  return customers.value.filter((c) => {
    return (
      c.name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      (c.nic && c.nic.toLowerCase().includes(query))
    );
  });
});

// 2. Calculate pages based on filtered results
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredCustomers.value.length / itemsPerPage));
});

// 3. Slice filtered results for pagination
const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredCustomers.value.slice(start, start + itemsPerPage);
});

// --- WATCHERS ---
watch(searchQuery, () => {
  currentPage.value = 1; // Reset to page 1 whenever user types
});

// --- METHODS ---
const fetchCustomers = async () => {
  try {
    const { data } = await getAllCustomers();
    customers.value = data;
  } catch (err) {
    console.error("Failed to fetch customers");
  }
};

const saveCustomer = async () => {
  try {
    if (editingId.value) {
      await putCustomer(editingId.value, form.value);
    } else {
      await postCustomer(form.value);
    }
    resetForm();
    await fetchCustomers();
    showForm.value = false;
  } catch (err) {
    alert("Error saving customer");
  }
};

const editCustomer = (customer: Customer) => {
  editingId.value = customer.id!;
  form.value = { ...customer };
  showForm.value = true;
};

const deleteCustomer = async (id: number) => {
  if (!id) return;
  if (confirm("Are you sure you want to delete this customer?")) {
    try {
      await removeCustomer(id); 
      await fetchCustomers(); 
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }
};

const getLocation = () => {
  if (!navigator.geolocation) {
    locationError.value = true;
    locationMessage.value = "Geolocation not supported";
    return;
  }
  gettingLocation.value = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      form.value.latitude = position.coords.latitude.toString();
      form.value.longitude = position.coords.longitude.toString();
      locationMessage.value = "Location captured!";
      gettingLocation.value = false;
    },
    () => {
      locationError.value = true;
      gettingLocation.value = false;
      locationMessage.value = "Could not get location";
    }
  );
};

const resetForm = () => {
  form.value = { name: "", email: "", phone: "", nic: "", address: "", latitude: "", longitude: "" };
  editingId.value = null;
  locationMessage.value = "";
  locationError.value = false;
};

const openGoogleMaps = (customer: Customer) => {
  if (customer.latitude && customer.longitude) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${customer.latitude},${customer.longitude}`;
    window.open(mapsUrl, "_blank");
  }
};

const previousPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const cancelForm = () => { resetForm(); showForm.value = !showForm.value; };

onMounted(fetchCustomers);
</script>