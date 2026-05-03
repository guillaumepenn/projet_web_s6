<template>
  <!-- Main container shown only if currentLesson data exists -->
  <div class="lesson-page" v-if="currentLesson">
    <!-- Header Section -->
    <section class="lesson-header">
      <div class="container">
        <!-- Back link emitting an event to return to the catalog -->
        <a href="#" class="back-link" @click.prevent="$emit('back')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Lessons
        </a>
        
        <div class="lesson-title-block">
          <span :class="['lesson-domain-badge', currentLesson.domain]">{{ currentLesson.domain }}</span>
          <h1>{{ currentLesson.title }}</h1>
          <p>{{ currentLesson.description }}</p>
          <div class="lesson-meta">
            <span class="meta-item">⏱ {{ currentLesson.duration }}</span>
            <span class="meta-item">📚 {{ currentLesson.sections?.length || 0 }} sections</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Progress Tracking Section -->
    <section class="progress-section">
      <div class="container">
        <div class="progress-wrapper">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <span class="progress-text">{{ progressPercent }}% completed</span>
        </div>
      </div>
    </section>

    <!-- Lesson Content (Accordion style) -->
    <section class="lesson-content">
      <div class="container">
        <div class="accordion">
          <!-- Iterate through each section of the lesson -->
          <div 
            v-for="(section, index) in currentLesson.sections" 
            :key="section.id" 
            :class="['accordion-item', { 'completed': isSectionDone(section.id) }]"
          >
            <button class="accordion-header" @click="toggleSection(index)">
              <span class="accordion-number">0{{ index + 1 }}</span>
              <span class="accordion-title">{{ section.title }}</span>
              <span class="accordion-status">
                <svg v-if="isSectionDone(section.id)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <svg :class="['accordion-chevron', { 'rotated': activeSection === index }]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <!-- Collapsible content body -->
            <div class="accordion-content" v-show="activeSection === index">
              <div class="accordion-body">
                <p>{{ section.text }}</p>
                <button 
                  @click="markRead(section.id)" 
                  class="mark-complete-btn"
                  :class="{ 'marked': isSectionDone(section.id) }"
                  :disabled="isSectionDone(section.id)"
                >
                  {{ isSectionDone(section.id) ? 'Already read' : 'Mark as read' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action visible only when the lesson is fully completed -->
        <div class="quiz-cta" v-if="progressPercent === 100">
          <h3>Well done! Lesson completed.</h3>
          <button class="btn btn-primary">Start Quiz</button>
        </div>
      </div>
    </section>
  </div>

  <!-- Fallback loading state -->
  <div v-else class="container" style="padding: 100px; text-align: center;">
    <p>Loading lesson (ID: {{ props.LessonId }})...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps } from 'vue';
import { lessonsData, getLessonProgress, updateLessonProgress } from '../assets/data.js';

const props = defineProps({
  LessonId: {
    type: Number,
    default: 1
  }
});

/**
 * Local State
 */
const activeSection = ref(0);
const userProgress = ref({ completed: false, sectionsCompleted: [] });

/**
 * Finds the specific lesson in the dataset using the ID prop
 */
const currentLesson = computed(() => {
  return lessonsData.find(lesson => lesson.id == props.LessonId);
});

/**
 * Loads the user's progress from storage when the component mounts
 */
onMounted(() => {
  if (currentLesson.value) {
    const savedProgress = getLessonProgress(currentLesson.value.id);
    if (savedProgress) {
      userProgress.value = savedProgress;
    }
  }
});

/**
 * Checks if a specific section ID exists in the user's completed list
 */
const isSectionDone = (sectionId) => {
  return userProgress.value.sectionsCompleted?.includes(sectionId) || false;
};

/**
 * Toggles the visibility of the accordion sections
 */
const toggleSection = (index) => {
  activeSection.value = activeSection.value === index ? null : index;
};

/**
 * Triggers the progress update and refreshes the local state
 */
const markRead = (sectionId) => {
  if (currentLesson.value) {
    userProgress.value = updateLessonProgress(currentLesson.value.id, sectionId);
  }
};

/**
 * Calculates the percentage of completion based on sections read
 */
const progressPercent = computed(() => {
  if (!currentLesson.value || !currentLesson.value.sections) return 0;
  const total = currentLesson.value.sections.length;
  const done = userProgress.value.sectionsCompleted?.length || 0;
  return Math.round((done / total) * 100);
});
</script>

<style scoped>
.rotated { transform: rotate(180deg); transition: transform 0.3s; }
.accordion-item.completed { border-left: 4px solid #2ecc71; }
.mark-complete-btn.marked { background-color: #f8f9fa; color: #95a5a6; cursor: default; }
</style>