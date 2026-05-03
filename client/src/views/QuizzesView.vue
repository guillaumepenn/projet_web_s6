<template>
  <div class="quizzes-page">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <h1>Tous les Quizz</h1>
        <p>Testez vos connaissances et suivez votre progression</p>
      </div>
    </section>

    <!-- Filter Section -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-bar">
          <div class="filter-group">
            <label>Domaine :</label>
            <select v-model="filters.domain" class="filter-select">
              <option value="all">Tous les domaines</option>
              <option v-for="d in domains" :key="d" :value="d.toLowerCase()">{{ d }}</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Statut :</label>
            <select v-model="filters.status" class="filter-select">
              <option value="all">Tous</option>
              <option value="completed">Effectués</option>
              <option value="not-completed">Non effectués</option>
            </select>
          </div>

          <div class="search-group">
            <input 
              type="text" 
              v-model="filters.search" 
              class="search-input" 
              placeholder="Rechercher un quizz..."
            >
            <!-- SVG Icon ici -->
          </div>
        </div>
      </div>
    </section>

    <!-- Quizzes Table -->
    <section class="table-section">
      <div class="container">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th v-for="col in columns" :key="col.key">
                  <button 
                    v-if="col.sortable" 
                    @click="toggleSort(col.key)" 
                    :class="['sort-btn', { active: currentSort.field === col.key }]"
                  >
                    {{ col.label }}
                    <span class="sort-icon" :class="currentSort.direction" v-if="currentSort.field === col.key">
                      <!-- SVG Arrow -->
                    </span>
                  </button>
                  <span v-else>{{ col.label }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="quiz in filteredAndSortedQuizzes" :key="quiz.id">
                <td><strong>{{ quiz.title }}</strong></td>
                <td>
                  <span :class="['domain-badge', quiz.domain]">
                    {{ quiz.domain }}
                  </span>
                </td>
                <td>{{ quiz.questions.length }} questions</td>
                <td>
                  <span v-if="getProg(quiz.id).completed" class="status-badge completed">Effectué</span>
                  <span v-else class="status-badge not-completed">Non effectué</span>
                </td>
                <td>
                  <span v-if="getProg(quiz.id).percentage !== null" 
                        :class="['score-badge', getScoreClass(getProg(quiz.id).percentage)]">
                    {{ getProg(quiz.id).percentage }}%
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <router-link :to="`/quiz/${quiz.id}`" class="table-action-btn">
                    {{ getProg(quiz.id).completed ? 'Refaire' : 'Commencer' }}
                  </router-link>
                </td>
              </tr>
              <tr v-if="filteredAndSortedQuizzes.length === 0">
                <td colspan="6" class="empty-row">Aucun quizz ne correspond à vos critères.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-footer">
          <p class="results-count"><span>{{ filteredAndSortedQuizzes.length }}</span> quizz affichés</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { quizzesData } from '../assets/data.js'; // Tes données

// État des filtres
const filters = reactive({
  domain: 'all',
  status: 'all',
  search: ''
});

// État du tri
const currentSort = reactive({
  field: 'title',
  direction: 'asc'
});

const domains = ['Astronomie', 'Biologie', 'Chimie', 'Physique', 'Géologie'];
const columns = [
  { label: 'Titre', key: 'title', sortable: true },
  { label: 'Domaine', key: 'domain', sortable: true },
  { label: 'Questions', key: 'questions', sortable: true },
  { label: 'Statut', key: 'status', sortable: false },
  { label: 'Score', key: 'score', sortable: true },
  { label: 'Action', key: 'action', sortable: false }
];

// Simuler la récupération du progrès (LocalStorage ou Store)
const getProg = (id) => {
  // Remplacer par ta vraie logique de store/localStorage
  return JSON.parse(localStorage.getItem(`quiz_prog_${id}`)) || { completed: false, percentage: null };
};

const getScoreClass = (score) => {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

const toggleSort = (field) => {
  if (currentSort.field === field) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.field = field;
    currentSort.direction = 'asc';
  }
};

// LOGIQUE DE FILTRAGE ET TRI (Le cerveau du composant)
const filteredAndSortedQuizzes = computed(() => {
  let result = [...quizzesData];

  // 1. Filtrage
  result = result.filter(quiz => {
    const prog = getProg(quiz.id);
    const matchDomain = filters.domain === 'all' || quiz.domain.toLowerCase() === filters.domain;
    const matchStatus = filters.status === 'all' || 
                        (filters.status === 'completed' && prog.completed) ||
                        (filters.status === 'not-completed' && !prog.completed);
    const matchSearch = quiz.title.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchDomain && matchStatus && matchSearch;
  });

  // 2. Tri
  result.sort((a, b) => {
    let aVal, bVal;
    const progA = getProg(a.id);
    const progB = getProg(b.id);

    switch (currentSort.field) {
      case 'questions': aVal = a.questions.length; bVal = b.questions.length; break;
      case 'score': aVal = progA.percentage || -1; bVal = progB.percentage || -1; break;
      default: aVal = a[currentSort.field]; bVal = b[currentSort.field];
    }

    let modifier = currentSort.direction === 'asc' ? 1 : -1;
    if (aVal < bVal) return -1 * modifier;
    if (aVal > bVal) return 1 * modifier;
    return 0;
  });

  return result;
});
</script>
<style>
    @import '../assets/styles.css';
</style>