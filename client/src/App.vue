<template>
    <Navbar/>
    <main>
      <!--The router isn't working, so we've adapted the functions so that they don't use Vue Router-->
      <router-view> </router-view>
    </main>
    <AppFooter/>
</template>

<script>
import Navbar from './components/NavbarComp.vue'
import AppFooter from './components/FooterComp.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    AppFooter,
  }
}
</script>

<style>

</style>
