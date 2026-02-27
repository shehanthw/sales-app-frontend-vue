<template>
  <div class="flex justify-center items-center min-h-screen px-4">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-2 text-gray-800">Create Account</h2>
      <p class="text-gray-600 mb-6 text-sm">Join us to manage your customers</p>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input v-model="email" type="email" placeholder="name@example.com" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="password" type="password" placeholder="••••••••" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input v-model="confirmPassword" type="password" placeholder="••••••••" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
        </div>

        <button type="submit" :disabled="loading" class="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-2 rounded-lg transition">
          {{ loading ? 'Creating Account...' : 'Register' }}
        </button>
      </form>

      <p v-if="error" class="mt-4 text-red-600 text-sm">{{ error }}</p>
      
      <div class="mt-6 text-center text-sm text-gray-600">
        Already have an account? 
        <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-medium">Login here</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/api';

const router = useRouter();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref<string | null>(null);
const loading = ref(false);

const handleRegister = async () => {
  error.value = null;

  // Client-side validation
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }

  loading.value = true;
  try {
    // We hit the register endpoint (which we'll add to FastAPI next)
    await api.post('/api/register', {
      email: email.value,
      password: password.value
    });
    
    // Redirect to login after successful registration
    router.push({ name: 'Login', query: { registered: 'true' } });
  } catch (err: any) {
    error.value = err.response?.data?.detail || "Registration failed. Try a different email.";
  } finally {
    loading.value = false;
  }
};
</script>

