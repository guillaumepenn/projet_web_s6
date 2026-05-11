import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../views/HomeView.vue'
import Lessons from '../views/LessonsView.vue'
import Quizzes from '../views/QuizzesView.vue'
import Profil from '../views/ProfilView.vue'
import Lesson from '../views/LessonView.vue'
import Quiz from '../views/QuizView.vue'
import AdminQuizzes from '../views/AdminQuizzesView.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/lessons', component: Lessons },
  { path: '/quizzes', component: Quizzes },
  { path: '/profile', component: Profil },
  { path: '/lesson/:id', component: Lesson },
  { path: '/quiz/:id', component: Quiz },
  { path: '/admin/quizzes', component: AdminQuizzes }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router