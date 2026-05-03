<template>
    <Navbar/>
    <main>
      <!--<router-view> </router-view>-->
      <Lesson :LessonId="1"/>
    </main>
    <AppFooter/>
</template>

<script>
import Navbar from './components/NavbarComp.vue'
import AppFooter from './components/FooterComp.vue'
import Lesson from './views/LessonView.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    AppFooter,
    Lesson
  }
}
</script>

<style>

</style>
