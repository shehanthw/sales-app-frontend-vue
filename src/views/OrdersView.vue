<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">Orders</h1>
      <button
        @click="showForm = !showForm"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
      >
        {{ showForm ? "Cancel" : "+ New Order" }}
      </button>
    </div>

    <div v-if="showForm" class="bg-white shadow rounded-lg p-6 mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Create Order</h3>

      <div class="space-y-4">
        <div class="">
          <label class="block text-sm font-medium text-gray-700"
            >Select Customer:</label
          >
          <Dropdown
            v-model="form.customer_id"
            :options="customers"
            placeholder="Select a customer"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Installments</label
            >
            <input
              v-model.number="form.installments"
              type="number"
              class="text-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Down Payment</label
            >
            <input
              v-model.number="form.down_payment"
              type="number"
              step="0.01"
              class="text-primary"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            v-model="form.notes"
            rows="2"
            class="text-primary"
          ></textarea>
        </div>

        <!-- Add Items / Products -->
        <div>
          <h4 class="font-semibold mb-4 text-lg">Items</h4>

          <div
            class="hidden md:grid grid-cols-4 gap-4 items-end mb-2 p-3 font-medium text-gray-600"
          >
            <label class="text-sm">Product</label>
            <label class="text-sm">Qty</label>
            <label class="text-sm">Total</label>
            <div></div>
          </div>

          <div
            v-for="(item, idx) in form.items"
            :key="idx"
            class="grid grid-cols-1 mb-5 lg:mb-0 md:grid-cols-4 gap-4 md:gap-2 items-end p-4 md:p-3 bg-gray-50 rounded-lg border border-gray-100 md:border-none shadow-sm md:shadow-none"
          >
            <div class="grid gap-1">
              <label class="text-xs font-bold uppercase text-gray-500 md:hidden"
                >Product</label
              >
              <Dropdown
                v-model="item.product_id"
                :options="products"
                placeholder="Select a Product"
                @change="onProductChange(item)"
              />
            </div>

            <div class="grid gap-1">
              <label class="text-xs font-bold uppercase text-gray-500 md:hidden"
                >Qty</label
              >
              <input
                v-model.number="item.quantity"
                type="number"
                min="1"
                @input="updateItem(item)"
                class="text-default"
              />
            </div>

            <div class="grid gap-1">
              <label class="text-xs font-bold uppercase text-gray-500 md:hidden"
                >Total</label
              >
              <p
                class="mt-1 font-semibold md:font-normal text-blue-600 md:text-gray-900"
              >
                {{ item.total_price.toFixed(2) }}
              </p>
            </div>

            <div class="grid gap-1">
              <button
                @click="removeItem(idx)"
                class="mt-7 text-red-600 hover:text-red-800 text-sm font-medium border border-red-800 rounded-md px-3 py-1 transition-colors self-start"
              >
                Remove
              </button>
            </div>
          </div>

          <button
            @click="addItem"
            class="w-full md:w-auto btn-outline mt-5 border-2 border-dashed border-gray-300 py-3 hover:border-blue-500 hover:bg-blue-50 transition-all rounded-lg"
          >
            + Add item
          </button>
        </div>

        <!-- Payments -->
        <div>
          <h4 class="font-semibold mb-4 text-lg">Payments</h4>

          <div
            v-for="(payment, idx) in form.payments"
            :key="idx"
            class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm md:shadow-none"
          >
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold uppercase text-gray-500"
                  >Amount</label
                >
                <input
                  v-model.number="payment.amount"
                  type="number"
                  step="0.01"
                  min="0"
                  class="text-primary w-full border-gray-300 rounded-md focus:ring-blue-500"
                />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold uppercase text-gray-500"
                  >Date</label
                >
                <input
                  v-model="payment.payment_date"
                  type="date"
                  class="text-primary w-full border-gray-300 rounded-md focus:ring-blue-500"
                />
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold uppercase text-gray-500"
                  >Method</label
                >
                <select v-model="payment.payment_method" class="text-primary">
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div class="mt-4 flex flex-col gap-1">
              <label class="text-xs font-bold uppercase text-gray-500"
                >Notes</label
              >
              <input
                v-model="payment.notes"
                type="text"
                placeholder="Payment notes"
                class="text-primary w-full border-gray-300 rounded-md focus:ring-blue-500"
              />
            </div>
            <div class="flex flex-col gap-1">
              <button
                @click="removePayment(idx)"
                class="mt-7 text-red-600 hover:text-red-800 text-sm font-medium border border-red-800 rounded-md px-3 py-1 transition-colors self-start"
              >
                Remove
              </button>
            </div>
          </div>

          <button
            @click="addPayment"
            class="w-full md:w-auto btn-outline mt-2 border-2 border-dashed border-gray-300 py-3 hover:border-blue-500 hover:bg-blue-50 transition-all rounded-lg text-gray-600 font-medium"
          >
            + Add payment
          </button>
        </div>

        <div class="text-right font-bold">
          Total: {{ orderTotal.toFixed(2) }}
        </div>

        <button
          @click="saveOrder"
          class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
        >
          Save Order
        </button>
      </div>
    </div>

    <!-- existing orders list -->
    <div class="grid grid-cols-1 gap-4 p-4">
      <OrdersList
        v-for="o in paginatedOrders"
        :key="o.id"
        :order="o"
        :customers="customers"
        @click="openDetails(o)"
      />

      <OrderDetailsDialog
        v-if="isDialogOpen"
        :order="selectedOrder"
        :customers="customers"
        @close="isDialogOpen = false"
      />
    </div>

    <div
      v-if="totalPages > 1"
      class="mt-8 flex items-center justify-center gap-2 mb-5"
    >
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
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import OrdersList from "../components/Order/OrdersList.vue";
import OrderDetailsDialog from "../components/Order/OrderDetailsDialog.vue";
import api from "../api/api";
import type { Customer } from "../types/customer";
import type { Product } from "../types/product";
import type { Order, OrderedItem } from "../types/order";
import Dropdown from "../components/Dropdown.vue";

const selectedOrder = ref(null);
const isDialogOpen = ref(false);

const orders = ref<Order[]>([]);
const customers = ref<Customer[]>([]);
const products = ref<Product[]>([]);
const showForm = ref(false);
const currentPage = ref(1);
const itemsPerPage = 5;

const openDetails = (order) => {
  selectedOrder.value = order;
  isDialogOpen.value = true;
};

const form = reactive<any>({
  customer_id: null,
  user_id: 0,
  installments: null,
  down_payment: null,
  total: 0,
  status: "pending",
  notes: "",
  items: [] as Array<{
    product_id: any;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>,
  payments: [] as Array<{
    amount: number;
    payment_date: string;
    payment_method: string;
    notes: string;
  }>,
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(orders.value.length / itemsPerPage)),
);
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return orders.value.slice(start, start + itemsPerPage);
});

const orderTotal = computed(() =>
  form.items.reduce((sum: number, it: any) => sum + it.total_price, 0),
);

const fetchData = async () => {
  try {
    const [{ data: c }, { data: p }, { data: o }] = await Promise.all([
      api.get("/api/customers"),
      api.get("/api/products"),
      api.get("/api/orders"),
    ]);
    customers.value = c;
    products.value = p;
    orders.value = o;
  } catch (err) {
    console.error("fetch fail", err);
  }
};

const addItem = () => {
  form.items.push({
    product_id: null,
    quantity: 1,
    unit_price: 0,
    total_price: 0,
  });
};

const removeItem = (idx: number) => {
  form.items.splice(idx, 1);
};

const addPayment = () => {
  form.payments.push({
    amount: 0,
    payment_date: new Date().toISOString().split("T")[0],
    payment_method: "cash",
    notes: "",
  });
};

const removePayment = (idx: number) => {
  form.payments.splice(idx, 1);
};

const onProductChange = (item: any) => {
  const prod = products.value.find((x) => x.id === item.product_id);
  item.unit_price = prod ? prod.selling_price : 0;
  updateItem(item);
};

const updateItem = (item: any) => {
  item.total_price = (item.unit_price || 0) * (item.quantity || 0);
};

const saveOrder = async () => {
  try {
    const orderPayload: any = {
      customer_id: form.customer_id,
      installments: form.installments,
      down_payment: form.down_payment,
      total: orderTotal.value,
      status: form.status,
      notes: form.notes,
    };
    const { data: created } = await api.post("/api/orders", orderPayload);
    const orderId = created.id;

    for (const it of form.items) {
      await api.post(`/api/orders/${orderId}/items`, {
        order_id: orderId,
        product_id: it.product_id,
        quantity: it.quantity,
        unit_price: it.unit_price,
        total_price: it.total_price,
      });
    }

    for (const pmt of form.payments) {
      await api.post(`/api/orders/${orderId}/payments`, {
        order_id: orderId,
        amount: pmt.amount,
        payment_date: pmt.payment_date,
        payment_method: pmt.payment_method,
        notes: pmt.notes,
      });
    }

    resetForm();
    fetchData();
  } catch (err) {
    console.error("save order", err);
    alert("Error creating order");
  }
};

const resetForm = () => {
  form.customer_id = null;
  form.installments = null;
  form.down_payment = null;
  form.total = 0;
  form.status = "pending";
  form.notes = "";
  form.items = [];
  form.payments = [];
  showForm.value = false;
};

const getCustomerName = (id: any) => {
  const c = customers.value.find((x) => x.id === id);
  return c ? c.name : "Unknown";
};

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

onMounted(fetchData);
</script>

<style scoped>
/* small styling tweaks if necessary */
</style>
