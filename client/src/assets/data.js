/**
 * Sample Data for Pluriscience
 * This file contains all the lessons and quizzes data
 */

export const lessonsData = [
    {
        id: 1, title: "The Solar System", domain: "astronomy", duration: "15 min",
        description: "Discover the planets and objects of the solar system.",
        sections: [
            { id: "s1", title: "Introduction", text: "The solar system consists of our star, the Sun, and all the celestial bodies orbiting it: eight planets, their moons, and millions of asteroids and comets." },
            { id: "s2", title: "The Terrestrial Planets", text: "Mercury, Venus, Earth, and Mars are the inner planets. They are composed primarily of rock and metal." },
            { id: "s3", title: "The Gas Giants", text: "Jupiter and Saturn are massive planets composed mostly of hydrogen and helium." },
            { id: "s4", title: "The Ice Giants", text: "Uranus and Neptune contain more 'ices' like water, ammonia, and methane." }
        ]
    },
    {
        id: 2, title: "Stars and Their Life Cycle", domain: "astronomy", duration: "20 min",
        description: "Learn how stars are born and die.",
        sections: [
            { id: "s1", title: "Birth", text: "Stars are born in nebulas." },
            { id: "s2", title: "Death", text: "They can end up as a white dwarf, neutron star, or black hole." }
        ]
    },
    {
        id: 3, title: "The Cell: Unit of Life", domain: "biology", duration: "18 min",
        description: "Explore the structure and function of cells.",
        sections: [
            { id: "s1", title: "Structure", text: "The cell has a membrane, a cytoplasm, and often a nucleus." }
        ]
    },
    {
        id: 4, title: "DNA and Genetics", domain: "biology", duration: "25 min",
        description: "Understand the genetic code and heredity.",
        sections: [
            { id: "s1", title: "DNA", text: "DNA is a double helix containing genetic information." }
        ]
    },
    {
        id: 5, title: "Chemical Reactions", domain: "chemistry", duration: "15 min",
        description: "The basics of matter transformation.",
        sections: [
            { id: "s1", title: "Principle", text: "Nothing is lost, nothing is created, everything is transformed." }
        ]
    },
    {
        id: 6, title: "The Periodic Table", domain: "chemistry", duration: "20 min",
        description: "Organization and properties of elements.",
        sections: [
            { id: "s1", title: "Mendeleev", text: "The table was invented by Dmitri Mendeleev." }
        ]
    },
    {
        id: 7, title: "Newton's Laws", domain: "physics", duration: "22 min",
        description: "The foundations of classical mechanics.",
        sections: [
            { id: "s1", title: "Gravity", text: "Gravity explains why objects fall." }
        ]
    },
    {
        id: 8, title: "Electricity and Magnetism", domain: "physics", duration: "25 min",
        description: "Understand electromagnetic forces.",
        sections: [
            { id: "s1", title: "Electrons", text: "Electric current is a flow of electrons." }
        ]
    },
    {
        id: 9, title: "Rocks and Minerals", domain: "geology", duration: "18 min",
        description: "Classification and formation of rocks.",
        sections: [
            { id: "s1", title: "Magma", text: "Cooled magma forms igneous rocks." }
        ]
    },
    {
        id: 10, title: "Plate Tectonics", domain: "geology", duration: "20 min",
        description: "Movements of the Earth's crust.",
        sections: [
            { id: "s1", title: "Drift", text: "Continents move on the Earth's mantle." }
        ]
    }
];

export const quizzesData = [
    {
        id: 1, title: "Quiz: The Solar System", domain: "astronomy", relatedLesson: 1,
        questions: [
            {
                id: "q1", question: "What is the largest planet in our solar system?",
                answers: [ { id: "a", text: "Earth" }, { id: "b", text: "Jupiter" }, { id: "c", text: "Saturn" } ],
                correctAnswer: "b"
            },
            {
                id: "q2", question: "Is the Sun a planet?",
                answers: [ { id: "a", text: "Yes" }, { id: "b", text: "No, it's a star" } ],
                correctAnswer: "b"
            },
            {
                id: "q3", question: "Which planet is known as the Red Planet?",
                answers: [ { id: "a", text: "Mars" }, { id: "b", text: "Venus" }, { id: "c", text: "Jupiter" } ],
                correctAnswer: "a"
            },
            {
                id: "q4", question: "How many main planets are there?",
                answers: [ { id: "a", text: "7" }, { id: "b", text: "8" }, { id: "c", text: "9" } ],
                correctAnswer: "b"
            }
        ]
    },
    {
        id: 2, title: "Quiz: Stars", domain: "astronomy", relatedLesson: 2,
        questions: [
            {
                id: "q1", question: "Where are stars born?",
                answers: [ { id: "a", text: "In nebulas" }, { id: "b", text: "In black holes" } ],
                correctAnswer: "a"
            }
        ]
    },
    {
        id: 3, title: "Quiz: The Cell", domain: "biology", relatedLesson: 3,
        questions: [
            {
                id: "q1", question: "Which of these structures contains DNA?",
                answers: [ { id: "a", text: "The nucleus" }, { id: "b", text: "The membrane" } ],
                correctAnswer: "a"
            }
        ]
    },
    {
        id: 4, title: "Quiz: Genetics", domain: "biology", relatedLesson: 4,
        questions: [
            {
                id: "q1", question: "DNA is shaped like a double...",
                answers: [ { id: "a", text: "Helix" }, { id: "b", text: "Line" } ],
                correctAnswer: "a"
            }
        ]
    },
    {
        id: 5, title: "Quiz: Chemical Reactions", domain: "chemistry", relatedLesson: 5,
        questions: [
            {
                id: "q1", question: "During a reaction, mass is...",
                answers: [ { id: "a", text: "Conserved" }, { id: "b", text: "Lost" } ],
                correctAnswer: "a"
            }
        ]
    },
    {
        id: 6, title: "Quiz: The Periodic Table", domain: "chemistry", relatedLesson: 6,
        questions: [
            {
                id: "q1", question: "Who invented the periodic table?",
                answers: [ { id: "a", text: "Einstein" }, { id: "b", text: "Mendeleev" } ],
                correctAnswer: "b"
            }
        ]
    },
    {
        id: 7, title: "Quiz: Newton's Laws", domain: "physics", relatedLesson: 7,
        questions: [
            {
                id: "q1", question: "Which apple is famous in physics?",
                answers: [ { id: "a", text: "Newton's" }, { id: "b", text: "Archimedes'" } ],
                correctAnswer: "a"
            }
        ]
    },
    {
        id: 8, title: "Quiz: Electromagnetism", domain: "physics", relatedLesson: 8,
        questions: [
            {
                id: "q1", question: "Electric current is a flow of...",
                answers: [ { id: "a", text: "Protons" }, { id: "b", text: "Electrons" } ],
                correctAnswer: "b"
            }
        ]
    },
    {
        id: 9, title: "Quiz: Rocks and Minerals", domain: "geology", relatedLesson: 9,
        questions: [
            {
                id: "q1", question: "Cooled magma becomes...",
                answers: [ { id: "a", text: "Igneous rock" }, { id: "b", text: "Sedimentary rock" } ],
                correctAnswer: "a"
            }
        ]
    },
    {
        id: 10, title: "Quiz: Tectonics", domain: "geology", relatedLesson: 10,
        questions: [
            {
                id: "q1", question: "Continents do not move.",
                answers: [ { id: "a", text: "True" }, { id: "b", text: "False" } ],
                correctAnswer: "b"
            }
        ]
    }
];

export function initializeProgress() {
    if (!localStorage.getItem('lessonsProgress')) {
        const initialLessonsProgress = {};
        lessonsData.forEach(lesson => {
            initialLessonsProgress[lesson.id] = { completed: false, sectionsCompleted: [] };
        });
        localStorage.setItem('lessonsProgress', JSON.stringify(initialLessonsProgress));
    }
    
    if (!localStorage.getItem('quizzesProgress')) {
        const initialQuizzesProgress = {};
        quizzesData.forEach(quiz => {
            initialQuizzesProgress[quiz.id] = { completed: false, score: null, percentage: null };
        });
        localStorage.setItem('quizzesProgress', JSON.stringify(initialQuizzesProgress));
    }
}

export function getLessonProgress(lessonId) {
    const progress = JSON.parse(localStorage.getItem('lessonsProgress') || '{}');
    return progress[lessonId] || { completed: false, sectionsCompleted: [] };
}

export function updateLessonProgress(lessonId, sectionId) {
    const progress = JSON.parse(localStorage.getItem('lessonsProgress') || '{}');
    if (!progress[lessonId]) {
        progress[lessonId] = { completed: false, sectionsCompleted: [] };
    }
    
    if (!progress[lessonId].sectionsCompleted.includes(sectionId)) {
        progress[lessonId].sectionsCompleted.push(sectionId);
    }
    
    // Lesson is considered complete if all sections are read
    const targetLesson = lessonsData.find(l => l.id === lessonId);
    const totalSections = targetLesson && targetLesson.sections ? targetLesson.sections.length : 1;

    if (progress[lessonId].sectionsCompleted.length >= totalSections) {
        progress[lessonId].completed = true;
    }
    
    localStorage.setItem('lessonsProgress', JSON.stringify(progress));
    return progress[lessonId];
}

export function getQuizProgress(quizId) {
    const progress = JSON.parse(localStorage.getItem('quizzesProgress') || '{}');
    return progress[quizId] || { completed: false, score: null, percentage: null };
}

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

initializeProgress();

window.lessonsData = lessonsData;
window.quizzesData = quizzesData;
window.getLessonProgress = getLessonProgress;
window.updateLessonProgress = updateLessonProgress;
window.getQuizProgress = getQuizProgress;
window.updateQuizProgress = updateQuizProgress;