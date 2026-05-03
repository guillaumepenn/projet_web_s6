<template>
  <div class="profile-page">
    <!-- Profile Header -->
    <section class="profile-header">
      <div class="container">
        <div class="profile-header-content">
          <div class="profile-avatar-large-wrapper">
            <img :src="userAvatar" alt="Photo de profil" class="profile-avatar-large">
          </div>
          <div class="profile-info">
            <h1>{{ userData.name || 'Utilisateur' }}</h1>
            <p class="profile-email">{{ userData.email || 'email@example.com' }}</p>
            <p class="profile-member-since">
              Membre depuis <span>{{ formattedJoinDate }}</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Overview -->
    <section class="profile-stats-section">
      <div class="container">
        <div class="profile-stats-grid">
          <!-- Leçons terminées -->
          <div class="profile-stat-card">
            <div class="profile-stat-icon lessons-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              </svg>
            </div>
            <div class="profile-stat-content">
              <span class="profile-stat-number">{{ stats.lessonsCompletedCount }}</span>
              <span class="profile-stat-label">Leçons terminées</span>
            </div>
            <div class="profile-stat-progress">
              <div class="profile-stat-progress-bar">
                <div class="profile-stat-progress-fill" :style="{ width: stats.lessonsPercent + '%' }"></div>
              </div>
              <span class="profile-stat-progress-text">{{ stats.lessonsPercent }}%</span>
            </div>
          </div>

          <!-- Quizz effectués -->
          <div class="profile-stat-card">
            <div class="profile-stat-icon quizzes-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
              </svg>
            </div>
            <div class="profile-stat-content">
              <span class="profile-stat-number">{{ stats.quizzesCompletedCount }}</span>
              <span class="profile-stat-label">Quizz effectués</span>
            </div>
            <div class="profile-stat-progress">
              <div class="profile-stat-progress-bar">
                <div class="profile-stat-progress-fill" :style="{ width: stats.quizzesPercent + '%' }"></div>
              </div>
              <span class="profile-stat-progress-text">{{ stats.quizzesPercent }}%</span>
            </div>
          </div>

          <!-- Score moyen -->
          <div class="profile-stat-card">
            <div class="profile-stat-icon average-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
              </svg>
            </div>
            <div class="profile-stat-content">
              <span class="profile-stat-number">{{ stats.quizzesCompletedCount > 0 ? stats.averageScore + '%' : '-' }}</span>
              <span class="profile-stat-label">Score moyen</span>
            </div>
            <div class="profile-stat-detail">
              <span class="profile-stat-detail-text">
                {{ stats.quizzesCompletedCount > 0 ? `Sur ${stats.quizzesCompletedCount} quizz effectué(s)` : 'Aucun quizz effectué' }}
              </span>
            </div>
          </div>

          <!-- Meilleur score -->
          <div class="profile-stat-card">
            <div class="profile-stat-icon best-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
            </div>
            <div class="profile-stat-content">
              <span class="profile-stat-number">{{ stats.bestScore > 0 ? stats.bestScore + '%' : '-' }}</span>
              <span class="profile-stat-label">Meilleur score</span>
            </div>
            <div class="profile-stat-detail">
              <span class="profile-stat-detail-text">{{ stats.bestQuizTitle }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Sections -->
    <section class="profile-content-section">
      <div class="container">
        <div class="profile-content-grid">
          <!-- Lessons Progress -->
          <div class="profile-content-card">
            <div class="profile-card-header">
              <h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                </svg>
                Progression des leçons
              </h2>
              <a href="#" @click.prevent="$emit('navigate', 'lessons')" class="profile-card-link">Voir tout</a>
            </div>
            <div class="profile-card-body">
              <div class="profile-lessons-list">
                <div v-for="lesson in lessonsData" :key="lesson.id" 
                     :class="['profile-lesson-item', { 'completed': getLessonStatus(lesson.id).completed }]">
                  <div class="profile-lesson-status">
                    <svg v-if="getLessonStatus(lesson.id).completed" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check-circle">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <div v-else class="profile-lesson-progress-circle">
                      <svg viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" stroke-width="3"/>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e5a7e" stroke-width="3" :stroke-dasharray="`${getLessonStatus(lesson.id).percent}, 100`"/>
                      </svg>
                    </div>
                  </div>
                  <div class="profile-lesson-info">
                    <span class="profile-lesson-title">{{ lesson.title }}</span>
                    <span :class="['profile-lesson-domain domain-badge', lesson.domain]">{{ lesson.domain }}</span>
                  </div>
                  <div class="profile-lesson-progress-text">
                    {{ getLessonStatus(lesson.id).completed ? 'Terminée' : `${getLessonStatus(lesson.id).count}/5 sections` }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quizzes Results -->
          <div class="profile-content-card">
            <div class="profile-card-header">
              <h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
                </svg>
                Résultats des quizz
              </h2>
              <a href="#" @click.prevent="$emit('navigate', 'quizzes')" class="profile-card-link">Voir tout</a>
            </div>
            <div class="profile-card-body">
              <div class="profile-quizzes-list">
                <div v-for="quiz in quizzesData" :key="quiz.id" 
                     :class="['profile-quiz-item', { 'completed': getQuizStatus(quiz.id).completed }]">
                  <div class="profile-quiz-info">
                    <span class="profile-quiz-title">{{ quiz.title }}</span>
                    <span :class="['profile-quiz-domain domain-badge', quiz.domain]">{{ quiz.domain }}</span>
                  </div>
                  <div :class="['profile-quiz-score', getScoreClass(getQuizStatus(quiz.id).percentage)]">
                    <template v-if="getQuizStatus(quiz.id).completed">
                      <span class="score-value">{{ getQuizStatus(quiz.id).percentage }}%</span>
                      <span class="score-detail">{{ getQuizStatus(quiz.id).score }}/{{ quiz.questions.length }}</span>
                    </template>
                    <span v-else class="not-completed">Non effectué</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Domain Performance -->
    <section class="profile-domains-section">
      <div class="container">
        <div class="profile-content-card full-width">
          <div class="profile-card-header">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
              </svg>
              Performance par domaine
            </h2>
          </div>
          <div class="profile-card-body">
            <div class="profile-domains-grid">
              <div v-for="(data, domain) in domainStats" :key="domain" :class="['profile-domain-card', domain]">
                <div :class="['profile-domain-icon', domain]" v-html="getDomainIcon(domain)"></div>
                <h3 class="profile-domain-name">{{ capitalize(domain) }}</h3>
                <div class="profile-domain-stats">
                  <div class="profile-domain-stat">
                    <span class="label">Leçons</span>
                    <span class="value">{{ data.lessonsCompleted }}/{{ data.lessonsTotal }}</span>
                  </div>
                  <div class="profile-domain-stat">
                    <span class="label">Quizz</span>
                    <span class="value">{{ data.quizzesCompleted }}/{{ data.quizzesTotal }}</span>
                  </div>
                  <div class="profile-domain-stat">
                    <span class="label">Score moyen</span>
                    <span :class="['value', getScoreClass(data.avgScore)]">
                      {{ data.quizzesCompleted > 0 ? data.avgScore + '%' : '-' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { lessonsData, quizzesData } from '../assets/data.js';

// --- LOGIQUE UTILISATEUR ---
// On simule l'utilisateur qui serait dans le localStorage ou un store
const userData = JSON.parse(localStorage.getItem('user') || '{"name": "Utilisateur", "email": "email@example.com", "joinDate": null}');

const userAvatar = computed(() => {
  return userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=1e5a7e&color=fff&size=120`;
});

const formattedJoinDate = computed(() => {
  const date = userData.joinDate ? new Date(userData.joinDate) : new Date();
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
});

// --- LOGIQUE PROGRESSION ---
const lessonsProgress = JSON.parse(localStorage.getItem('lessonsProgress') || '{}');
const quizzesProgress = JSON.parse(localStorage.getItem('quizzesProgress') || '{}');

// Calcul des statistiques globales
const stats = computed(() => {
  // Leçons
  const lpValues = Object.values(lessonsProgress);
  const lessonsCompletedCount = lpValues.filter(l => l.completed).length;
  const lessonsPercent = lessonsData.length > 0 ? Math.round((lessonsCompletedCount / lessonsData.length) * 100) : 0;

  // Quizz
  const qpEntries = Object.entries(quizzesProgress);
  const quizzesCompletedCount = qpEntries.filter(([q]) => q.completed).length;
  const quizzesPercent = quizzesData.length > 0 ? Math.round((quizzesCompletedCount / quizzesData.length) * 100) : 0;

  let totalScore = 0;
  let bestScore = 0;
  let bestQuizId = null;

  qpEntries.forEach(([id, q]) => {
    if (q.completed) {
      totalScore += q.percentage || 0;
      if (q.percentage > bestScore) {
        bestScore = q.percentage;
        bestQuizId = id;
      }
    }
  });

  const averageScore = quizzesCompletedCount > 0 ? Math.round(totalScore / quizzesCompletedCount) : 0;
  const bestQuiz = quizzesData.find(q => q.id == bestQuizId);

  return {
    lessonsCompletedCount,
    lessonsPercent,
    quizzesCompletedCount,
    quizzesPercent,
    averageScore,
    bestScore,
    bestQuizTitle: bestQuiz ? bestQuiz.title.replace('Quiz: ', '') : '-'
  };
});

// --- HELPERS POUR LES LISTES ---
const getLessonStatus = (id) => {
  const p = lessonsProgress[id] || { completed: false, sectionsCompleted: [] };
  const count = p.sectionsCompleted?.length || 0;
  return { completed: p.completed, count, percent: Math.round((count / 5) * 100) };
};

const getQuizStatus = (id) => {
  return quizzesProgress[id] || { completed: false, score: 0, percentage: 0 };
};

const getScoreClass = (pct) => {
  if (!pct && pct !== 0) return '';
  if (pct >= 80) return 'high';
  if (pct >= 50) return 'medium';
  return 'low';
};

// --- STATISTIQUES PAR DOMAINE ---
const domainStats = computed(() => {
  const domains = ['astronomy', 'biology', 'chemistry', 'physics', 'geology'];
  const results = {};

  domains.forEach(d => {
    const lessonsInDomain = lessonsData.filter(l => l.domain === d);
    const quizzesInDomain = quizzesData.filter(q => q.domain === d);
    
    const lessonsCompleted = lessonsInDomain.filter(l => lessonsProgress[l.id]?.completed).length;
    const quizzesCompleted = quizzesInDomain.filter(q => quizzesProgress[q.id]?.completed).length;
    
    let totalScore = 0;
    quizzesInDomain.forEach(q => {
      totalScore += quizzesProgress[q.id]?.percentage || 0;
    });

    results[d] = {
      lessonsTotal: lessonsInDomain.length,
      lessonsCompleted,
      quizzesTotal: quizzesInDomain.length,
      quizzesCompleted,
      avgScore: quizzesCompleted > 0 ? Math.round(totalScore / quizzesCompleted) : 0
    };
  });
  return results;
});

const getDomainIcon = (domain) => {
  const icons = {
    astronomy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
    biology: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c6-3 10-9 10-15-4 0-8 2-10 6-2-4-6-6-10-6 0 6 4 12 10 15z"/></svg>',
    chemistry: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31M14 9.3V2M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96"/></svg>',
    physics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 1 0 10 10M12 2a10 10 0 0 1 10 10"/></svg>',
    geology: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>'
  };
  return icons[domain] || icons.astronomy;
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
</script>

<style scoped>
/* Tu peux coller ici tes styles CSS s'ils ne sont pas déjà en global */
.profile-lesson-item.completed { border-left: 4px solid #2ecc71; }
.score-value.high { color: #2ecc71; font-weight: bold; }
.score-value.medium { color: #f1c40f; }
.score-value.low { color: #e74c3c; }
.check-circle { color: #2ecc71; }
@import '../assets/styles.css';
</style>