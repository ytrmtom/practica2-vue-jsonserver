<template>
    <div class="modal fade" ref="modal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="confirm">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Modal } from 'bootstrap'
  
  export default {
    props: ['title', 'message'],
    emits: ['confirm'],
    mounted() {
      this.modal = new Modal(this.$refs.modal)
    },
    methods: {
      show() {
        this.modal.show()
      },
      hide() {
        this.modal.hide()
      },
      confirm() {
        this.$emit('confirm')
        this.hide()
      }
    }
  }
  </script>