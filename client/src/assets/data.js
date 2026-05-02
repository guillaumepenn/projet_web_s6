/**
 * Sample Data for Pluriscience
 * This file contains all the lessons and quizzes data
 * You can modify this data to add more content
 */

export const lessonsData = [
    {
        id: 1,
        title: "Le Système Solaire",
        domain: "astronomie",
        duration: "15 min",
        description: "Découvrez les planètes et objets du système solaire.",
        link: "lesson.html"
    },
    {
        id: 2,
        title: "Les Étoiles et leur Cycle de Vie",
        domain: "astronomie",
        duration: "20 min",
        description: "Apprenez comment naissent et meurent les étoiles.",
        link: "lesson.html"
    },
    {
        id: 3,
        title: "La Cellule : Unité du Vivant",
        domain: "biologie",
        duration: "18 min",
        description: "Explorez la structure et le fonctionnement des cellules.",
        link: "lesson.html"
    },
    {
        id: 4,
        title: "L'ADN et la Génétique",
        domain: "biologie",
        duration: "25 min",
        description: "Comprendre le code génétique et l'hérédité.",
        link: "lesson.html"
    },
    {
        id: 5,
        title: "Les Réactions Chimiques",
        domain: "chimie",
        duration: "15 min",
        description: "Les bases des transformations de la matière.",
        link: "lesson.html"
    },
    {
        id: 6,
        title: "Le Tableau Périodique",
        domain: "chimie",
        duration: "20 min",
        description: "Organisation et propriétés des éléments.",
        link: "lesson.html"
    },
    {
        id: 7,
        title: "Les Lois de Newton",
        domain: "physique",
        duration: "22 min",
        description: "Les fondements de la mécanique classique.",
        link: "lesson.html"
    },
    {
        id: 8,
        title: "L'Électricité et le Magnétisme",
        domain: "physique",
        duration: "25 min",
        description: "Comprendre les forces électromagnétiques.",
        link: "lesson.html"
    },
    {
        id: 9,
        title: "Les Roches et Minéraux",
        domain: "geologie",
        duration: "18 min",
        description: "Classification et formation des roches.",
        link: "lesson.html"
    },
    {
        id: 10,
        title: "La Tectonique des Plaques",
        domain: "geologie",
        duration: "20 min",
        description: "Les mouvements de la croûte terrestre.",
        link: "lesson.html"
    }
];

export const quizzesData = [
    {
        id: 1,
        title: "Quizz : Le Système Solaire",
        domain: "astronomie",
        questions: 10,
        relatedLesson: 1,
        link: "quiz.html"
    },
    {
        id: 2,
        title: "Quizz : Les Étoiles",
        domain: "astronomie",
        questions: 10,
        relatedLesson: 2,
        link: "quiz.html"
    },
    {
        id: 3,
        title: "Quizz : La Cellule",
        domain: "biologie",
        questions: 10,
        relatedLesson: 3,
        link: "quiz.html"
    },
    {
        id: 4,
        title: "Quizz : Génétique",
        domain: "biologie",
        questions: 10,
        relatedLesson: 4,
        link: "quiz.html"
    },
    {
        id: 5,
        title: "Quizz : Réactions Chimiques",
        domain: "chimie",
        questions: 10,
        relatedLesson: 5,
        link: "quiz.html"
    },
    {
        id: 6,
        title: "Quizz : Tableau Périodique",
        domain: "chimie",
        questions: 10,
        relatedLesson: 6,
        link: "quiz.html"
    },
    {
        id: 7,
        title: "Quizz : Lois de Newton",
        domain: "physique",
        questions: 10,
        relatedLesson: 7,
        link: "quiz.html"
    },
    {
        id: 8,
        title: "Quizz : Électromagnétisme",
        domain: "physique",
        questions: 10,
        relatedLesson: 8,
        link: "quiz.html"
    },
    {
        id: 9,
        title: "Quizz : Roches et Minéraux",
        domain: "geologie",
        questions: 10,
        relatedLesson: 9,
        link: "quiz.html"
    },
    {
        id: 10,
        title: "Quizz : Tectonique",
        domain: "geologie",
        questions: 10,
        relatedLesson: 10,
        link: "quiz.html"
    }
];

// Initialize progress in localStorage if not exists
export function initializeProgress() {
    if (!localStorage.getItem('lessonsProgress')) {
        const initialLessonsProgress = {};
        lessonsData.forEach(lesson => {
            initialLessonsProgress[lesson.id] = {
                completed: false,
                sectionsCompleted: []
            };
        });
        localStorage.setItem('lessonsProgress', JSON.stringify(initialLessonsProgress));
    }
    
    if (!localStorage.getItem('quizzesProgress')) {
        const initialQuizzesProgress = {};
        quizzesData.forEach(quiz => {
            initialQuizzesProgress[quiz.id] = {
                completed: false,
                score: null,
                percentage: null
            };
        });
        localStorage.setItem('quizzesProgress', JSON.stringify(initialQuizzesProgress));
    }
}

// Get lesson progress
export function getLessonProgress(lessonId) {
    const progress = JSON.parse(localStorage.getItem('lessonsProgress') || '{}');
    return progress[lessonId] || { completed: false, sectionsCompleted: [] };
}

// Update lesson progress
export function updateLessonProgress(lessonId, sectionId) {
    const progress = JSON.parse(localStorage.getItem('lessonsProgress') || '{}');
    if (!progress[lessonId]) {
        progress[lessonId] = { completed: false, sectionsCompleted: [] };
    }
    
    if (!progress[lessonId].sectionsCompleted.includes(sectionId)) {
        progress[lessonId].sectionsCompleted.push(sectionId);
    }
    
    // Check if all sections are completed (assuming 5 sections per lesson)
    if (progress[lessonId].sectionsCompleted.length >= 5) {
        progress[lessonId].completed = true;
    }
    
    localStorage.setItem('lessonsProgress', JSON.stringify(progress));
    return progress[lessonId];
}

// Get quiz progress
export function getQuizProgress(quizId) {
    const progress = JSON.parse(localStorage.getItem('quizzesProgress') || '{}');
    return progress[quizId] || { completed: false, score: null, percentage: null };
}

// Update quiz progress
export function updateQuizProgress(quizId, score, total) {
    const progress = JSON.parse(localStorage.getItem('quizzesProgress') || '{}');
    progress[quizId] = {
        completed: true,
        score: score,
        percentage: Math.round((score / total) * 100)
    };
    localStorage.setItem('quizzesProgress', JSON.stringify(progress));
    return progress[quizId];
}

// Initialize on load
initializeProgress();

// Export data for other scripts
window.lessonsData = lessonsData;
window.quizzesData = quizzesData;
window.getLessonProgress = getLessonProgress;
window.updateLessonProgress = updateLessonProgress;
window.getQuizProgress = getQuizProgress;
window.updateQuizProgress = updateQuizProgress;
