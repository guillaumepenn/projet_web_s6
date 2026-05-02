<template>
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1>Explorez le monde des sciences</h1>
                <p>Découvrez les mystères de l'univers à travers nos leçons interactives et testez vos connaissances avec nos quizz passionnants.</p>
                <div class="hero-buttons">
                    <a href="lessons.html" class="btn btn-primary">Commencer à apprendre</a>
                    <a href="quizzes.html" class="btn btn-secondary">Voir les quizz</a>
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
                <p>La science est une méthode d'exploration du monde qui nous entoure. Elle nous permet de comprendre les phénomènes naturels, de l'infiniment petit aux confins de l'univers. Plongez dans cette aventure intellectuelle fascinante.</p>
            </div>
        </div>
    </section>

    <!-- Carousel Section -->
    <section class="carousel-section">
        <div class="container">
            <h2 class="section-title">Découvrez nos domaines</h2>
            <div class="carousel-wrapper">
                <button class="carousel-btn carousel-btn-prev" aria-label="Précédent">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                </button>
                <div class="carousel">
                    <div class="carousel-track">
                        <div class="carousel-slide">
                            <div class="domain-card">
                                <div class="domain-icon astronomy">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <circle cx="12" cy="12" r="4"/>
                                        <line x1="21.17" y1="8" x2="12" y2="8"/>
                                        <line x1="3.95" y1="6.06" x2="8.54" y2="14"/>
                                        <line x1="10.88" y1="21.94" x2="15.46" y2="14"/>
                                    </svg>
                                </div>
                                <h3>Astronomie</h3>
                                <p>Explorez les étoiles, les planètes et les mystères de l'univers.</p>
                                <a href="lesson.html" class="domain-link">Découvrir</a>
                            </div>
                        </div>
                        <div class="carousel-slide">
                            <div class="domain-card">
                                <div class="domain-icon biology">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M2 22c1.25-.987 2.27-1.975 3.9-2.2a5.56 5.56 0 0 1 3.8 1.5 4 4 0 0 0 6.187-2.353 3.5 3.5 0 0 0 3.69-5.116A3.5 3.5 0 0 0 20.95 8 3.5 3.5 0 1 0 16 3.05a3.5 3.5 0 0 0-5.831 1.373 3.5 3.5 0 0 0-5.116 3.69 4 4 0 0 0-2.348 6.155C3.499 15.42 4.409 16.712 4.2 18.1 3.926 19.743 3.014 20.732 2 22"/>
                                    </svg>
                                </div>
                                <h3>Biologie</h3>
                                <p>Découvrez les secrets du vivant et de l'évolution des espèces.</p>
                                <a href="lesson.html" class="domain-link">Découvrir</a>
                            </div>
                        </div>
                        <div class="carousel-slide">
                            <div class="domain-card">
                                <div class="domain-icon chemistry">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M10 2v7.31"/>
                                        <path d="M14 9.3V1.99"/>
                                        <path d="M8.5 2h7"/>
                                        <path d="M14 9.3a6.5 6.5 0 1 1-4 0"/>
                                        <path d="M5.52 16h12.96"/>
                                    </svg>
                                </div>
                                <h3>Chimie</h3>
                                <p>Comprenez les réactions et la composition de la matière.</p>
                                <a href="lesson.html" class="domain-link">Découvrir</a>
                            </div>
                        </div>
                        <div class="carousel-slide">
                            <div class="domain-card">
                                <div class="domain-icon physics">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="3"/>
                                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                                    </svg>
                                </div>
                                <h3>Physique</h3>
                                <p>Apprenez les lois fondamentales qui régissent notre univers.</p>
                                <a href="lesson.html" class="domain-link">Découvrir</a>
                            </div>
                        </div>
                        <div class="carousel-slide">
                            <div class="domain-card">
                                <div class="domain-icon geology">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
                                    </svg>
                                </div>
                                <h3>Géologie</h3>
                                <p>Étudiez la Terre, ses roches et ses phénomènes naturels.</p>
                                <a href="lesson.html" class="domain-link">Découvrir</a>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="carousel-btn carousel-btn-next" aria-label="Suivant">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </button>
            </div>
            <div class="carousel-dots"></div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
        <div class="container">
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number" data-target="25">0</span>
                    <span class="stat-label">Leçons disponibles</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number" data-target="25">0</span>
                    <span class="stat-label">Quizz interactifs</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number" data-target="5">0</span>
                    <span class="stat-label">Domaines scientifiques</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import '../assets/general.js'
</script>

<style>
    @import '../assets/styles.css';
</style>