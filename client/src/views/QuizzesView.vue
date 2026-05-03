<template>
  <div class="quizzes-page">
    <section class="page-header">
      <div class="container">
        <h1>All Quizzes</h1>
        <p>Test your knowledge and track your personal progress</p>
      </div>
    </section>

    <section class="filter-section">
      <div class="container">
        <div class="filter-bar">
          <!-- Filter by scientific field -->
          <div class="filter-group">
            <label>Field:</label>
            <select v-model="filters.domain" class="filter-select">
              <option value="all">All fields</option>
              <option v-for="d in domains" :key="d" :value="d.toLowerCase()">{{ d }}</option>
            </select>
          </div>

          <!-- Filter by completion status -->
          <div class="filter-group">
            <label>Status:</label>
            <select v-model="filters.status" class="filter-select">
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="not-completed">Not completed</option>
            </select>
          </div>

          <!-- Keyword search input -->
          <div class="search-group">
            <input 
              type="text" 
              v-model="filters.search" 
              class="search-input" 
              placeholder="Search for a quiz..."
            >
          </div>
        </div>
      </div>
    </section>

    <section class="table-section">
      <div class="container">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <!-- Dynamic generation of table headers with sorting capability -->
                <th v-for="col in columns" :key="col.key">
                  <button 
                    v-if="col.sortable" 
                    @click="toggleSort(col.key)" 
                    :class="['sort-btn', { active: currentSort.field === col.key }]"
                  >
                    {{ col.label }}
                    <span class="sort-icon" :class="currentSort.direction" v-if="currentSort.field === col.key">
                      <!-- Sorting arrow indicator -->
                    </span>
                  </button>
                  <span v-else>{{ col.label }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- Iteration through filtered and sorted quiz list -->
              <tr v-for="quiz in filteredAndSortedQuizzes" :key="quiz.id">
                <td><strong>{{ quiz.title }}</strong></td>
                <td>
                  <span :class="['domain-badge', quiz.domain]">
                    {{ quiz.domain }}
                  </span>
                </td>
                <td>{{ quiz.questions.length }} questions</td>
                <td>
                  <span v-if="getProg(quiz.id).completed" class="status-badge completed">Completed</span>
                  <span v-else class="status-badge not-completed">Not completed</span>
                </td>
                <td>
                  <!-- Displays percentage score or a dash if not attempted -->
                  <span v-if="getProg(quiz.id).percentage !== null" 
                        :class="['score-badge', getScoreClass(getProg(quiz.id).percentage)]">
                    {{ getProg(quiz.id).percentage }}%
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <router-link :to="`/quiz/${quiz.id}`" class="table-action-btn">
                    {{ getProg(quiz.id).completed ? 'Retake' : 'Start' }}
                  </router-link>
                </td>
              </tr>
              <!-- Empty state message -->
              <tr v-if="filteredAndSortedQuizzes.length === 0">
                <td colspan="6" class="empty-row">No quizzes match your search criteria.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-footer">
          <p class="results-count"><span>{{ filteredAndSortedQuizzes.length }}</span> quizzes displayed</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { quizzesData } from '../assets/data.js';

/**
 * Reactive state for filtering criteria
 */
const filters = reactive({
  domain: 'all',
  status: 'all',
  search: ''
});

/**
 * Reactive state for table sorting logic
 */
const currentSort = reactive({
  field: 'title',
  direction: 'asc'
});

const domains = ['Astronomy', 'Biology', 'Chemistry', 'Physics', 'Geology'];

/**
 * Table configuration to manage labels and sorting rules
 */
const columns = [
  { label: 'Title', key: 'title', sortable: true },
  { label: 'Field', key: 'domain', sortable: true },
  { label: 'Questions', key: 'questions', sortable: true },
  { label: 'Status', key: 'status', sortable: false },
  { label: 'Score', key: 'score', sortable: true },
  { label: 'Action', key: 'action', sortable: false }
];

/**
 * Retrieves quiz progress from persistent storage (localStorage)
 * Can be replaced by an API call in a database-driven environment
 */
const getProg = (id) => {
  return JSON.parse(localStorage.getItem(`quiz_prog_${id}`)) || { completed: false, percentage: null };
};

/**
 * Returns a CSS class based on the numerical score
 */
const getScoreClass = (score) => {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

/**
 * Handles the logic of switching sorting fields and directions
 */
const toggleSort = (field) => {
  if (currentSort.field === field) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.field = field;
    currentSort.direction = 'asc';
  }
};

/**
 * Core logic: Filters the data array then sorts it based on user selection
 */
const filteredAndSortedQuizzes = computed(() => {
  let result = [...quizzesData];

  // Apply filters (Domain, Status, Search string)
  result = result.filter(quiz => {
    const prog = getProg(quiz.id);
    const matchDomain = filters.domain === 'all' || quiz.domain.toLowerCase() === filters.domain;
    const matchStatus = filters.status === 'all' || 
                        (filters.status === 'completed' && prog.completed) ||
                        (filters.status === 'not-completed' && !prog.completed);
    const matchSearch = quiz.title.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchDomain && matchStatus && matchSearch;
  });

  // Apply sorting
  result.sort((a, b) => {
    let aVal, bVal;
    const progA = getProg(a.id);
    const progB = getProg(b.id);

    // Specific sorting rules for calculated fields
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

<style scoped>
@import '../assets/styles.css';
</style>