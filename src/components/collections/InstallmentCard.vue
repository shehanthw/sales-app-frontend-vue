<template>
  <div
    v-for="installment in installments"
    class="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative gap-3"
  >
    <div class="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>

    <div class="p-5">
      <div class="flex justify-between items-start mb-4">
        <div>
          <p
            class="text-[10px] uppercase text-gray-400 font-black tracking-widest"
          >
            Customer Name
          </p>
          <p class="font-mono text-xs text-gray-600">
            {{ customerNames[installment.order_id] || "Loading..." }}
          </p>
          <button @click="handleViewOrder(installment.order_id)" class="mt-2 text-xs px-4 py-1 border rounded-md border-yellow-300 text-yellow-700 hover:bg-yellow-50">View Order</button>
        </div>
        <span
          class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase border border-blue-100"
          :class="{
            'text-green-700 border-green-blue-100 bg-green-50':
              installment.status === 'paid',
          }"
        >
          {{ installment.status }}
        </span>
      </div>

      <div class="mb-5">
        <p class="text-[10px] uppercase text-gray-400 font-black mb-1">
          Amount Due
        </p>
        <h2 class="text-3xl font-black text-gray-900 leading-none">
          {{ installment.amount }}
          <span class="text-sm font-medium text-gray-500 ml-1">LKR</span>
        </h2>
      </div>

      <div class="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-3 mb-4">
        <div>
          <p class="text-[9px] uppercase text-gray-500 font-bold">Due Date</p>
          <p class="text-sm font-bold text-gray-700">
            {{ installment.due_date }}
          </p>
          <p class="text-lg font-bold text-red-400">
            {{ getDateStatus(installment.due_date) }}
          </p>
        </div>

        <div class="text-right">
          <p class="text-[9px] uppercase text-gray-500 font-bold">Paid At</p>
          <p class="text-sm font-bold text-yell-400 italic">
            {{
              installment.paid_at
                ? installment.paid_at.split("T")[0]
                : "Not Paid"
            }}
          </p>
        </div>
      </div>

      <div
        class="flex items-center justify-between pt-3 border-t border-gray-100"
      >
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p class="text-[9px] uppercase text-gray-400 font-black">
              Collector
            </p>
            <p class="text-xs font-bold text-gray-600">
              {{ collectorNames[installment.order_id] || "Loading..." }}
            </p>
          </div>
        </div>

        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-transform"
          :class="{
            'bg-gray-600 cursor-not-allowed opacity-50':
              installment.status === 'paid',
          }"
          :disabled="installment.status === 'paid'"
          @click="handleCollectInstallment(installment.id)"
        >
          Collect Now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { getUserById } from '../../api/auth';
import { collectInstallmentById, getOrderById } from '../../api/orders';
import type { Installment } from '../../types/collection';
import { getCustomerById } from '../../api/customers';
import router from '../../router';


const props = defineProps<{
  installments: Installment[]
  handleFilters: () => Promise<void>
}>();

const collectorNames = ref<Record<string, string>>({});
const customerNames = ref<Record<string, string>>({});


const loadCollectorNames = async () => {
  for (const inst of props.installments) {
    try {
      // Avoid fetching the same order twice
      if (!collectorNames.value[inst.order_id]) {
        let { data } = await getOrderById(inst.order_id);
        const seller_id = data[0].seller_id;
        const user = await getUserById(seller_id);
        collectorNames.value[inst.order_id] = user.name;
      }
    } catch (e) {
      collectorNames.value[inst.order_id] = "Error loading";
    }
  }
};

const loadCustomerNames = async () => {
  for (const inst of props.installments) {
    try {
      // Avoid fetching the same order twice
      if (!customerNames.value[inst.order_id]) {
        let { data } = await getOrderById(inst.order_id);
        const seller_id = data[0].customer_id;
        const customer = await getCustomerById(seller_id);
        customerNames.value[inst.order_id] = customer.data.name;
      }
    } catch (e) {
      customerNames.value[inst.order_id] = "Error loading";
    }
  }
};

watch(
  () => props.installments,
  () => {
    loadCollectorNames();
    loadCustomerNames();
  },
  { immediate: true }
);

const getDateStatus = (dueDate: string) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const date = new Date(dueDate)
  date.setHours(0, 0, 0, 0)

  if (date.toDateString() === today.toDateString()) {
    return "Collect Today"
  } else if (date < today) {
    return "Overdue"
  }
  return ""
}

const handleCollectInstallment = async (id: string) => {
  try {

    if(confirm("Are you sure to collect this payment ?")) {
      await collectInstallmentById(id);
      alert("Payment collected successfully!");
      props.handleFilters();
    }

  } catch (error: any) {
    const message = error.response?.data?.detail || "Something went wrong";
    console.log(error + message)
    alert(message);
  }
}

const handleViewOrder = async (id: string) => {
  let { data } = await getOrderById(id);
   router.push({
    name: 'Orders',
    query: {
      ...(id && { order: data[0].id }),
    },
  });
}
</script>
