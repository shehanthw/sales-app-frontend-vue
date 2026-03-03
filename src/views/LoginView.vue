<template>
  <div class="flex justify-center items-center px-4 h-[calc(100vh-30vh)]">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Email Address</label
          >
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 rounded-lg transition"
        >
          {{ isSubmitting ? "Authenticating..." : "Login" }}
        </button>
      </form>
      <p v-if="errorMessage" class="mt-4 text-red-600 text-sm">
        {{ errorMessage }}
      </p>
      <div class="mt-6 text-center text-sm text-gray-600">
        Don't have an account?
        <router-link
          to="/register"
          class="text-blue-600 hover:text-blue-700 font-medium"
          >Contact us</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../api/auth";

const email = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string | null>(null);
const isSubmitting = ref<boolean>(false);

const router = useRouter();

const handleLogin = async () => {
  isSubmitting.value = true;
  errorMessage.value = null;
  try {
    const formData = new FormData();
    formData.append("username", email.value);
    formData.append("password", password.value);
    await login(formData);
    router.push("/");
  } catch (err: any) {
    errorMessage.value = err.response?.data?.detail || "An error occurred";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
