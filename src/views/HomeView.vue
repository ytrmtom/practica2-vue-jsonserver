<template>
  <div class="container mt-4">
    <h1>
      <i class="bi bi-bookshelf"></i> Biblioteca Virtual
    </h1>

    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#"><i class="bi bi-house"></i> Inicio</a></li>
        <li class="breadcrumb-item active" aria-current="page">Libros</li>
      </ol>
    </nav>

    <div class="row">
      <div class="col-md-4" v-for="libro in libros" :key="libro.id">
        <div class="card mb-4 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-book"></i> {{ libro.titulo }}
            </h5>
            <p class="card-text">
              <small class="text-muted">
                <i class="bi bi-person"></i> {{ libro.autor }}
              </small>
            </p>
            <button class="btn btn-outline-primary btn-sm">
              <i class="bi bi-eye"></i> Ver
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      libros: [
        { id: 1, titulo: 'El nombre del viento', autor: 'Patrick Rothfuss' },
        { id: 2, titulo: 'Harry Potter', autor: 'J.K. Rowling' },
        { id: 3, titulo: 'Dune', autor: 'Frank Herbert' }
      ]
    }
  }
}
</script>