<template>
    <div class="container-fluid">
      <h2><i class="bi bi-tags"></i> Categorías</h2>
      <button class="btn btn-success mb-3" @click="resetForm" data-bs-toggle="modal" data-bs-target="#catModal">
        <i class="bi bi-plus-circle"></i> Nueva Categoría
      </button>
  
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categorias" :key="cat.id">
            <td>{{ cat.nombre }}</td>
            <td>
              <button @click="editCat(cat)" class="btn btn-sm btn-outline-primary me-1" data-bs-toggle="modal" data-bs-target="#catModal">
                <i class="bi bi-pencil"></i>
              </button>
              <button @click="confirmDelete(cat)" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div class="modal fade" id="catModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ editing ? 'Editar' : 'Nueva' }} Categoría</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveCat">
                <div class="mb-3">
                  <label>Nombre</label>
                  <input v-model="form.nombre" class="form-control" required />
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
        title="Eliminar Categoría"
        message="¿Eliminar esta categoría? Los libros asociados perderán esta categoría."
        @confirm="deleteCat"
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
        categorias: [],
        editing: false,
        currentId: null,
        form: { nombre: '' }
      }
    },
    methods: {
      async load() {
        const res = await api.get('/categorias')
        this.categorias = res.data
      },
      resetForm() {
        this.editing = false
        this.currentId = null
        this.form = { nombre: '' }
      },
      editCat(cat) {
        this.editing = true
        this.currentId = cat.id
        this.form = { ...cat }
      },
      async saveCat() {
        try {
          if (this.editing) {
            await api.put(`/categorias/${this.currentId}`, this.form)
          } else {
            await api.post('/categorias', this.form)
          }
          await this.load()
          
          const modalElement = document.getElementById('catModal')
          if (modalElement) {
            const modal = Modal.getInstance(modalElement) || new Modal(modalElement)
            modal.hide()
          }
          
          this.resetForm()
        } catch (err) {
          console.error('Error saving category:', err)
          alert('Error al guardar: ' + (err.response?.data?.message || err.message))
        }
      },
      confirmDelete(cat) {
        this.currentId = cat.id
        this.$refs.confirmModal.show()
      },
      async deleteCat() {
        await api.delete(`/categorias/${this.currentId}`)
        this.load()
      }
    },
    mounted() {
      this.load()
    }
  }
  </script>