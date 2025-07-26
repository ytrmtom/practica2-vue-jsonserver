<template>

<i class="bi bi-house-door-fill"></i> Inicio
<i class="bi bi-book-fill"></i> Libros
<i class="bi bi-person-circle"></i> Perfil

  <div class="about">
    <h1>This is an about page</h1>
    <button @click="show = !show">Click me</button>
    <modal v-model="show">Test</modal>
  </div>


</template>

<script setup>
import { ref } from 'vue';
const show = ref(false);
</script>
