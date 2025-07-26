<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <i class="bi bi-bookshelf"></i> Biblioteca Digital
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">📚 Libros</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/autores">✍️ Autores</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/categorias">🔖 Categorías</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/usuarios">👥 Usuarios</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/prestamos">🔄 Préstamos</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>