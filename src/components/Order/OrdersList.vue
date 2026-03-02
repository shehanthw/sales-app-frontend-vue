<script setup>
const props = defineProps({
  order: { type: Object, required: true },
  customers: { type: Array, required: true },
  // Removed the stray array that was causing the error
});

// Logic to find the customer object if they have coordinates
const getCustomerLocation = (id) => {
  const c = props.customers.find((c) => c.id === id);
  return c?.latitude && c?.longitude ? c : null;
};

const openMap = (id) => {
  const c = getCustomerLocation(id);
  if (c) {
    // Fixed the URL structure to standard Google Maps format
    const url = `https://www.google.com/maps?q=${c.latitude},${c.longitude}`;
    window.open(url, "_blank");
  }
};

const getCustomerName = (customerId) => {
  const customer = props.customers.find((c) => c.id === customerId);
  return customer ? customer.name : "Unknown Customer";
};

const statusClasses = (status) => {
  const s = status?.toLowerCase();
  if (s === "paid" || s === "completed")
    return "bg-green-100 text-green-700 border-green-200";
  if (s === "pending") return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};
</script>

<template>
  <div
    class="group bg-white border border-gray-200 rounded-xl p-4 transition-all hover:border-blue-300 hover:shadow-md"
  >
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div class="flex items-center gap-4 w-full sm:w-auto">
        <span class="text-gray-400 font-mono text-sm">#{{ order.id }}</span>

        <div class="flex-1">
          <div class="flex gap-5">
            <button
              v-if="getCustomerLocation(order.customer_id)"
              @click.stop="openMap(order.customer_id)"
              class="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="View on Map"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            <h4
              class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
            >
              {{ getCustomerName(order.customer_id) }}
            </h4>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span
              :class="[
                'text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider',
                statusClasses(order.status),
              ]"
            >
              {{ order.status }}
            </span>
            <span
              v-if="order.notes"
              class="text-xs text-gray-400 truncate max-w-[150px] sm:max-w-xs italic"
            >
              "{{ order.notes }}"
            </span>
          </div>
        </div>
      </div>

      <div
        class="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100"
      >
        <span class="text-xs text-gray-400 font-medium uppercase sm:mb-1"
          >Total Amount</span
        >
        <div class="flex items-baseline gap-1">
          <span class="text-sm font-semibold text-gray-500">Rs.</span>
          <span class="text-2xl font-black text-gray-900 tracking-tight">
            {{
              order.total?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || "0.00"
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
