<template>
    <Navbar/>
    <main>
      <!--<router-view> </router-view>-->
      <Home/>
    </main>
    <AppFooter/>
</template>

<script>
import Navbar from './components/NavbarComp.vue'
import AppFooter from './components/FooterComp.vue'
import Home from './views/HomeView.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    AppFooter,
    Home
  }
}
</script>

<style>

</style>
