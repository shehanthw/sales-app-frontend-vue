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

    <div v-if="showForm" class="bg-white shadow rounded-lg p-6 mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        {{ editingId ? "Edit" : "Create" }} Customer
      </h3>
      <div class="space-y-4">
        <input
          v-model="form.name"
          placeholder="Full Name"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="Email Address"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <input
          v-model="form.phone"
          type="tel"
          placeholder="Phone Number"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <input
          v-model="form.address"
          type="textarea"
          placeholder="Address"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />

        <div class="border-t pt-4 mt-4">
          <button
            @click="getLocation"
            :disabled="gettingLocation"
            class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold rounded-lg transition"
          >
            {{
              gettingLocation
                ? "Getting Location..."
                : "📍 Get Current Location"
            }}
          </button>
          <div
            v-if="locationMessage"
            class="mt-2 text-sm"
            :class="locationError ? 'text-red-600' : 'text-green-600'"
          >
            {{ locationMessage }}
          </div>
          <div
            v-if="form.latitude && form.longitude"
            class="mt-2 text-sm text-gray-600"
          >
            <p>Latitude: {{ form.latitude }}</p>
            <p>Longitude: {{ form.longitude }}</p>
          </div>
        </div>

        <button
          @click="saveCustomer"
          class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
        >
          Save
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="c in paginatedCustomers"
        :key="c.id"
        class="bg-white shadow rounded-lg p-6 flex flex-col justify-between"
      >
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ c.name }}</h3>
          <p class="text-gray-600 text-sm">{{ c.email }}</p>
          <p class="text-gray-600 text-sm">{{ c.phone }}</p>
          <p v-if="c.address" class="text-gray-600 text-sm mt-2">
            {{ c.address }}
          </p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            @click="editCustomer(c)"
            class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition"
          >
            Edit
          </button>
          <button
            @click="deleteCustomer(c.id!)"
            class="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition"
          >
            Delete
          </button>
          <button
            v-if="c.latitude && c.longitude"
            @click="openGoogleMaps(c)"
            class="flex-1 px-3 py-2  hover:bg-green-700 text-green-700 hover:text-white border border-green-700 text-sm font-medium rounded transition"
          >
            Map
          </button>
        </div>
      </div>
    </div>

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
import { ref, onMounted, computed } from "vue";
import api from "../api/api";
import type { Customer } from "../types/customer";

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
    const { data } = await api.get("/api/customers");
    customers.value = data;
    currentPage.value = 1;
  } catch (err) {
    console.error("Failed to fetch customers");
  }
};

const saveCustomer = async () => {
  try {
    if (editingId.value) {
      await api.put(`/api/customers/${editingId.value}`, form.value);
    } else {
      await api.post("/api/customers", form.value);
    }
    resetForm();
    fetchCustomers();
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
  if (confirm("Delete this customer?")) {
    await api.delete(`/api/customers/${id}`);
    fetchCustomers();
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
