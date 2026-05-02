<template>
  <div class="header">
    <div class="header-container">
      <a href="index.html" class="logo">Pluriscience</a>
        <nav class="nav">
          <a href="index.html" class="nav-link active">Accueil</a>
          <a href="lessons.html" class="nav-link">Leçons</a>
          <a href="quizzes.html" class="nav-link">Quizz</a>
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
            <a href="profile.html" class="profile-dropdown-item">Mon profil</a>
            <a href="#" class="profile-dropdown-item">Paramètres</a>
            <button class="profile-dropdown-item logout-btn" onclick="logout()">Déconnexion</button>
          </div>
        </div>
      </div>
      <button class="mobile-menu-btn" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../assets/styles.css';
</style>
