<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- Project Info -->
        <div class="footer-section">
          <h3 class="footer-logo">Pluriscience</h3>
          <p class="footer-description">
            An interactive platform dedicated to making science accessible to everyone, 
            developed for the <strong>Advanced Web Programming</strong> course.
          </p>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h4>Explore</h4>
          <ul class="footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/lessons">Lessons</router-link></li>
            <li><router-link to="/quizzes">Quizzes</router-link></li>
          </ul>
        </div>

        <!-- Creators / Team -->
        <div class="footer-section">
          <h4>Developed by</h4>
          <ul class="team-list">
            <li>[Your Name]</li>
            <!-- Add other teammates here -->
            <li>[Teammate Name]</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 Pluriscience. Built with Vue.js & ❤️.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Using Script Setup for consistency with your other components
</script>

<style scoped>
.footer {
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 3rem 0 1.5rem 0;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3, .footer-section h4 {
  color: #4da3ff;
  margin-bottom: 1.2rem;
}

.footer-description {
  max-width: 400px;
  line-height: 1.6;
  opacity: 0.8;
}

.footer-links, .team-list {
  list-style: none;
  padding: 0;
}

.footer-links li, .team-list li {
  margin-bottom: 0.6rem;
  opacity: 0.8;
}

.footer-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #4da3ff;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.6;
}

/* Responsive adjustment */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .footer-description {
    margin: 0 auto;
  }
}
</style>