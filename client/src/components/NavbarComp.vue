<template>
  <div class="header">
    <div class="header-container">
      <router-link to="/" class="logo">
        Pluriscience
      </router-link> 
      <nav :class="['nav', { active: isOpen }]">
        <router-link to="/" class="nav-link active">Home</router-link>
        <router-link to="/lessons" class="nav-link">Lessons</router-link>  
        <router-link to="/quizzs" class="nav-link">Quizzs</router-link>
      </nav>
        <!-- Profile Section -->
      <div class="profile-section" id="profileSection">
        <!-- Logged out state -->
        <div class="profile-logged-out" id="profileLoggedOut">
          <button class="btn-auth btn-login" onclick="openAuthModal('login')">Connexion</button>
          <button class="btn-auth btn-signup" onclick="openAuthModal('signup')">Inscription</button>
        </div>
        <!-- Logged in state (hidden by default) -->
        <div class="profile-logged-in" id="profileLoggedIn" style="display: none;">
          <button class="profile-avatar-btn" onclick="toggleProfileMenu()">
            <img src="" alt="Photo de profil" class="profile-avatar" id="profileAvatar">
          </button>
          <div class="profile-dropdown" id="profileDropdown">
            <router-link to="/profil" class="profile-dropdown-item">
              Mon profil
            </router-link>
            <button class="profile-dropdown-item logout-btn" onclick="logout()">Déconnexion</button>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../assets/styles.css';
</style>
