<template>
  <div class="quiz-page" v-if="currentQuiz">
    <!-- Header Dynamique -->
    <section class="quiz-header">
      <div class="container">
        <router-link :to="{ name: 'Quizzes' }" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Retour aux quizz
        </router-link>
        <div class="quiz-title-block">
          <span class="quiz-domain-badge">{{ currentQuiz.domain }}</span>
          <h1>Quizz : {{ currentQuiz.title }}</h1>
          <p>{{ currentQuiz.description }}</p>
        </div>
      </div>
    </section>

    <!-- Barre de Progression -->
    <section class="quiz-progress-section" v-if="!quizFinished">
      <div class="container">
        <div class="quiz-progress-wrapper">
          <div class="quiz-progress-info">
            <span>Question {{ currentIndex + 1 }} sur {{ totalQuestions }}</span>
          </div>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contenu du Quiz -->
    <section class="quiz-content">
      <div class="container">
        
        <!-- Écran des Questions -->
        <div v-if="!quizFinished" class="quiz-container">
          <div class="quiz-question-card">
            <h2 class="question-text">{{ currentQuestion.question }}</h2>
            
            <div class="answers-grid">
              <button 
                v-for="answer in currentQuestion.answers" 
                :key="answer.id"
                :class="['answer-btn', { 'selected': userAnswers[currentIndex] === answer.id }]"
                @click="selectAnswer(answer.id)"
              >
                <span class="answer-letter">{{ answer.id.toUpperCase() }}</span>
                <span class="answer-text">{{ answer.text }}</span>
              </button>
            </div>

            <div class="question-actions">
              <button class="btn btn-secondary" @click="prevQuestion" :disabled="currentIndex === 0">
                Précédent
              </button>
              <button class="btn btn-primary" @click="nextQuestion">
                {{ currentIndex === totalQuestions - 1 ? 'Terminer' : 'Suivant' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Écran des Résultats (Conditionnel) -->
        <div v-else class="quiz-results">
          <div class="results-card">
            <div class="results-icon" :class="{ 'low-score': scorePercent < 50 }">
               <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
            </div>
            <h2 class="results-title">{{ resultMessage.title }}</h2>
            <p class="results-subtitle">{{ resultMessage.subtitle }}</p>
            
            <div class="score-display">
              <span class="score-value">{{ finalScore }}</span>
              <span class="score-separator">/</span>
              <span class="score-total">{{ totalQuestions }}</span>
            </div>
            
            <div class="results-actions">
              <button class="btn btn-secondary" @click="resetQuiz">Recommencer</button>
              <router-link :to="`/lesson/${currentQuiz.id}`" class="btn btn-primary">Revoir la leçon</router-link>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
// On imagine que tu as mis tes questions dans data.js
import { quizzesData } from '../assets/data.js'; 

const route = useRoute();
const currentIndex = ref(0);
const userAnswers = ref([]);
const quizFinished = ref(false);

// 1. Récupérer le quiz selon l'ID
const currentQuiz = computed(() => {
  const id = parseInt(route.params.id);
  return quizzesData.find(q => q.id === id);
});

// 2. Question actuelle
const currentQuestion = computed(() => currentQuiz.value.questions[currentIndex.value]);
const totalQuestions = computed(() => currentQuiz.value.questions.length);

// 3. Navigation
const selectAnswer = (id) => {
  userAnswers.value[currentIndex.value] = id;
};

const nextQuestion = () => {
  if (userAnswers.value[currentIndex.value] === undefined) {
    alert("Veuillez sélectionner une réponse !");
    return;
  }
  
  if (currentIndex.value < totalQuestions.value - 1) {
    currentIndex.value++;
  } else {
    quizFinished.value = true;
  }
};

const prevQuestion = () => {
  if (currentIndex.value > 0) currentIndex.value--;
};

// 4. Calcul du score
const finalScore = computed(() => {
  let score = 0;
  currentQuiz.value.questions.forEach((q, index) => {
    if (userAnswers.value[index] === q.correctAnswer) score++;
  });
  return score;
});

const scorePercent = computed(() => Math.round((finalScore.value / totalQuestions.value) * 100));

// 5. Messages de fin
const resultMessage = computed(() => {
  if (scorePercent.value >= 80) return { title: "Excellent !", subtitle: "Tu es un expert !" };
  if (scorePercent.value >= 50) return { title: "Bien joué !", subtitle: "Pas mal du tout." };
  return { title: "Continue tes efforts !", subtitle: "Relis la leçon et réessaye." };
});

const resetQuiz = () => {
  currentIndex.value = 0;
  userAnswers.value = [];
  quizFinished.value = false;
};

const progressPercent = computed(() => ((currentIndex.value + 1) / totalQuestions.value) * 100);
</script>

<style>
    @import '../assets/styles.css';
</style>