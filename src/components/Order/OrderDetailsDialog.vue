<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
  >
    <div
      class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
    >
      <div class="p-6 border-b flex justify-between items-center bg-gray-50">
        <h3 class="text-xl font-bold text-gray-900">
          Order Details #{{ order.id }}
        </h3>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase">Customer</p>
            <p class="text-lg font-semibold">{{ customerName }}</p>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase">Status</p>
            <span
              class="inline-block mt-1 px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700"
            >
              {{ order.status }}
            </span>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p class="text-sm font-bold text-gray-500 mb-2">Internal Notes</p>
          <p class="text-gray-700 italic">
            {{ order.notes || "No notes available for this order." }}
          </p>
        </div>
      </div>

      <div class="p-6 border-t bg-gray-50 flex justify-end">
        <button
          @click="$emit('close')"
          class="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps(["order", "customers"]);
defineEmits(["close"]);

const customerName = computed(() => {
  const c = props.customers.find((c) => c.id === props.order.customer_id);
  return c ? c.name : "Unknown";
});
</script>
