<template>
    <Navbar/>
    <main>
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
