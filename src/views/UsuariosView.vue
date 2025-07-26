<template>
    <div class="container-fluid">
      <h2><i class="bi bi-people"></i> Usuarios</h2>
      <button class="btn btn-success mb-3" @click="resetForm" data-bs-toggle="modal" data-bs-target="#userModal">
        <i class="bi bi-plus-circle"></i> Nuevo Usuario
      </button>
  
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Nacionalidad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usuarios" :key="user.id">
            <td>{{ user.nombre }}</td>
            <td>{{ user.apellido }}</td>
            <td>{{ user.nacionalidad }}</td>
            <td>
              <span :class="`badge ${user.estado ? 'bg-success' : 'bg-secondary'}`">
                {{ user.estado ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <button @click="editUser(user)" class="btn btn-sm btn-outline-primary me-1" data-bs-toggle="modal" data-bs-target="#userModal">
                <i class="bi bi-pencil"></i>
              </button>
              <button @click="confirmDelete(user)" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div class="modal fade" id="userModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ editing ? 'Editar' : 'Nuevo' }} Usuario</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveUser">
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
                <div class="mb-3 form-check">
                  <input v-model="form.estado" type="checkbox" class="form-check-input" id="estadoUser" />
                  <label class="form-check-label" for="estadoUser">Activo</label>
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
        title="Eliminar Usuario"
        message="¿Eliminar este usuario? Se perderán sus préstamos."
        @confirm="deleteUser"
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
        usuarios: [],
        editing: false,
        currentId: null,
        form: { nombre: '', apellido: '', nacionalidad: '', estado: true }
      }
    },
    methods: {
      async load() {
        const res = await api.get('/usuarios')
        this.usuarios = res.data
      },
      resetForm() {
        this.editing = false
        this.currentId = null
        this.form = { nombre: '', apellido: '', nacionalidad: '', estado: true }
      },
      editUser(user) {
        this.editing = true
        this.currentId = user.id
        this.form = { ...user }
      },
      async saveUser() {
        try {
          if (this.editing) {
            await api.put(`/usuarios/${this.currentId}`, this.form)
          } else {
            await api.post('/usuarios', this.form)
          }
          await this.load()
          
          const modalElement = document.getElementById('userModal')
          if (modalElement) {
            const modal = Modal.getInstance(modalElement) || new Modal(modalElement)
            modal.hide()
          }
          
          this.resetForm()
        } catch (err) {
          console.error('Error saving user:', err)
          alert('Error al guardar: ' + (err.response?.data?.message || err.message))
        }
      },
      confirmDelete(user) {
        this.currentId = user.id
        this.$refs.confirmModal.show()
      },
      async deleteUser() {
        await api.delete(`/usuarios/${this.currentId}`)
        this.load()
      }
    },
    mounted() {
      this.load()
    }
  }
  </script>