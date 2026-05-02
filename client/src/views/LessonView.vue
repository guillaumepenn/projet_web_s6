<!-- eslint-disable -->
<template>
  <div class="lesson-page" v-if="currentLesson">
    <!-- Header de la Leçon -->
    <section class="lesson-header">
      <div class="container">
        <router-link to="/lessons" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Retour aux leçons
        </router-link>
        
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

    <!-- Barre de Progression -->
    <section class="progress-section">
      <div class="container">
        <div class="progress-wrapper">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <span class="progress-text">{{ progressPercent }}% complété</span>
        </div>
      </div>
    </section>

    <!-- Contenu (Accordéon Dynamique) -->
    <section class="lesson-content">
      <div class="container">
        <div class="accordion">
          <div 
            v-for="(section, index) in currentLesson.sections" 
            :key="section.id" 
            :class="['accordion-item', { 'completed': isSectionDone(section.id) }]"
          >
            <!-- En-tête de section -->
            <button class="accordion-header" @click="toggleSection(index)" :aria-expanded="activeSection === index">
              <span class="accordion-number">0{{ index + 1 }}</span>
              <span class="accordion-title">{{ section.title }}</span>
              <span class="accordion-status">
                <svg v-if="isSectionDone(section.id)" class="check-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <svg :class="['accordion-chevron', { 'rotated': activeSection === index }]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <!-- Corps de la section -->
            <div class="accordion-content" v-show="activeSection === index">
              <div class="accordion-body">
                <p>{{ section.text }}</p>
                <button 
                  @click="markRead(section.id)" 
                  class="mark-complete-btn"
                  :class="{ 'marked': isSectionDone(section.id) }"
                  :disabled="isSectionDone(section.id)"
                >
                  {{ isSectionDone(section.id) ? 'Déjà lu' : 'Marquer comme lu' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton Quizz Final -->
        <div class="quiz-cta" v-if="progressPercent === 100">
          <div class="quiz-cta-content">
            <h3>Bravo ! Vous avez terminé cette leçon.</h3>
            <p>Prêt à tester vos connaissances avec le quizz ?</p>
          </div>
          <router-link to="/quiz" class="btn btn-primary">Commencer le quizz</router-link>
        </div>
      </div>
    </section>
  </div>
  
  <div v-else class="container">
    <p>Chargement de la leçon ou leçon introuvable...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// On importe les données et les fonctions JS de ton fichier data.js
import { lessonsData, getLessonProgress, updateLessonProgress } from '../assets/data.js';

const route = useRoute();
const activeSection = ref(0); // Ouvre la première section par défaut
const userProgress = ref({ completed: false, sectionsCompleted: [] });

// 1. Logique pour trouver la leçon actuelle selon l'ID dans l'URL
const currentLesson = computed(() => {
  const idFromUrl = parseInt(route.params.id);
  return lessonsData.find(lesson => lesson.id === idFromUrl);
});

// 2. Charger la progression stockée au montage du composant
onMounted(() => {
  if (currentLesson.value) {
    userProgress.value = getLessonProgress(currentLesson.value.id);
  }
});

// 3. Vérifier si une section est terminée
const isSectionDone = (sectionId) => {
  return userProgress.value.sectionsCompleted.includes(sectionId);
};

// 4. Ouvrir/Fermer une section
const toggleSection = (index) => {
  activeSection.value = activeSection.value === index ? null : index;
};

// 5. Action "Marquer comme lu"
const markRead = (sectionId) => {
  // On appelle ta fonction JS originale et on met à jour la ref réactive de Vue
  userProgress.value = updateLessonProgress(currentLesson.value.id, sectionId);
};

// 6. Calcul automatique du pourcentage de progression
const progressPercent = computed(() => {
  if (!currentLesson.value || !currentLesson.value.sections) return 0;
  const total = currentLesson.value.sections.length;
  const done = userProgress.value.sectionsCompleted.length;
  return Math.round((done / total) * 100);
});
</script>

<style scoped>
/* Les styles spécifiques pour l'animation et le look */
.rotated { transform: rotate(180deg); transition: transform 0.3s; }
.accordion-item.completed { border-left: 4px solid #2ecc71; }
.mark-complete-btn.marked { background-color: #f8f9fa; color: #95a5a6; cursor: default; }
</style>