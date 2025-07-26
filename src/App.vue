<template>
  <Navbar />
  <div class="container-fluid px-4">
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  components: { Navbar }
}
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>