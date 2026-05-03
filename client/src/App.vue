<template>
    <Navbar/>
    <AuthModal/>
    <main>
      <router-view> </router-view>
    </main>
    <AppFooter/>
</template>

<script>
import Navbar from './components/NavbarComp.vue'
import AppFooter from './components/FooterComp.vue'
import AuthModal from './components/AuthModal.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    AppFooter,
    AuthModal
  }
}
</script>

<style>

</style>
