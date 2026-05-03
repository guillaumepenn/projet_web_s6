<template>
    <div>
        <!-- Hero Section -->
        <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <h1>Explorez le monde des sciences</h1>
                    <p>Découvrez les mystères de l'univers à travers nos leçons interactives et testez vos connaissances avec nos quizz passionnants.</p>
                    <div class="hero-buttons">
                        <router-link to="/lessons" class="btn btn-primary">Commencer à apprendre</router-link>
                        <router-link to="/quizzes" class="btn btn-secondary">Voir les quizz</router-link>
                    </div>
                </div>
            </div>
        </section>

        <!-- Introduction Section -->
        <section class="intro-section">
            <div class="container">
                <div class="intro-card">
                    <div class="intro-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                    </div>
                    <h2>Introduction aux Sciences</h2>
                    <p>La science est une méthode d'exploration du monde qui nous entoure. Elle nous permet de comprendre les phénomènes naturels, de l'infiniment petit aux confins de l'univers.</p>
                </div>
            </div>
        </section>

        <!-- Carousel Section -->
        <section class="carousel-section">
            <div class="container">
                <h2 class="section-title">Découvrez nos domaines</h2>
                <div class="carousel-wrapper">
                    
                    <button @click="prevSlide" class="carousel-btn carousel-btn-prev" aria-label="Précédent">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>

                    <div class="carousel-window">
                        <div class="carousel-track" :style="{ 
                            transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`,
                            '--slides-per-view': slidesPerView 
                        }">
                            <!-- UN SEUL v-for qui génère toutes les cartes proprement -->
                            <div v-for="domain in domains" :key="domain.id" class="carousel-slide">
                                <div class="domain-card">
                                    <div :class="['domain-icon', domain.class]" v-html="domain.icon"></div>
                                    <h3>{{ domain.title }}</h3>
                                    <p>{{ domain.description }}</p>
                                    <router-link :to="domain.link" class="domain-link">Découvrir</router-link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button @click="nextSlide" class="carousel-btn carousel-btn-next" aria-label="Suivant">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                </div>

                <div class="carousel-dots">
                    <button 
                        v-for="n in (domains.length - slidesPerView + 1)" 
                        :key="n" 
                        :class="['carousel-dot', { active: currentIndex === n - 1 }]"
                        @click="currentIndex = n - 1">
                    </button>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="stats-section">
            <div class="container">
                <div class="stats-grid">
                    <div v-for="stat in stats" :key="stat.label" class="stat-card">
                        <span class="stat-number">{{ Math.floor(stat.current) }}</span>
                        <span class="stat-label">{{ stat.label }}</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'; 

// --- DONNÉES DES DOMAINES ---
const domains = [
    { id: 1, title: 'Astronomie', class: 'astronomy', description: 'Explorez les étoiles.', link: '/lessons', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></svg>' },
    { id: 2, title: 'Biologie', class: 'biology', description: 'Secrets du vivant.', link: '/lessons', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22c1.25-.987 2.27-1.975 3.9-2.2a5.56 5.56 0 0 1 3.8 1.5 4 4 0 0 0 6.187-2.353 3.5 3.5 0 0 0 3.69-5.116A3.5 3.5 0 0 0 20.95 8 3.5 3.5 0 1 0 16 3.05a3.5 3.5 0 0 0-5.831 1.373 3.5 3.5 0 0 0-5.116 3.69 4 4 0 0 0-2.348 6.155C3.499 15.42 4.409 16.712 4.2 18.1 3.926 19.743 3.014 20.732 2 22"/></svg>' },
    { id: 3, title: 'Chimie', class: 'chemistry', description: 'Matière et réactions.', link: '/lessons', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>' },
    { id: 4, title: 'Physique', class: 'physics', description: 'Lois de l\'univers.', link: '/lessons', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>' },
    { id: 5, title: 'Géologie', class: 'geology', description: 'Étude de la Terre.', link: '/lessons', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>' },
    { id: 6, title: 'Botanique', class: 'botany', description: 'Monde des plantes.', link: '/lessons', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7"/><path d="M9 18c-4.51 2-5-2-7-2 2-2 3.51-1 7-2"/><path d="M15 18c4.51 2 5-2 7-2-2-2-3.51-1-7-2"/><path d="M12 15c4.51 2 5-2 7-2-2-2-3.51-1-7-2"/><path d="M12 15c-4.51 2-5-2-7-2 2-2 3.51-1 7-2"/><path d="M12 10V2"/></svg>' }
];

// --- LOGIQUE CAROUSEL ---
const currentIndex = ref(0);
const slidesPerView = ref(4);

const updateSlidesPerView = () => {
  if (window.innerWidth >= 1280) slidesPerView.value = 4; 
  else if (window.innerWidth >= 1024) slidesPerView.value = 3;
  else if (window.innerWidth >= 640) slidesPerView.value = 2;
  else slidesPerView.value = 1;
};

const nextSlide = () => {
  const max = domains.length - slidesPerView.value;
  currentIndex.value = currentIndex.value >= max ? 0 : currentIndex.value + 1;
};

const prevSlide = () => {
  const max = domains.length - slidesPerView.value;
  currentIndex.value = currentIndex.value <= 0 ? max : currentIndex.value - 1;
};

// --- LOGIQUE STATS ---
const stats = ref([
  { label: 'Leçons disponibles', target: 25, current: 0 },
  { label: 'Quizz interactifs', target: 25, current: 0 },
  { label: 'Domaines scientifiques', target: 5, current: 0 }
]);

const animateStats = () => {
  stats.value.forEach(stat => {
    let start = 0;
    const duration = 2000;
    const increment = stat.target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= stat.target) {
        stat.current = stat.target;
        clearInterval(timer);
      } else {
        stat.current = start;
      }
    }, 16);
  });
};

// --- CYCLE DE VIE ---
let autoPlay;

onMounted(() => {
  updateSlidesPerView();
  window.addEventListener('resize', updateSlidesPerView);
  animateStats();
  autoPlay = setInterval(nextSlide, 7000);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSlidesPerView);
  clearInterval(autoPlay);
});
</script>

<style scoped>
    /* On importe ton CSS global */
    @import '../assets/styles.css';

    /* On force les règles critiques ici pour l'alignement */
    .carousel-window {
        overflow: hidden;
        width: 100%;
    }

    .carousel-track {
        display: flex;
        transition: transform 600ms ease;
        width: 100%;
    }

    .carousel-slide {
        /* On utilise la variable définie en JS */
        flex: 0 0 calc(100% / var(--slides-per-view, 1));
        min-width: calc(100% / var(--slides-per-view, 1));
        padding: 0 10px; /* Espace constant entre les cartes */
        box-sizing: border-box; 
    }

    .domain-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    
    /* Couleur spécifique pour botanique non définie dans ton gradient précédent */
    .domain-icon.botany { background: linear-gradient(135deg, #2e7d32, #1b5e20); }
</style>