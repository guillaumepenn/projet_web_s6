import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/HomeView.vue'
import Lessons from '../views/LessonsView.vue'
import Quizzes from '../views/QuizzesView.vue'
import Profil from '../views/ProfilView.vue'
import Lesson from '../views/LessonView.vue'
import Quiz from '../views/QuizView.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/lessons', component: Lessons },
  { path: '/quizzes', component: Quizzes },
  { path: '/profil', component: Profil },
  { path: '/lesson', component: Lesson },
  { path: '/quiz', component: Quiz}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
