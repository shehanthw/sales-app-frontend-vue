<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
    <div class="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all hover:scale-[1.01]">
      <!-- Logo Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p class="text-gray-600 mt-2">Please sign in to your account</p>
      </div>

      <!-- Error Alert -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0"
      >
        <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-700 text-sm font-medium">{{ errorMessage }}</p>
          </div>
        </div>
      </transition>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email Field -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Address
            </span>
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            required
            :class="[
              'w-full px-4 py-3 border-2 rounded-xl focus:ring-4 outline-none transition-all duration-200',
              errorMessage && !email ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-blue-200 focus:border-blue-500'
            ]"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Password
            </span>
          </label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
              :class="[
                'w-full px-4 py-3 border-2 rounded-xl focus:ring-4 outline-none transition-all duration-200 pr-12',
                errorMessage && !password ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-blue-200 focus:border-blue-500'
              ]"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
          
          <!-- Forgot Password Link -->
          <div class="text-right mt-2">
            <a href="#" class="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors">
              Forgot password?
            </a>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-blue-300 disabled:to-indigo-300 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none focus:ring-4 focus:ring-blue-200 outline-none"
        >
          <span class="flex items-center justify-center">
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? "Authenticating..." : "Sign In" }}
          </span>
        </button>
      </form>

      <!-- Additional Options -->
      <div class="mt-8">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">New to our platform?</span>
          </div>
        </div>

        <div class="mt-6 text-center">
          <router-link
            to="/register"
            class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <span>Contact us to get started</span>
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>

      <!-- Demo Credentials (Optional - Remove in production) -->
      <!-- <div class="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <p class="text-xs text-gray-500 text-center">
          <span class="font-semibold">Demo:</span> demo@example.com / password123
        </p>
      </div> -->
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
const showPassword = ref<boolean>(false);

const router = useRouter();

const handleLogin = async () => {
  // Basic validation
  if (!email.value || !password.value) {
    errorMessage.value = "Please fill in all fields";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = null;

  // Simulate API call for demo (remove in production)
  if (email.value === "demo@example.com" && password.value === "password123") {
    setTimeout(() => {
      router.push("/");
      isSubmitting.value = false;
    }, 1500);
    return;
  }

  try {
    const formData = new FormData();
    formData.append("username", email.value);
    formData.append("password", password.value);
    await login(formData);
    router.push("/");
  } catch (err: any) {
    const message = err.response?.data?.detail || "Invalid email or password";
    errorMessage.value = message;
    alert(message)
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Optional: Add smooth transitions for password visibility toggle */
input[type="text"], input[type="password"] {
  transition: all 0.2s ease;
}

/* Custom focus styles */
input:focus {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}
</style>