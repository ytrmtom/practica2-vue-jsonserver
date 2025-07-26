<template>
    <div class="container-fluid">
      <h2><i class="bi bi-arrow-clockwise"></i> Préstamos</h2>
      <button class="btn btn-success mb-3" @click="resetForm" data-bs-toggle="modal" data-bs-target="#prestamoModal">
        <i class="bi bi-plus-circle"></i> Nuevo Préstamo
      </button>
  
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>Libro</th>
            <th>Usuario</th>
            <th>Fecha Préstamo</th>
            <th>Fecha Devolución</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in prestamos" :key="p.id">
            <td>{{ p.libro_titulo }}</td>
            <td>{{ p.usuario_nombre }}</td>
            <td>{{ p.fecha_prestamo }}</td>
            <td>{{ p.fecha_devolucion || '—' }}</td>
            <td>
              <span :class="`badge ${p.estado ? 'bg-success' : 'bg-warning'}`">
                {{ p.estado ? 'Activo' : 'Devuelto' }}
              </span>
            </td>
            <td>
              <button v-if="p.estado" @click="devolver(p)" class="btn btn-sm btn-outline-warning">
                <i class="bi bi-escape"></i> Devolver
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      
      <div class="modal fade" id="prestamoModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nuevo Préstamo</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="savePrestamo">
                <div class="mb-3">
                  <label>Libro</label>
                  <select v-model="form.libro" class="form-select" required>
                    <option v-for="l in librosDisponibles" :key="l.id" :value="l.id">
                      {{ l.titulo }} ({{ autoresMap[l.autor]?.nombre_completo }})
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label>Usuario</label>
                  <select v-model="form.usuario" class="form-select" required>
                    <option v-for="u in usuariosActivos" :key="u.id" :value="u.id">
                      {{ u.nombre }} {{ u.apellido }}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label>Fecha de Préstamo</label>
                  <input v-model="form.fecha_prestamo" type="date" class="form-control" required />
                </div>
                <div class="text-end">
                  <button type="submit" class="btn btn-primary">Registrar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from '@/services/api'
  import { Modal } from 'bootstrap'
  
  export default {
    data() {
      return {
        prestamos: [],
        libros: [],
        usuarios: [],
        autores: [],
        form: {
          libro: '',
          usuario: '',
          fecha_prestamo: new Date().toISOString().split('T')[0],
          estado: true
        }
      }
    },
    computed: {
      librosDisponibles() {
        const prestados = this.prestamos.filter(p => p.estado).map(p => p.libro)
        return this.libros.filter(l => !prestados.includes(l.id) && l.estado)
      },
      usuariosActivos() {
        return this.usuarios.filter(u => u.estado)
      },
      autoresMap() {
        const map = {}
        this.autores.forEach(autor => {
          map[autor.id] = {
            ...autor,
            nombre_completo: `${autor.nombre} ${autor.apellido}`.trim()
          }
        })
        return map
      }
    },
    methods: {
      async load() {
        try {
          
          const [prestamosRes, librosRes, usuariosRes, autoresRes] = await Promise.all([
            api.get('/prestamos'),
            api.get('/libros'),
            api.get('/usuarios'),
            api.get('/autores')
          ])
          
          this.autores = autoresRes.data
          
          
          const librosMap = {}
          librosRes.data.forEach(libro => {
            librosMap[libro.id] = libro
          })
          
          const usuariosMap = {}
          usuariosRes.data.forEach(usuario => {
            usuariosMap[usuario.id] = usuario
          })
          
          
          this.prestamos = prestamosRes.data.map(prestamo => ({
            ...prestamo,
            libro_titulo: librosMap[prestamo.libro]?.titulo || 'Libro no encontrado',
            usuario_nombre: usuariosMap[prestamo.usuario] ? 
              `${usuariosMap[prestamo.usuario].nombre} ${usuariosMap[prestamo.usuario].apellido}` : 
              'Usuario no encontrado'
          }))
          
          this.libros = librosRes.data
          this.usuarios = usuariosRes.data
        } catch (error) {
          console.error('Error loading data:', error)
          alert('Error al cargar los datos. Por favor, intente nuevamente.')
        }
      },
      resetForm() {
        this.form = {
          libro: '',
          usuario: '',
          fecha_prestamo: new Date().toISOString().split('T')[0],
          estado: true
        }
      },
      async savePrestamo() {
        try {
          await api.post('/prestamos', this.form)
          await this.load()
          
          const modalElement = document.getElementById('prestamoModal')
          if (modalElement) {
            const modal = Modal.getInstance(modalElement) || new Modal(modalElement)
            modal.hide()
          }
          
          this.resetForm()
        } catch (error) {
          console.error('Error saving loan:', error)
          alert('Error al guardar el préstamo: ' + (error.response?.data?.message || error.message))
        }
      },
      async devolver(p) {
        try {
          await api.put(`/prestamos/${p.id}`, {
            ...p,
            estado: false,
            fecha_devolucion: new Date().toISOString().split('T')[0]
          })
          await this.load()
        } catch (error) {
          console.error('Error returning loan:', error)
          alert('Error al devolver el préstamo: ' + (error.response?.data?.message || error.message))
        }
      }
    },
    mounted() {
      this.load()
    }
  }
  </script>