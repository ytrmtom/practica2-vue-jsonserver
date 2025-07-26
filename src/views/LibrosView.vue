<template>
    <div class="container-fluid">
      <h2 class="mb-4">
        <i class="bi bi-book"></i> Gestión de Libros
      </h2>
  
      <h2><i class="bi bi-book"></i> Libros</h2>
      <div class="d-flex justify-content-between mb-3">
        <button class="btn btn-success" @click="resetForm" data-bs-toggle="modal" data-bs-target="#libroModal">
          <i class="bi bi-plus-circle"></i> Nuevo Libro
        </button>
      </div>
      
      <div class="input-group mb-3">
        <span class="input-group-text"><i class="bi bi-search"></i></span>
        <input 
          type="text" 
          class="form-control" 
          placeholder="Buscar por título o autor..." 
          v-model="search"
        >
      </div>
      
      <select v-model="filtroCategoria" class="form-select mb-3" style="max-width: 300px;">
        <option value="">Todas las categorías</option>
        <option v-for="c in categorias" :key="c.id" :value="c.id">
          {{ c.nombre }}
        </option>
      </select>

      <div class="btn-group mb-3" role="group">
        <input type="radio" class="btn-check" name="estado" id="todos" autocomplete="off" checked @click="filtroEstado = null">
        <label class="btn btn-outline-secondary" for="todos">Todos</label>

        <input type="radio" class="btn-check" name="estado" id="disponible" autocomplete="off" @click="filtroEstado = true">
        <label class="btn btn-outline-success" for="disponible">Disponibles</label>

        <input type="radio" class="btn-check" name="estado" id="prestado" autocomplete="off" @click="filtroEstado = false">
        <label class="btn btn-outline-danger" for="prestado">Prestados</label>
      </div>

      <button @click="resetFiltros" class="btn btn-outline-warning btn-sm mb-3">
        <i class="bi bi-x-circle"></i> Limpiar filtros
      </button>
  
      <table class="table table-hover shadow-sm">
        <thead class="table-light">
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Categoría</th>
            <th>ISBN</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="libro in librosFiltrados" :key="libro.id">
            <td>{{ libro.titulo }}</td>
            <td>{{ autoresMap[libro.autor]?.nombre_completo || 'Desconocido' }}</td>
            <td>{{ categoriasMap[libro.categoria]?.nombre || 'Desconocido' }}</td>
            <td><code>{{ libro.isbn }}</code></td>
            <td>
              <span :class="`badge ${libro.estado ? 'bg-success' : 'bg-secondary'}`">
                {{ libro.estado ? 'Disponible' : 'No disponible' }}
              </span>
            </td>
            <td>
              <button @click="editLibro(libro)" class="btn btn-sm btn-outline-primary me-1" data-bs-toggle="modal" data-bs-target="#libroModal">
                <i class="bi bi-pencil"></i>
              </button>
              <button @click="confirmDelete(libro)" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div class="modal fade" id="libroModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ editing ? 'Editar Libro' : 'Nuevo Libro' }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveLibro">
                <div class="mb-3">
                  <label>Título</label>
                  <input v-model="form.titulo" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label>ISBN</label>
                  <input v-model="form.isbn" class="form-control" :disabled="editing" required />
                </div>
                <div class="mb-3">
                  <label>Fecha de Publicación</label>
                  <input v-model="form.fecha_publicacion" type="date" class="form-control" />
                </div>
                <div class="mb-3">
                  <label>Autor</label>
                  <select v-model="form.autor" class="form-select" required>
                    <option v-for="a in autores" :key="a.id" :value="a.id">
                      {{ a.nombre }} {{ a.apellido }}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label>Categoría</label>
                  <select v-model="form.categoria" class="form-select" required>
                    <option v-for="c in categorias" :key="c.id" :value="c.id">
                      {{ c.nombre }}
                    </option>
                  </select>
                </div>
                <div class="mb-3 form-check">
                  <input v-model="form.estado" type="checkbox" class="form-check-input" id="estadoCheck" />
                  <label class="form-check-label" for="estadoCheck">Disponible</label>
                </div>
                <div class="text-end">
                  <button type="submit" class="btn btn-primary">
                    {{ editing ? 'Actualizar' : 'Guardar' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  
      
      <ModalConfirm
        ref="confirmModal"
        title="Eliminar Libro"
        message="¿Estás seguro de que deseas eliminar este libro? Esta acción no se puede deshacer."
        @confirm="deleteLibro"
      />
    </div>
  </template>
  
  <script>
  import api from '@/services/api'
  import ModalConfirm from '@/components/ModalConfirm.vue'
  import { Modal } from 'bootstrap'
  
  export default {
    components: { ModalConfirm },
    data() {
      return {
          search: '',
          filtroCategoria: '',
          filtroEstado: null,
          libros: [],
          autores: [],
          categorias: [],
          editing: false,
          currentLibroId: null,
          form: {
          titulo: '',
          isbn: '',
          fecha_publicacion: '',
          autor: '',
          categoria: '',
          estado: true
        },
      }
    },
    computed: {
        
        
        librosFiltrados() {
      console.log('Filtrando con categoría:', this.filtroCategoria);
      console.log('Libros:', this.libros);
      
      return this.libros.filter(libro => {
        // Filtro de búsqueda
        const searchTerm = this.search ? this.search.toLowerCase() : '';
        const matchSearch = !searchTerm || 
          (libro.titulo || '').toLowerCase().includes(searchTerm) ||
          (this.autoresMap[libro.autor]?.nombre_completo || '').toLowerCase().includes(searchTerm);
        
        
        let matchCategoria = true;
        if (this.filtroCategoria) {
          const categoriaId = String(this.filtroCategoria);
          const libroCategoriaId = libro.categoria ? String(libro.categoria) : '';
          matchCategoria = libroCategoriaId === categoriaId;
          
          
          console.log('Libro ID:', libro.id, 'Categoría ID:', libroCategoriaId, 'Filtro:', categoriaId, 'Match:', matchCategoria);
        }

        
        let matchEstado = true;
        if (this.filtroEstado !== null) {
          
          matchEstado = libro.disponible === this.filtroEstado;
        }

        
        if (matchCategoria && matchEstado) {
          console.log('Libro pasado por filtros:', libro.titulo);
        }

        return matchSearch && matchCategoria && matchEstado;
      });
    },
      autoresMap() {
        return this.autores.reduce((map, a) => {
          map[a.id] = { ...a, nombre_completo: `${a.nombre} ${a.apellido}` }
          return map
        }, {})
      },
      categoriasMap() {
        return this.categorias.reduce((map, c) => {
          map[c.id] = c;
          return map;
        }, {})
      }
    },
    methods: {
  resetFiltros() {
    this.search = ''
    this.filtroCategoria = ''
    this.filtroAutor = ''
    this.filtroEstado = null
    this.fechaDesde = ''
    this.fechaHasta = ''
  },

      async loadLibros() {
        try {
          const [librosRes, autoresRes, categoriasRes, prestamosRes] = await Promise.all([
            api.get('/libros'),
            api.get('/autores'),
            api.get('/categorias'),
            api.get('/prestamos')
          ])
          
          
          const autoresMap = {}
          autoresRes.data.forEach(autor => {
            autoresMap[autor.id] = {
              ...autor,
              nombre_completo: `${autor.nombre} ${autor.apellido}`.trim()
            }
          })
          
          const categoriasMap = {}
          categoriasRes.data.forEach(cat => {
            categoriasMap[cat.id] = cat
          })
          
          
          const prestamosPorLibro = {}
          prestamosRes.data.forEach(prestamo => {
            if (!prestamosPorLibro[prestamo.libro]) {
              prestamosPorLibro[prestamo.libro] = []
            }
            prestamosPorLibro[prestamo.libro].push(prestamo)
          })
          
          
          this.libros = librosRes.data.map(libro => ({
            ...libro,
            prestamos: prestamosPorLibro[libro.id] || [],
            autor_nombre: autoresMap[libro.autor]?.nombre_completo || 'Desconocido',
            categoria_nombre: categoriasMap[libro.categoria]?.nombre || 'Desconocido',
            disponible: !prestamosPorLibro[libro.id] || prestamosPorLibro[libro.id].every(p => p.fecha_devolucion)
          }))
        } catch (error) {
          console.error('Error loading libros:', error)
          alert('Error al cargar los libros. Por favor, intente de nuevo.')
        }
      },
      async loadAutores() {
        const res = await api.get('/autores')
        this.autores = res.data
      },
      async loadCategorias() {
        const res = await api.get('/categorias')
        this.categorias = res.data
      },
      resetForm() {
        this.editing = false
        this.currentLibroId = null
        this.form = { titulo: '', isbn: '', fecha_publicacion: '', autor: '', categoria: '', estado: true }
      },
      editLibro(libro) {
        this.editing = true
        this.currentLibroId = libro.id
        this.form = { ...libro }
      },
      async saveLibro() {
        try {
          if (this.editing) {
            await api.put(`/libros/${this.currentLibroId}`, this.form)
          } else {
            await api.post('/libros', this.form)
          }
          await this.loadLibros()
          
          const modalElement = document.getElementById('libroModal')
          if (modalElement) {
            const modal = Modal.getInstance(modalElement) || new Modal(modalElement)
            modal.hide()
          }
          
          this.resetForm()
        } catch (err) {
          console.error('Error saving book:', err)
          alert('Error al guardar: ' + (err.response?.data?.message || err.message))
        }
      },
      confirmDelete(libro) {
        this.currentLibroId = libro.id
        this.$refs.confirmModal.show()
      },
      async deleteLibro() {
        await api.delete(`/libros/${this.currentLibroId}`)
        this.loadLibros()
      }
    },
    async mounted() {
      await this.loadAutores()
      await this.loadCategorias()
      await this.loadLibros()
    }
  }
  </script>