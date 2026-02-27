<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ msg }}</h1>

  <div class="bg-white shadow rounded-lg p-6 mb-6 inline-block">
    <button type="button" @click="count++" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">count is {{ count }}</button>
    <p class="mt-4 text-gray-600">
      Edit
      <code class="bg-gray-100 px-2 py-1 rounded text-red-600">components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p class="text-gray-600">
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank" class="text-blue-600 hover:underline"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p class="text-gray-600">
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      class="text-blue-600 hover:underline"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="text-gray-400 text-sm">Click on the Vite and Vue logos to learn more</p>
</template>
