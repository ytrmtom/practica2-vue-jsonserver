<template>
    <div class="container-fluid">
      <h2><i class="bi bi-person-lines-fill"></i> Gestión de Autores</h2>
      <button class="btn btn-success mb-3" @click="resetForm" data-bs-toggle="modal" data-bs-target="#autorModal">
        <i class="bi bi-plus-circle"></i> Nuevo Autor
      </button>
  
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Nacionalidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="autor in autores" :key="autor.id">
            <td>{{ autor.nombre }}</td>
            <td>{{ autor.apellido }}</td>
            <td>{{ autor.nacionalidad }}</td>
            <td>
              <button @click="editAutor(autor)" class="btn btn-sm btn-outline-primary me-1" data-bs-toggle="modal" data-bs-target="#autorModal">
                <i class="bi bi-pencil"></i>
              </button>
              <button @click="confirmDelete(autor)" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Modal -->
      <div class="modal fade" id="autorModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ editing ? 'Editar Autor' : 'Nuevo Autor' }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveAutor">
                <div class="mb-3">
                  <label>Nombre</label>
                  <input v-model="form.nombre" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label>Apellido</label>
                  <input v-model="form.apellido" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label>Nacionalidad</label>
                  <input v-model="form.nacionalidad" class="form-control" />
                </div>
                <div class="text-end">
                  <button type="submit" class="btn btn-primary">{{ editing ? 'Actualizar' : 'Guardar' }}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  
      <ModalConfirm
        ref="confirmModal"
        title="Eliminar Autor"
        message="¿Estás seguro? Se eliminará el autor y todos sus libros."
        @confirm="deleteAutor"
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
        autores: [],
        editing: false,
        currentId: null,
        form: { nombre: '', apellido: '', nacionalidad: '' }
      }
    },
    methods: {
      async load() {
        const res = await api.get('/autores')
        this.autores = res.data
      },
      resetForm() {
        this.editing = false
        this.currentId = null
        this.form = { nombre: '', apellido: '', nacionalidad: '' }
      },
      editAutor(autor) {
        this.editing = true
        this.currentId = autor.id
        this.form = { ...autor }
      },
      async saveAutor() {
        try {
          if (this.editing) {
            await api.put(`/autores/${this.currentId}`, this.form)
          } else {
            await api.post('/autores', this.form)
          }
          await this.load()
          
          // Hide the modal using Bootstrap 5's JavaScript API
          const modalElement = document.getElementById('autorModal')
          if (modalElement) {
            const modal = Modal.getInstance(modalElement) || new Modal(modalElement)
            modal.hide()
          }
          
          this.resetForm()
        } catch (err) {
          console.error('Error saving author:', err)
          alert('Error al guardar: ' + (err.response?.data?.message || err.message))
        }
      },
      confirmDelete(autor) {
        this.currentId = autor.id
        this.$refs.confirmModal.show()
      },
      async deleteAutor() {
        await api.delete(`/autores/${this.currentId}`)
        this.load()
      }
    },
    mounted() {
      this.load()
    }
  }
  </script>