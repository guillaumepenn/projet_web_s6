<template>
  <div id="app">
    <nav class="navbar">
      <h1>Forscience</h1>
      <div class="menu">
        <button @click="currentPage = 'home'">Accueil</button>
        <button @click="currentPage = 'quiz'">Quiz</button>
        <button @click="currentPage = 'admin'">Admin</button>
      </div>
    </nav>

    <main class="content">
      <div v-if="currentPage === 'home'">
        <h2>Bienvenue, futur chercheur !</h2>
        <p>Choisis une catégorie pour tester tes connaissances.</p>
      </div>

      <div v-if="currentPage === 'quiz'">
        <h2>Laboratoire de Quiz</h2>
        </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 'home' // Gère quelle "page" est affichée
    }
  }
}
</script>

<style>
/* Un peu de CSS pour la forme (Interface Design) */
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #2c3e50;
  color: white;
}
.menu button {
  margin-left: 10px;
  background: #41b883;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
}
</style>