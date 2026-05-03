<template>
  <div>
    <!-- Page Header with descriptive text -->
    <section class="page-header">
      <div class="container">
        <h1>Educational Catalog</h1>
        <p>Explore our complete science lesson catalog and track your progress.</p>
      </div>
    </section>

    <!-- Filters and Search Bar -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-bar">
          <!-- Domain Filter -->
          <div class="filter-group">
            <label>Field:</label>
            <select v-model="selectedDomain" class="filter-select">
              <option value="all">All fields</option>
              <option value="astronomy">Astronomy</option>
              <option value="biology">Biology</option>
              <option value="chemistry">Chemistry</option>
              <option value="physics">Physics</option>
              <option value="geology">Geology</option>
              <option value="botany">Botany</option>
            </select>
          </div>
          
          <!-- Progress Status Filter -->
          <div class="filter-group">
            <label>Status:</label>
            <select v-model="selectedStatus" class="filter-select">
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="not-completed">Not completed</option>
            </select>
          </div>

          <!-- Text Search -->
          <div class="search-group">
            <input 
              type="text" 
              v-model="searchQuery" 
              class="search-input" 
              placeholder="Search for a specific lesson..."
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Lessons Table -->
    <section class="table-section">
      <div class="container">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th @click="toggleSort('title')" class="sortable">Title</th>
                <th @click="toggleSort('domain')" class="sortable">Field</th>
                <th @click="toggleSort('duration')" class="sortable">Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <!-- Empty state if no lessons match filters -->
              <tr v-if="filteredLessons.length === 0">
                <td colspan="5" style="text-align: center; padding: 2rem;">
                  No lessons found matching your criteria.
                </td>
              </tr>
              <!-- List of filtered lessons -->
              <tr v-for="lesson in filteredLessons" :key="lesson.id">
                <td><strong>{{ lesson.title }}</strong></td>
                <td><span :class="['domain-badge', lesson.domain]">{{ lesson.domain }}</span></td>
                <td>{{ lesson.duration }}</td>
                <td>
                  <span v-if="getLessonStatus(lesson.id)" class="status-badge completed">Completed</span>
                  <span v-else class="status-badge not-completed">Not completed</span>
                </td>
                <td>
                  <!-- Navigation to specific dynamic lesson route -->
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

// --- STATE ---
const selectedDomain = ref('all');
const selectedStatus = ref('all');
const searchQuery = ref('');
const currentSort = ref({ field: 'title', direction: 'asc' });

/**
 * Checks if a specific lesson has been marked as completed in the data store
 */
const getLessonStatus = (id) => {
  return getLessonProgress(id).completed;
};

/**
 * Computed property that handles filtering and sorting of the lessons list
 */
const filteredLessons = computed(() => {
  let result = [...lessonsData];

  // Filter by scientific domain
  if (selectedDomain.value !== 'all') {
    result = result.filter(l => l.domain === selectedDomain.value);
  }

  // Filter by completion status
  if (selectedStatus.value !== 'all') {
    const isComp = selectedStatus.value === 'completed';
    result = result.filter(l => getLessonStatus(l.id) === isComp);
  }

  // Filter by search query (case-insensitive)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(l => l.title.toLowerCase().includes(q));
  }

  // Sort results based on currentSort state
  result.sort((a, b) => {
    let aVal = a[currentSort.value.field];
    let bVal = b[currentSort.value.field];
    if (currentSort.value.direction === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  return result;
});

/**
 * Toggles the sorting direction or changes the sorted field
 */
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
.sortable { 
  cursor: pointer; 
  transition: color 0.2s;
}
.sortable:hover { 
  color: #1e5a7e; 
}

</style>