<template>
  <div class="header">
    <div class="header-container">
      <router-link to="/" class="logo">
        Pluriscience
      </router-link> 
      
      <nav :class="['nav', { active: isOpen }]">
        <router-link to="/" class="nav-link" active-class="active">Home</router-link>
        <router-link to="/lessons" class="nav-link" active-class="active">Lessons</router-link>  
        <router-link to="/quizzes" class="nav-link" active-class="active">Quizzes</router-link>
        <router-link v-if="isAdmin" to="/admin/quizzes" class="nav-link nav-link-admin" active-class="active">⚙ Admin</router-link>
      </nav>

      <div class="profile-section">
        <!-- Visible when user is not authenticated -->
        <div v-if="!isLoggedIn" class="profile-logged-out">
          <button class="btn-auth btn-login" @click="emitAuth('login')">Login</button>
          <button class="btn-auth btn-signup" @click="emitAuth('signup')">Sign Up</button>
        </div>

        <!-- Visible when user is authenticated -->
        <div v-else class="profile-logged-in">
          <button class="profile-avatar-btn" @click.stop="toggleProfileMenu">
            <img :src="userAvatar" alt="Profile picture" class="profile-avatar">
          </button>
          
          <div v-if="showProfileDropdown" class="profile-dropdown">
            <router-link to="/profile" class="profile-dropdown-item" @click="showProfileDropdown = false">
              My Profile
            </router-link>
            <button class="profile-dropdown-item logout-btn" @click="handleLogout">Logout</button>
          </div>
        </div>
      </div>

      <button class="mobile-menu-btn" @click="toggleMenu">
        <span :class="{ active: isOpen }"></span>
        <span :class="{ active: isOpen }"></span>
        <span :class="{ active: isOpen }"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isOpen = ref(false); 
const showProfileDropdown = ref(false); 
const isLoggedIn = ref(false); 
const userData = ref(null);

/**
 * Admin detection: user is considered admin if username is 'admin' or role === 'admin'
 * Replace with a real role check once backend is implemented
 */
const isAdmin = computed(() => {
  return userData.value?.name?.toLowerCase() === 'admin' || userData.value?.role === 'admin';
});

/**
 * Generates the user avatar URL using UI Avatars if no custom image exists
 */
const userAvatar = computed(() => {
  if (userData.value?.avatar) return userData.value.avatar;
  const name = userData.value?.name || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e5a7e&color=fff`;
});

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const toggleProfileMenu = () => {
  showProfileDropdown.value = !showProfileDropdown.value;
};

/**
 * Synchronizes the component state with localStorage authentication data
 */
const checkAuth = () => {
  const user = localStorage.getItem('user');
  if (user) {
    isLoggedIn.value = true;
    userData.value = JSON.parse(user);
  } else {
    isLoggedIn.value = false;
    userData.value = null;
  }
};

const handleLogout = () => {
  localStorage.removeItem('user');
  isLoggedIn.value = false;
  showProfileDropdown.value = false;
  router.push('/');
};

/**
 * Dispatches a custom event to trigger the authentication modal in the parent component
 */
const emitAuth = (type) => {
  window.dispatchEvent(new CustomEvent('open-auth', { detail: type }));
};

/**
 * Closes dropdowns and mobile menus when clicking outside the target elements
 */
const handleClickOutside = (e) => {
  if (!e.target.closest('.profile-section')) {
    showProfileDropdown.value = false;
  }
  if (!e.target.closest('.nav') && !e.target.closest('.mobile-menu-btn')) {
    isOpen.value = false;
  }
};

onMounted(() => {
  checkAuth();
  document.addEventListener('click', handleClickOutside);
  // Listen for login/logout events from other components
  window.addEventListener('auth-change', checkAuth);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('auth-change', checkAuth);
});
</script>

<style scoped>
.profile-dropdown {
  display: block; 
}

.nav-link-admin {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  padding: 0.25rem 0.7rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}
</style>