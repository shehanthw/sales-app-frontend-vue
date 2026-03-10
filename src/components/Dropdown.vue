<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  options: { type: Array, required: true },
  placeholder: { type: String, default: "Select a customer" },
  modelValue: { type: [String, Number], default: "" },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "change"]);

const searchQuery = ref("");
const isOpen = ref(false);
const container = ref(null);

const selectedOptionName = computed(() => {
  const selected = props.options.find((opt) => opt.id === props.modelValue);
  return selected ? selected.product_name || selected.name : "";
});

const filteredOptions = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return props.options.filter((opt) => {
    const name = opt.name || opt.product_name || "";
    return name.toLowerCase().includes(query);
  });
});

const handleInput = (e) => {
  searchQuery.value = e.target.value;
  isOpen.value = true;
};

const selectOption = (opt) => {
  emit("update:modelValue", opt.id);
  emit("change", opt.id);
  searchQuery.value = opt.name || opt.product_name;
  isOpen.value = false;
};

// --- NEW CLEAR METHOD ---
const clearSelection = () => {
  emit("update:modelValue", "");
  emit("change", "");
  searchQuery.value = "";
  isOpen.value = false;
};

const close = (e) => {
  if (container.value && !container.value.contains(e.target)) {
    isOpen.value = false;
    // Sync search query back to the selected name on blur
    searchQuery.value = selectedOptionName.value;
  }
};

onMounted(() => window.addEventListener("click", close));
onUnmounted(() => window.removeEventListener("click", close));
</script>

<template>
  <div class="relative" ref="container">
    <div class="relative flex items-center border border-gray-300 rounded-md shadow-sm">
      <input
        type="text"
        class="w-full px-3 py-2 pr-10 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        :placeholder="placeholder"
        :value="isOpen ? searchQuery : selectedOptionName"
        @input="handleInput"
        @focus="isOpen = true"
        :disabled="props.disabled"
      />
      
      <button
        v-if="modelValue && !props.disabled"
        type="button"
        @click.stop="clearSelection"
        class="absolute right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <ul
      v-if="isOpen"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <li
        v-for="opt in filteredOptions"
        :key="opt.id"
        @click="selectOption(opt)"
        class="px-3 py-2 hover:bg-blue-100 cursor-pointer border-b last:border-0 border-gray-100 capitalize"
      >
        {{ opt.name || opt.product_name }} {{ opt.quantity ? `X ${opt.quantity}` : "" }}
      </li>
      <li v-if="filteredOptions.length === 0" class="px-3 py-2 text-gray-500 text-sm">
        No matches found
      </li>
    </ul>
  </div>
</template>