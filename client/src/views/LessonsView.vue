<!-- eslint-disable -->
<template>
  <div>
    <section class="page-header">
      <div class="container">
        <h1>All Lessons</h1>
        <p>Explore our complete science lesson catalog</p>
      </div>
    </section>

    <section class="filter-section">
      <div class="container">
        <div class="filter-bar">
          <div class="filter-group">
            <label>Domain:</label>
            <select v-model="selectedDomain" class="filter-select">
              <option value="all">All domains</option>
              <option value="astronomy">Astronomy</option>
              <option value="biology">Biology</option>
              <option value="chemistry">Chemistry</option>
              <option value="physics">Physics</option>
              <option value="geology">Geology</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Status:</label>
            <select v-model="selectedStatus" class="filter-select">
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="not-completed">Not completed</option>
            </select>
          </div>

          <div class="search-group">
            <input type="text" v-model="searchQuery" class="search-input" placeholder="Search for a lesson...">
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
                <th @click="toggleSort('title')" class="sortable">Title</th>
                <th @click="toggleSort('domain')" class="sortable">Domain</th>
                <th @click="toggleSort('duration')" class="sortable">Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lesson in filteredLessons" :key="lesson.id">
                <td><strong>{{ lesson.title }}</strong></td>
                <td><span :class="['domain-badge', lesson.domain]">{{ lesson.domain }}</span></td>
                <td>{{ lesson.duration }}</td>
                <td>
                  <span v-if="getLessonStatus(lesson.id)" class="status-badge completed">Completed</span>
                  <span v-else class="status-badge not-completed">Not completed</span>
                </td>
                <td>
                  <!-- CORRECTED HERE: Redirection to the dynamic Vue route -->
                  <router-link :to="`/lesson/${lesson.id}`" class="table-action-btn">
                    {{ getLessonStatus(lesson.id) ? 'Review' : 'Start' }}
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { lessonsData, getLessonProgress } from '../assets/data.js'; 

const selectedDomain = ref('all');
const selectedStatus = ref('all');
const searchQuery = ref('');
const currentSort = ref({ field: 'title', direction: 'asc' });

const getLessonStatus = (id) => {
  return getLessonProgress(id).completed;
};

const filteredLessons = computed(() => {
  let result = [...lessonsData];

  if (selectedDomain.value !== 'all') {
    result = result.filter(l => l.domain === selectedDomain.value);
  }

  if (selectedStatus.value !== 'all') {
    const isComp = selectedStatus.value === 'completed';
    result = result.filter(l => getLessonStatus(l.id) === isComp);
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(l => l.title.toLowerCase().includes(q));
  }

  result.sort((a, b) => {
    let aVal = a[currentSort.value.field];
    let bVal = b[currentSort.value.field];
    if (currentSort.value.direction === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  return result;
});

const toggleSort = (field) => {
  if (currentSort.value.field === field) {
    currentSort.value.direction = currentSort.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.value.field = field;
    currentSort.value.direction = 'asc';
  }
};
</script>

<style scoped>
@import '../assets/styles.css';
.sortable { cursor: pointer; }
.sortable:hover { color: var(--color-primary); }
</style>