<template>
  <div class="header">
    <div class="header-container">
      <router-link to="/" class="logo">
        Pluriscience
      </router-link> 
      <nav :class="['nav', { active: isOpen }]">
        <router-link to="/" class="nav-link active">Home</router-link>
        <router-link to="/lessons" class="nav-link">Lessons</router-link>  
        <!-- CORRECTED HERE: /quizzes -->
        <router-link to="/quizzes" class="nav-link">Quizzes</router-link>
      </nav>
        <!-- Profile Section -->
      <div class="profile-section" id="profileSection">
        <div class="profile-logged-out" id="profileLoggedOut">
          <button class="btn-auth btn-login" onclick="openAuthModal('login')">Login</button>
          <button class="btn-auth btn-signup" onclick="openAuthModal('signup')">Sign Up</button>
        </div>
        <div class="profile-logged-in" id="profileLoggedIn" style="display: none;">
          <button class="profile-avatar-btn" onclick="toggleProfileMenu()">
            <img src="" alt="Profile picture" class="profile-avatar" id="profileAvatar">
          </button>
          <div class="profile-dropdown" id="profileDropdown">
            <!-- Updated to /profile -->
            <router-link to="/profile" class="profile-dropdown-item">
              My Profile
            </router-link>
            <button class="profile-dropdown-item logout-btn" onclick="logout()">Logout</button>
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

<script>
export default {
  name: "MainNavbar",

  data() {
    return {
      isOpen: false
    }
  },

  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen
    },

    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.isOpen = false
      }
    }
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
  @import '../assets/styles.css';
</style>