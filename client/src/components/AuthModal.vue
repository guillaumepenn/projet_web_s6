<template>
  <!-- Modal Overlay: background that covers the screen -->
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <button class="close-btn" @click="closeModal">&times;</button>
      
      <div class="modal-content">
        <h2>{{ isLogin ? 'Welcome Back' : 'Join Pluriscience' }}</h2>
        <p class="modal-subtitle">
          {{ isLogin ? 'Enter your credentials to access your lessons.' : 'Create an account to start your journey.' }}
        </p>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              v-model="formData.username" 
              placeholder="Enter your ID" 
              required
            >
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="formData.password" 
              placeholder="••••••••" 
              required
            >
          </div>

          <button type="submit" class="btn-submit" :disabled="isLoading">
            {{ isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up') }}
          </button>
        </form>

        <div class="modal-footer">
          <button @click="isLogin = !isLogin" class="toggle-auth">
            {{ isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isVisible = ref(false);
const isLogin = ref(true);
const isLoading = ref(false);

const formData = ref({
  username: '',
  password: ''
});

/**
 * Closes the modal and resets the form
 */
const closeModal = () => {
  isVisible.value = false;
  formData.value = { username: '', password: '' };
};

/**
 * Handles the form submission
 * In a real app, this is where you call your backend API
 */
const handleSubmit = async () => {
  isLoading.value = true;
  
  // Simulation of a server delay (1.5s)
  setTimeout(() => {
    // 1. Prepare dummy user data (In reality, this comes from your Database)
    const mockUser = {
      name: formData.value.username,
      avatar: null,
      token: "fake-jwt-token-from-server"
    };

    // 2. Save to localStorage so Navbar can see it
    localStorage.setItem('user', JSON.stringify(mockUser));

    // 3. Dispatch the event we talked about!
    window.dispatchEvent(new Event('auth-change'));

    isLoading.value = false;
    closeModal();
    alert(`Success! Welcome ${mockUser.name}`);
  }, 1500);
};

/**
 * Listen for the 'open-auth' event sent by the Navbar
 */
onMounted(() => {
  window.addEventListener('open-auth', (event) => {
    isLogin.value = event.detail === 'login';
    isVisible.value = true;
  });
});

onUnmounted(() => {
  window.removeEventListener('open-auth');
});
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

.btn-submit:hover { background: #16435e; }

.toggle-auth {
  background: none; border: none;
  color: #1e5a7e;
  margin-top: 1.5rem;
  cursor: pointer;
  text-decoration: underline;
}
</style>