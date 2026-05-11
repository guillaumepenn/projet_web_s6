<template>
  <div class="quiz-page" v-if="currentQuiz && currentQuestion">
    <section class="quiz-header">
      <div class="container">
        <router-link to="/quizzes" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Quizzes
        </router-link>
        <div class="quiz-title-block">
          <span :class="['quiz-domain-badge', currentQuiz.domain]">{{ currentQuiz.domain }}</span>
          <h1>{{ currentQuiz.title }}</h1>

          <!-- Lien vers la leçon associée -->
          <div class="related-lesson" v-if="relatedLesson">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Related lesson:
            <router-link :to="`/lesson/${relatedLesson.id}`" class="lesson-link">
              {{ relatedLesson.title }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Barre de progression (pendant le quiz) -->
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

        <!-- État : question en cours -->
        <div v-if="!quizFinished" class="quiz-container">
          <div class="quiz-question-card">

            <!-- Contexte de la leçon associée à cette question -->
            <div class="question-lesson-hint" v-if="currentQuestion.lessonSection && relatedLesson">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              From lesson: <em>{{ currentQuestion.lessonSection }}</em>
            </div>

            <h2 class="question-text">{{ currentQuestion.question }}</h2>

            <div class="answers-grid">
              <button
                v-for="answer in currentQuestion.answers"
                :key="answer.id"
                :class="['answer-btn', {
                  'selected': userAnswers[currentIndex] === answer.id,
                  'correct': showFeedback && answer.id === currentQuestion.correctAnswer,
                  'wrong': showFeedback && userAnswers[currentIndex] === answer.id && answer.id !== currentQuestion.correctAnswer
                }]"
                @click="selectAnswer(answer.id)"
                :disabled="showFeedback"
              >
                <span class="answer-letter">{{ answer.id.toUpperCase() }}</span>
                <span class="answer-text">{{ answer.text }}</span>
              </button>
            </div>

            <!-- Feedback immédiat après réponse -->
            <div class="answer-feedback" v-if="showFeedback">
              <div :class="['feedback-box', lastAnswerCorrect ? 'correct' : 'wrong']">
                <span v-if="lastAnswerCorrect">✅ Correct!</span>
                <span v-else>
                  ❌ Wrong — the correct answer was:
                  <strong>{{ correctAnswerText }}</strong>
                </span>
              </div>
            </div>

            <div class="question-actions">
              <button class="btn btn-secondary" @click="prevQuestion" :disabled="currentIndex === 0">Previous</button>
              <button class="btn btn-primary" @click="nextQuestion">
                {{ currentIndex === totalQuestions - 1 ? 'Finish' : 'Next' }}
              </button>
            </div>
          </div>
        </div>

        <!-- État : résultats finaux -->
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

            <!-- Récapitulatif question par question -->
            <div class="results-breakdown">
              <h3>Review</h3>
              <div
                v-for="(q, index) in currentQuiz.questions"
                :key="q.id"
                :class="['breakdown-item', userAnswers[index] === q.correctAnswer ? 'correct' : 'wrong']"
              >
                <span class="breakdown-icon">{{ userAnswers[index] === q.correctAnswer ? '✅' : '❌' }}</span>
                <div class="breakdown-content">
                  <p class="breakdown-question">{{ q.question }}</p>
                  <p class="breakdown-answer" v-if="userAnswers[index] !== q.correctAnswer">
                    Your answer: <strong>{{ getAnswerText(q, userAnswers[index]) }}</strong>
                    — Correct: <strong>{{ getAnswerText(q, q.correctAnswer) }}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div class="results-actions">
              <button class="btn btn-secondary" @click="resetQuiz">Try Again</button>
              <router-link v-if="relatedLesson" :to="`/lesson/${relatedLesson.id}`" class="btn btn-primary">
                Review Lesson
              </router-link>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>

  <div v-else class="container" style="padding: 50px; text-align: center;">
    <h2>Loading quiz...</h2>
    <p>Please wait while we retrieve the questions.</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { quizzesData, lessonsData } from '../assets/data.js';

const route = useRoute();
const currentIndex = ref(0);
const userAnswers = ref([]);
const quizFinished = ref(false);
const showFeedback = ref(false);
const lastAnswerCorrect = ref(false);

// Charge le quiz depuis l'id dans l'URL
const currentQuiz = computed(() => {
  return quizzesData.find(q => q.id == route.params.id);
});

// Leçon associée au quiz (via relatedLesson)
const relatedLesson = computed(() => {
  if (!currentQuiz.value?.relatedLesson) return null;
  return lessonsData.find(l => l.id === currentQuiz.value.relatedLesson) || null;
});

const currentQuestion = computed(() => {
  if (!currentQuiz.value?.questions) return null;
  return currentQuiz.value.questions[currentIndex.value];
});

const totalQuestions = computed(() => currentQuiz.value?.questions.length || 0);

// Texte de la bonne réponse (pour le feedback)
const correctAnswerText = computed(() => {
  if (!currentQuestion.value) return '';
  const correct = currentQuestion.value.answers.find(a => a.id === currentQuestion.value.correctAnswer);
  return correct?.text || '';
});

const selectAnswer = (id) => {
  if (showFeedback.value) return;
  userAnswers.value[currentIndex.value] = id;
  lastAnswerCorrect.value = id === currentQuestion.value.correctAnswer;
  showFeedback.value = true;
};

const nextQuestion = () => {
  if (userAnswers.value[currentIndex.value] === undefined) {
    alert('Please select an answer before continuing!');
    return;
  }
  showFeedback.value = false;
  if (currentIndex.value < totalQuestions.value - 1) {
    currentIndex.value++;
  } else {
    quizFinished.value = true;
  }
};

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    showFeedback.value = false;
    currentIndex.value--;
  }
};

const finalScore = computed(() => {
  if (!currentQuiz.value) return 0;
  return currentQuiz.value.questions.reduce((score, q, index) => {
    return score + (userAnswers.value[index] === q.correctAnswer ? 1 : 0);
  }, 0);
});

const scorePercent = computed(() => {
  if (totalQuestions.value === 0) return 0;
  return Math.round((finalScore.value / totalQuestions.value) * 100);
});

const resultMessage = computed(() => {
  if (scorePercent.value >= 80) return { title: 'Excellent!', subtitle: 'You are an expert!' };
  if (scorePercent.value >= 50) return { title: 'Well done!', subtitle: 'Great effort.' };
  return { title: 'Keep practicing!', subtitle: 'Review the lesson and try again.' };
});

const getAnswerText = (question, answerId) => {
  return question.answers.find(a => a.id === answerId)?.text || '—';
};

const resetQuiz = () => {
  currentIndex.value = 0;
  userAnswers.value = [];
  quizFinished.value = false;
  showFeedback.value = false;
};

const progressPercent = computed(() => {
  if (totalQuestions.value === 0) return 0;
  return ((currentIndex.value + 1) / totalQuestions.value) * 100;
});
</script>

<style scoped>
.rotated { transform: rotate(180deg); transition: transform 0.3s; }

/* Badge domaine */
.quiz-domain-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
  background: rgba(255,255,255,0.15);
  color: white;
}

/* Lien vers la leçon associée */
.related-lesson {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  opacity: 0.85;
  margin-top: 8px;
  color: inherit;
}
.lesson-link {
  color: #f0c040;
  font-weight: 600;
  text-decoration: underline;
}
.lesson-link:hover { opacity: 0.85; }

/* Hint de section de leçon */
.question-lesson-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 6px 10px;
}

/* Feedback immédiat */
.answer-feedback { margin-top: 16px; }
.feedback-box {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
}
.feedback-box.correct { background: #d4edda; color: #155724; }
.feedback-box.wrong   { background: #f8d7da; color: #721c24; }

/* Réponses avec états correct/wrong */
.answer-btn.correct { border-color: #2ecc71 !important; background: #d4edda !important; }
.answer-btn.wrong   { border-color: #e74c3c !important; background: #f8d7da !important; }

/* Récapitulatif résultats */
.results-breakdown {
  margin: 24px 0;
  text-align: left;
}
.results-breakdown h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #333;
}
.breakdown-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 0.88rem;
}
.breakdown-item.correct { background: #f0faf4; }
.breakdown-item.wrong   { background: #fff5f5; }
.breakdown-icon { font-size: 1rem; flex-shrink: 0; margin-top: 2px; }
.breakdown-question { margin: 0 0 4px; font-weight: 500; color: #333; }
.breakdown-answer { margin: 0; color: #666; }

/* Actions résultats */
.results-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 16px;
}

/* Barre de progression */
.quiz-progress-bar {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 8px;
}
.quiz-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.4s ease;
}
</style>