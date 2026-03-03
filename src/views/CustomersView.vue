<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">Customers</h1>
      <button
        @click="cancelForm()"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
      >
        {{ showForm ? "Cancel" : "+ New Customer" }}
      </button>
    </div>

    <!-- Create customer form -->
    <div v-if="showForm">
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

    <!-- Customer List -->
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { Customer } from "../types/customer";
import { getAllCustomers, postCustomer, putCustomer, removeCustomer } from "../api/customers";
import CreateCustomer from "../components/customers/CreateCustomer.vue";
import ListCustomers from "../components/customers/ListCustomers.vue";

const customers = ref<Customer[]>([]);
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

const totalPages = computed(() => {
  return Math.ceil(customers.value.length / itemsPerPage);
});

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return customers.value.slice(start, end);
});

const fetchCustomers = async () => {
  try {
    const { data } = await getAllCustomers();
    customers.value = data;
    currentPage.value = 1;
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
    fetchCustomers();
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
  if (!id) return; // Safety check

  if (confirm("Delete this customer?")) {
    try {
      await removeCustomer(id); 
      await fetchCustomers(); 
    } catch (err) {
      console.error("Failed to delete customer:", err);
      alert("Could not delete customer. Please try again.");
    }
  }
};

const getLocation = () => {
  if (!navigator.geolocation) {
    locationError.value = true;
    locationMessage.value = "Geolocation is not supported by your browser";
    return;
  }

  gettingLocation.value = true;
  locationError.value = false;
  locationMessage.value = "";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      form.value.latitude = position.coords.latitude.toString();
      form.value.longitude = position.coords.longitude.toString();
      locationError.value = false;
      locationMessage.value = "Location captured successfully!";
      gettingLocation.value = false;
    },
    (error) => {
      locationError.value = true;
      gettingLocation.value = false;
      if (error.code === error.PERMISSION_DENIED) {
        locationMessage.value = "Location permission denied";
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        locationMessage.value = "Location information is unavailable";
      } else {
        locationMessage.value = "An error occurred while getting location";
      }
    },
  );
};

const resetForm = () => {
  form.value = {
    name: "",
    email: "",
    phone: "",
    nic: "",
    address: "",
    latitude: "",
    longitude: "",
  };
  editingId.value = null;
  locationMessage.value = "";
  locationError.value = false;
};

const openGoogleMaps = (customer: Customer) => {
  if (customer.latitude && customer.longitude) {
    const mapsUrl = `https://maps.google.com/?q=${customer.latitude},${customer.longitude}`;
    window.open(mapsUrl, "_blank");
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const cancelForm = () => {
  resetForm();
  showForm.value = !showForm.value;
};

onMounted(fetchCustomers);
</script>
