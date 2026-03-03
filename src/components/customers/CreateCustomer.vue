<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    @click.self="handleClose"
  >
    <div
      class="bg-white shadow-xl rounded-lg p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-800">
          {{ editingId ? "Edit" : "Create" }} Customer
        </h3>
        <button
          @click="handleClose"
          class="text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
      </div>

      <div class="space-y-4">
        <div id="fullName">
          <label for="name" class="block text-sm font-medium text-gray-700">
            Full Name: *
          </label>
          <input
            id="name"
            v-model="form.name"
            placeholder="Full Name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div id="email">
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            v-model="form.email"
            type="email"
            placeholder="Email Address"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div id="nic">
          <label for="nic" class="block text-sm font-medium text-gray-700">
            NIC:
          </label>
          <input
            v-model="form.nic"
            type="text"
            placeholder="NIC Number"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div id="phone">
          <label for="phone" class="block text-sm font-medium text-gray-700">
            Phone: *
          </label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="Phone Number"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div id="address">
          <label for="address" class="block text-sm font-medium text-gray-700">
            Address:
          </label>
          <textarea
          v-model="form.address"
          placeholder="Address"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        ></textarea>
        </div>


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
        </div>

        <div class="flex gap-3 pt-4">
          <button
            @click="handleClose"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
          >
            Cancel
          </button>
          <button
            @click="saveCustomer"
            class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Customer } from "../../types/customer";

const props = defineProps<{
  form: Customer;
  saveCustomer: () => Promise<void>;
  getLocation: () => void;
  gettingLocation: boolean;
  locationMessage?: string;
  locationError?: boolean;
  editingId?: number | null;
}>();

// Define the close event
const emit = defineEmits<{
  (e: "close"): void;
}>();

const handleClose = () => {
  emit("close");
};
</script>
