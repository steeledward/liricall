<template>
  <div>
    <v-menu>
      <template #activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="loginWithGoogle">
          <v-list-item-title>
            <v-icon class="mr-2" color="red">mdi-google</v-icon>
            Google
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="loginWithFacebook">
          <v-list-item-title>
            <v-icon class="mr-2" color="blue">mdi-facebook</v-icon>
            Facebook
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
  import { useSnackbar } from '../../composables/useSnackbar'
  import { useAuthStore } from '../../stores/auth'

  const authStore = useAuthStore()
  const { showError } = useSnackbar()

  async function loginWithGoogle () {
    try {
      await authStore.loginWithGoogle()
    } catch {
      showError('Error al iniciar sesión con Google')
    }
  }

  async function loginWithFacebook () {
    try {
      await authStore.loginWithFacebook()
    } catch {
      showError('Error al iniciar sesión con Facebook')
    }
  }
</script>
