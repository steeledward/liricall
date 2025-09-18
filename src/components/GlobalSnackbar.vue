<template>
  <v-snackbar>
    {{ snackbar.message }}

    <template #actions>
      <v-btn
        variant="text"
        @click="snackbar.hideSnackbar"
      >
        Cerrar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
  import { useSnackbar } from '@/composables/useSnackbar'

  const snackbar = useSnackbar()
</script>
