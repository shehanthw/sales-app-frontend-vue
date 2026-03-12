<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { getCollectionsByOrderIdOrSellerID } from "../../api/orders";
import {
  calculateBalanceAmount,
  calculateTotalPaidAmount,
} from "../../utils/order-calculations";

const props = defineProps({
  order: { type: Object, required: true },
  customers: { type: Array, default: () => [] },
});

const emit = defineEmits(["edit", "view"]);
const totalPaid = ref(0);
const remainingBalance = ref(0);

const customer = computed(() =>
  props.customers.find((c) => c.id === props.order.customer_id),
);

// Calculation for Total Paid
const calculateTotalPaid = async () => {
  const downPayment = parseFloat(props.order.down_payment) || 0;
  const collections = await getCollectionsByOrderIdOrSellerID(props.order.id);

  let totalCollectedAmount = 0;

  for (const collection of collections.data) {
    if (collection.status === "paid") {
      totalCollectedAmount += collection.amount;
    }
  }

  totalPaid.value = calculateTotalPaidAmount(downPayment, totalCollectedAmount);
};

// Remaining Balance
const calculateRemainingBalance = () => {
  remainingBalance.value = calculateBalanceAmount(
    props.order.total_amount,
    totalPaid.value,
  );
};

onMounted(async () => {
  await calculateTotalPaid();
  calculateRemainingBalance();
});

// Watch totalPaid changes
watch(totalPaid, calculateRemainingBalance);

const hasLocation = computed(
  () => customer.value?.latitude && customer.value?.longitude,
);

const openMap = () => {
  if (hasLocation.value) {
    const url = `https://www.google.com/maps/search/?api=1&query=${customer.value.latitude},${customer.value.longitude}`;
    window.open(url, "_blank");
  }
};

const statusClasses = (status) => {
  const s = status?.toLowerCase() || "pending";
  const base =
    "text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wide ";

  if (s === "paid" || s === "completed" || s === "active")
    return base + "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "pending")
    return base + "bg-amber-50 text-amber-700 border-amber-200";
  return base + "bg-slate-50 text-slate-700 border-slate-200";
};
</script>

<template>
  <div
    @click="$emit('view', order)"
    class="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-lg hover:border-blue-200 cursor-pointer relative overflow-hidden"
  >
    <div
      class="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
    ></div>

    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-start">
        <div class="flex gap-3 items-center">
          <div
            class="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-500 font-mono"
          >
            #{{ order.id.toString().slice(-6) }}
          </div>
          <span :class="statusClasses(order.status)">
            {{ order.status }}
          </span>
        </div>

        <div class="flex gap-2">
          <button
            v-if="hasLocation"
            @click.stop="openMap"
            class="p-2 text-rose-500 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition-all"
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

          <button
            @click.stop="$emit('edit', order.id)"
            class="p-2 text-blue-600 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-100 transition-all"
            title="Edit Order"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <div class="flex gap-4">
            <h4
              class="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors"
            >
              {{ customer?.name || "Unknown Customer" }}
            </h4>
          </div>
          <p
            v-if="order.notes"
            class="text-sm text-slate-400 italic truncate max-w-xs"
          >
            {{ order?.created_at.split("T")[0] }}
          </p>
        </div>

        <div
          class="grid grid-cols-3 gap-2 sm:gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100"
        >
          <div class="flex flex-col">
            <span
              class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter"
              >Total</span
            >
            <span class="text-xs sm:text-sm font-bold text-slate-700"
              >Rs.{{ order.total_amount?.toLocaleString() }}</span
            >
          </div>
          <div class="flex flex-col border-x border-slate-200 px-2 sm:px-4">
            <span
              class="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter"
              >Paid</span
            >
            <span class="text-xs sm:text-sm font-bold text-emerald-600"
              >Rs.{{ totalPaid }}</span
            >
          </div>
          <div class="flex flex-col pl-1">
            <span
              class="text-[9px] font-bold text-rose-500 uppercase tracking-tighter"
              >Balance</span
            >
            <span
              :class="{
                'text-xs sm:text-sm font-bold text-rose-600':
                  order.status !== 'completed',
                  'text-xl sm:text-xl font-bold text-green-600':
                  order.status === 'completed',
              }"
            >
              {{
                order.status === "completed"
                  ? "Paid"
                  : `Rs. ${remainingBalance}`
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
