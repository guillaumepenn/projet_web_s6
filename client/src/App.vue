<template>
    <Navbar/>
    <main>
      <!--The router isn't working, so we've adapted the functions so that they don't use Vue Router-->
      <router-view> </router-view>
      <Profil/>
    </main>
    <AppFooter/>
</template>

<script>
import Navbar from './components/NavbarComp.vue'
import AppFooter from './components/FooterComp.vue'
import Profil from './views/ProfilView.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    AppFooter,
    Profil
  }
}
</script>

<style>

</style>
