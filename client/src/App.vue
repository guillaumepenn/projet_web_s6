<template>
  <Navbar msg = "Welcome to Your Vue.js App"/>
  
  <AppFooter/>
</template>

<script>
import Navbar from './components/navbar.vue'
import AppFooter from './components/footer.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    AppFooter
  }
}
</script>

<style>

</style>
