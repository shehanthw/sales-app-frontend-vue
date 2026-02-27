<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  options: { type: Array, required: true }, // Expects [{id: 1, name: '...'}, ...]
  placeholder: { type: String, default: 'Select a customer' },
  modelValue: { type: [String, Number], default: '' }
});

const emit = defineEmits(['update:modelValue']);

const searchQuery = ref('');
const isOpen = ref(false);
const container = ref(null);

// This ensures that when the dropdown is closed, we show the Name, not the ID
const selectedOptionName = computed(() => {
  const selected = props.options.find(opt => opt.id === props.modelValue);
  return selected ? selected.name : '';
});

const filteredOptions = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return props.options.filter(opt => 
    opt.name.toLowerCase().includes(query)
  );
});

const handleInput = (e) => {
  searchQuery.value = e.target.value;
  isOpen.value = true;
};

const selectOption = (opt) => {
  emit('update:modelValue', opt.id); 
  emit('change', opt.id);
  searchQuery.value = opt.name;
  isOpen.value = false;
};

const close = (e) => {
  if (!container.value.contains(e.target)) {
    isOpen.value = false;
    searchQuery.value = selectedOptionName.value; // Reset to selected name if blurred
  }
};

onMounted(() => window.addEventListener('click', close));
onUnmounted(() => window.removeEventListener('click', close));
</script>

<template>
  <div class="relative" ref="container">
    <div class="relative border border-gray-300 rounded-md shadow-sm">
      <input
        type="text"
        class="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        :placeholder="placeholder"
        :value="isOpen ? searchQuery : selectedOptionName"
        @input="handleInput"
        @focus="isOpen = true"
      />
    </div>

    <ul v-if="isOpen" class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
      <li
        v-for="opt in filteredOptions"
        :key="opt.id"
        @click="selectOption(opt)"
        class="px-3 py-2 hover:bg-blue-100 cursor-pointer border-b last:border-0 border-gray-100"
      >
        {{ opt.name }}
      </li>
      <li v-if="filteredOptions.length === 0" class="px-3 py-2 text-gray-500 text-sm">
        No matches found
      </li>
    </ul>
  </div>
</template>