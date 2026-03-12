<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex justify-center sm:items-center bg-black/50 sm:p-4 backdrop-blur-sm text-left"
  >
    <div
      class="bg-white shadow-2xl sm:rounded-2xl rounded-none w-full max-w-2xl overflow-hidden flex flex-col h-full"
    >
      <div
        class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10"
      >
        <h3 class="text-xl font-bold text-gray-900">Collect installments</h3>
        <button
          @click="$emit('cancel')"
          class="text-gray-400 hover:text-gray-600"
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

      <div class="p-6 overflow-y-auto space-y-6">
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1"
            >Collector</label
          >
          <Dropdown
            v-model="form.seller_id"
            :options="sellers"
            optionLabel="name"
            optionValue="id"
            class="w-full"
          />
          <div class="flex justify-end">
            <button
              @click="handleUpdateCollector"
              class="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors mt-2"
            >
              Update
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1"
            >Customer</label
          >
          <Dropdown
            v-model="form.customer_id"
            :options="customers"
            optionLabel="name"
            optionValue="id"
            :disabled="true"
            class="w-full"
          />
        </div>

        <!-- Products selection -->
        <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div class="flex justify-between items-center mb-4">
            <h4 class="font-bold text-gray-800 text-sm">Order Items</h4>
            <button
              @click="addItem"
              :disabled="true"
              class="text-gray-400 cursor-not-allowed"
            >
              + Add Item
            </button>
          </div>
          <div
            v-for="(item, idx) in form.items"
            :key="idx"
            class="bg-white p-3 mb-2 rounded-xl border border-gray-200 grid grid-cols-12 gap-3 items-center"
          >
            <div class="col-span-6">
              <Dropdown
                v-model="item.product_id"
                :options="products"
                optionLabel="product_name"
                optionValue="id"
                @change="onProductChange(item)"
                :disabled="true"
              />
            </div>
            <div class="col-span-3">
              <input
                v-model.number="item.quantity"
                type="number"
                min="1"
                class="w-full px-3 py-2 border rounded-lg text-sm"
                :disabled="true"
              />
            </div>
            <div class="col-span-3 text-right text-sm font-bold text-blue-600">
              Rs.
              {{
                (
                  Number(item.unit_price || 0) * Number(item.quantity || 0)
                ).toLocaleString()
              }}
            </div>
          </div>
        </div>

        <!-- Installments / Collections -->
        <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div class="flex justify-between items-center mb-4">
            <h4 class="font-bold text-gray-800 text-sm flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Installments / Collections
            </h4>
            <span
              class="text-[10px] px-2 py-1 bg-gray-200 text-gray-600 rounded-full uppercase font-bold tracking-wider"
            >
              {{ form.collections?.length || 0 }} Total
            </span>
          </div>

          <div class="space-y-3">
            <div
              v-for="(item, idx) in form.collections"
              :key="idx"
              class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all hover:border-blue-200"
            >
              <div
                class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div
                  class="flex items-center justify-between sm:justify-start gap-4"
                >
                  <div class="flex flex-col">
                    <span
                      class="text-[10px] text-gray-400 font-bold uppercase tracking-tight"
                      >Amount</span
                    >
                    <span class="text-sm font-black text-gray-900"
                      >Rs. {{ Number(item.amount).toLocaleString() }}</span
                    >
                  </div>

                  <div class="flex flex-col">
                    <span
                      class="text-[10px] text-gray-400 font-bold uppercase tracking-tight"
                      >Status</span
                    >
                    <span
                      :class="{
                        'text-emerald-600 bg-emerald-50':
                          item.status === 'Paid',
                        'text-amber-600 bg-amber-50': item.status === 'Pending',
                        'text-rose-600 bg-rose-50': item.status === 'Overdue',
                      }"
                      class="text-[10px] px-2 py-0.5 rounded-md font-bold text-center"
                    >
                      {{ item.status }}
                    </span>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0"
                >
                  <div class="flex flex-col sm:text-right">
                    <span
                      class="text-[10px] text-gray-400 font-bold uppercase tracking-tight"
                      >{{
                        item.status === "paid" ? "Paid At" : "Due Date"
                      }}</span
                    >
                    <span class="text-xs font-medium text-gray-600">{{
                      item.paid_at ? item.paid_at.split("T")[0] : item.due_date
                    }}</span>
                  </div>

                  <button
                    @click="handleCollectPayment(item.id)"
                    :disabled="item.status === 'paid'"
                    :class="
                      item.status === 'paid'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                    "
                    class="px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    {{ item.status === "paid" ? "Collected" : "Collect" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 grid grid-cols-2 gap-4"
        >
          <div class="col-span-1">
            <label
              class="block text-[10px] font-black text-emerald-600 uppercase mb-1"
              >Installments Count</label
            >
            <input
              v-model.number="form.number_of_installments"
              type="number"
              min="1"
              class="w-full px-4 py-2 border border-emerald-200 rounded-xl outline-none"
            />
          </div>
          <div class="col-span-1">
            <label
              class="block text-[10px] font-black text-emerald-600 uppercase mb-1"
              >Interval (Days)</label
            >
            <input
              v-model.number="form.interval_days"
              type="number"
              class="w-full px-4 py-2 border border-emerald-200 rounded-xl outline-none"
            />
          </div>
          <div class="col-span-2">
            <label
              class="block text-[10px] font-black text-emerald-600 uppercase mb-1"
              >Down Payment</label
            >
            <input
              v-model.number="form.down_payment"
              type="number"
              class="w-full px-4 py-2 border border-emerald-200 rounded-xl outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1"
            >Order Notes</label
          >
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter any special instructions..."
          ></textarea>
        </div>
      </div>

      <div class="p-6 border-t border-gray-100 bg-gray-50">
        <div class="grid grid-cols-3 gap-4 mb-6 text-center">
          <div class="bg-white p-2 rounded-xl border">
            <p class="text-[10px] font-bold text-gray-400 uppercase">Total</p>
            <p class="text-lg font-black text-gray-900">
              Rs. {{ orderTotal.toLocaleString() }}
            </p>
          </div>
          <div class="bg-white p-2 rounded-xl border border-emerald-100">
            <p class="text-[10px] font-bold text-emerald-500 uppercase">
              Per Payment
            </p>
            <p class="text-lg font-black text-emerald-600">
              Rs. {{ installmentAmount.toLocaleString() }}
            </p>
          </div>
          <div class="bg-white p-2 rounded-xl border border-rose-100">
            <p class="text-[10px] font-bold text-rose-500 uppercase">
              Balance to pay
            </p>
            <p class="text-lg font-black text-rose-600">
              Rs. {{ finalBalance.toLocaleString() }}
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            @click="$emit('cancel')"
            class="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Dropdown from "../Dropdown.vue";
import { collectInstallmentById, updateSeller } from "../../api/orders";
import { calculateBalanceAmount } from "../../utils/order-calculations";

const props = defineProps<{
  show: boolean;
  customers: any[];
  products: any[];
  sellers: any[];
  form: any;
  cancel: () => void;
  fetchData: () => void;
}>();

const finalBalance = ref(0);
const showUpdateCollectorBtn = ref(false);

const emit = defineEmits(["save", "cancel"]);

const addItem = () => {
  if (!props.form.items) props.form.items = [];
  props.form.items.push({ product_id: null, quantity: 1, unit_price: 0 });
};

const onProductChange = (item: any) => {
  const p = props.products.find((x) => x.id === item.product_id);
  if (p) {
    item.unit_price = p.selling_price;
  }
};

const orderTotal = computed(() => {
  return (props.form.items || []).reduce((sum: number, item: any) => {
    return sum + Number(item.unit_price || 0) * Number(item.quantity || 0);
  }, 0);
});

const installmentAmount = computed(() => {
  const count = Number(props.form.number_of_installments) || 1;
  const balance = orderTotal.value - (Number(props.form.down_payment) || 0);
  return balance > 0 ? Math.round((balance / count) * 100) / 100 : 0;
});

// Calculate balance whenever relevant data changes
const calculateBalance = () => {
  const paidAmount = (props.form.collections || [])
    .filter((collection: any) => collection.status === "paid")
    .reduce(
      (sum: number, collection: any) => sum + (Number(collection.amount) || 0),
      0,
    );

  if (props.form.customer_id) {
    finalBalance.value = calculateBalanceAmount(
      orderTotal.value,
      paidAmount + (Number(props.form.down_payment) || 0),
    );
  } else {
    finalBalance.value = 0;
  }
};

watch(
  [() => props.form.collections, orderTotal, () => props.form.items],
  () => {
    calculateBalance();
  },
  { deep: true, immediate: true },
);

watch(
  () => props.show,
  (newVal) => {
    if (newVal && props.form.id) {
      calculateBalance();
    }
  },
  { immediate: true },
);

const handleUpdateCollector = async () => {
  try {
    if (confirm("Are you sure to update collector ?")) {
      await updateSeller(props.form.id, props.form.seller_id);
      alert("Collector updated successfully!");
    }
  } catch (error: any) {
    const message = error.response?.data?.detail;
    console.log(message);
    alert(message);
  }
};

const handleCollectPayment = async (id: string) => {
  try {
    if (confirm("Are you sure to collect this installment ?")) {
      await collectInstallmentById(id);

      // Update the collection status in the local form data
      const collection = props.form.collections?.find((c: any) => c.id === id);
      if (collection) {
        collection.status = "paid";
        collection.paid_at = new Date().toISOString();
      }

      // Recalculate balance after collection
      calculateBalance();
      alert("Payment collected successfully.");
      props.fetchData();
    }
  } catch (err) {
    console.error("Failed to collect payment", err);
  }
};

// Expose the balance calculation function if needed elsewhere
defineExpose({
  calculateBalance,
});
</script>
