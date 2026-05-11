<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <button class="close-btn" @click="closeModal">&times;</button>

      <div class="modal-content">
        <h2>{{ isLogin ? 'Welcome Back' : 'Join Pluriscience' }}</h2>
        <p class="modal-subtitle">
          {{ isLogin ? 'Enter your credentials to access your lessons.' : 'Create an account to start your journey.' }}
        </p>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="formData.username" placeholder="Enter your username" required>
          </div>

          <div v-if="!isLogin" class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="formData.email" placeholder="Enter your email" required>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="formData.password" placeholder="••••••••" required>
          </div>

          <button type="submit" class="btn-submit" :disabled="isLoading">
            {{ isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up') }}
          </button>
        </form>

        <div class="modal-footer">
          <button @click="switchMode" class="toggle-auth">
            {{ isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { authApi } from '../composables/useApi.js';

const isVisible = ref(false);
const isLogin = ref(true);
const isLoading = ref(false);
const errorMessage = ref('');

const formData = ref({ username: '', email: '', password: '' });

const closeModal = () => {
  isVisible.value = false;
  errorMessage.value = '';
  formData.value = { username: '', email: '', password: '' };
};

const switchMode = () => {
  isLogin.value = !isLogin.value;
  errorMessage.value = '';
};

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    let data;
    if (isLogin.value) {
      data = await authApi.login(formData.value.username, formData.value.password);
    } else {
      data = await authApi.register(formData.value.username, formData.value.email, formData.value.password);
    }

    localStorage.setItem('user', JSON.stringify(data.user));
    window.dispatchEvent(new Event('auth-change'));
    closeModal();
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const openHandler = (event) => {
  isLogin.value = event.detail === 'login';
  isVisible.value = true;
};

onMounted(() => window.addEventListener('open-auth', openHandler));
onUnmounted(() => window.removeEventListener('open-auth', openHandler));
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  width: 100%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.close-btn {
  position: absolute;
  top: 15px; right: 20px;
  background: none; border: none;
  font-size: 1.5rem; cursor: pointer; color: #666;
}

.auth-form { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem; }

.form-group { display: flex; flex-direction: column; gap: 0.5rem; text-align: left; }

input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.btn-submit {
  background: #1e5a7e;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-submit:hover:not(:disabled) { background: #16435e; }

.error-message {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.toggle-auth {
  background: none; border: none;
  color: #1e5a7e;
  margin-top: 1.5rem;
  cursor: pointer;
  text-decoration: underline;
}
</style>