<template>
  <!-- Main container protected by v-if to ensure data is loaded before rendering -->
  <div class="quiz-page" v-if="currentQuiz && currentQuestion">
    <section class="quiz-header">
      <div class="container">
        <!-- Navigation link back to Home -->
        <router-link to="/" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Home
        </router-link>
        <div class="quiz-title-block">
          <span class="quiz-domain-badge">{{ currentQuiz.domain }}</span>
          <h1>Quiz: {{ currentQuiz.title }}</h1>
          <p>{{ currentQuiz.description }}</p>
        </div>
      </div>
    </section>

    <!-- Progress bar visible only while taking the quiz -->
    <section class="quiz-progress-section" v-if="!quizFinished">
      <div class="container">
        <div class="quiz-progress-wrapper">
          <div class="quiz-progress-info">
            <span>Question {{ currentIndex + 1 }} of {{ totalQuestions }}</span>
          </div>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="quiz-content">
      <div class="container">
        <!-- Question display state -->
        <div v-if="!quizFinished" class="quiz-container">
          <div class="quiz-question-card">
            <h2 class="question-text">{{ currentQuestion.question }}</h2>
            <div class="answers-grid">
              <!-- Loop through possible answers for the current question -->
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
              <button class="btn btn-secondary" @click="prevQuestion" :disabled="currentIndex === 0">Previous</button>
              <button class="btn btn-primary" @click="nextQuestion">
                {{ currentIndex === totalQuestions - 1 ? 'Finish' : 'Next' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Results display state shown after finishing -->
        <div v-else class="quiz-results">
          <div class="results-card">
            <div class="results-icon" :class="{ 'low-score': scorePercent < 50 }">
               <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/></svg>
            </div>
            <h2 class="results-title">{{ resultMessage.title }}</h2>
            <p class="results-subtitle">{{ resultMessage.subtitle }}</p>
            <div class="score-display">
              <span class="score-value">{{ finalScore }}</span>
              <span class="score-separator">/</span>
              <span class="score-total">{{ totalQuestions }}</span>
            </div>
            <div class="results-actions">
              <button class="btn btn-secondary" @click="resetQuiz">Try Again</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Loading state shown if quiz data is not yet available -->
  <div v-else class="container" style="padding: 50px; text-align: center;">
      <h2>Loading quiz...</h2>
      <p>Please wait while we retrieve the questions.</p>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';
import { quizzesData } from '../assets/data.js'; 

const props = defineProps({
  quizId: {
    type: Number,
    default: 1
  }
});

/**
 * State Management
 */
const currentIndex = ref(0);
const userAnswers = ref([]);
const quizFinished = ref(false);

/**
 * Retrieves the specific quiz object based on the ID passed via props
 */
const currentQuiz = computed(() => {
  return quizzesData.find(q => q.id === props.quizId);
});

/**
 * Returns the object for the question currently being answered
 */
const currentQuestion = computed(() => {
  if (!currentQuiz.value || !currentQuiz.value.questions) return null;
  return currentQuiz.value.questions[currentIndex.value];
});

const totalQuestions = computed(() => {
  return currentQuiz.value ? currentQuiz.value.questions.length : 0;
});

/**
 * Stores the user's choice for the current question index
 */
const selectAnswer = (id) => {
  userAnswers.value[currentIndex.value] = id;
};

/**
 * Navigates forward or completes the quiz if it's the last question
 */
const nextQuestion = () => {
  if (userAnswers.value[currentIndex.value] === undefined) {
    alert("Please select an answer before continuing!");
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

/**
 * Compares user answers with correct answers to calculate the total points
 */
const finalScore = computed(() => {
  if (!currentQuiz.value) return 0;
  let score = 0;
  currentQuiz.value.questions.forEach((q, index) => {
    if (userAnswers.value[index] === q.correctAnswer) score++;
  });
  return score;
});

const scorePercent = computed(() => {
    if (totalQuestions.value === 0) return 0;
    return Math.round((finalScore.value / totalQuestions.value) * 100);
});

/**
 * Provides dynamic feedback messages based on the final percentage
 */
const resultMessage = computed(() => {
  if (scorePercent.value >= 80) return { title: "Excellent!", subtitle: "You are an expert!" };
  if (scorePercent.value >= 50) return { title: "Well done!", subtitle: "Great effort." };
  return { title: "Keep practicing!", subtitle: "Review the lesson and try again." };
});

const resetQuiz = () => {
  currentIndex.value = 0;
  userAnswers.value = [];
  quizFinished.value = false;
};

/**
 * Calculates the width percentage for the visual progress bar
 */
const progressPercent = computed(() => {
    if (totalQuestions.value === 0) return 0;
    return ((currentIndex.value + 1) / totalQuestions.value) * 100;
});
</script>
