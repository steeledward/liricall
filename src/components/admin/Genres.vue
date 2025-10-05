<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              hide-details
              label="Search"
              single-line
              @input="onSearch"
            />
          </v-col>
          <v-col class="text-right" cols="12" md="6">
            <v-btn color="primary" :loading="loading" @click="fetchGenres">
              <v-icon left>mdi-refresh</v-icon>
              Refresh
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        class="elevation-1 mt-4"
        :headers="headers"
        item-value="_id"
        :items="genres"
        :items-length="totalGenres"
        :loading="loading"
        :search="search"
        true
        @update:options="fetchGenres"
      >
        <template #item.genre="{ item }">
          {{ item.genre }}
        </template>

        <template #item.comments="{ item }">
          {{ item.comments }}
        </template>

        <template #item.actions="{ item }">
          <v-icon class="mr-2" color="primary" small @click="editGenre(item)">
            mdi-pencil
          </v-icon>
          <v-icon color="error" small @click="confirmDeleteGenre(item)">
            mdi-delete
          </v-icon>
        </template>

        <template #no-data>
          <v-btn color="primary" @click="fetchGenres"> Reset </v-btn>
        </template>
      </v-data-table-server>

      <!-- Confirmation Snackbar -->
      <v-snackbar
        v-model="showConfirmDelete"
        color="primary"
        multi-line
        :timeout="-1"
      >
        <div class="d-flex align-center">
          <span>Are you sure you want to delete this item?</span>
          <v-spacer />
          <v-btn
            class="ml-2"
            color="secondary"
            text
            @click="showConfirmDelete=false"
          >
            Cancel
          </v-btn>
          <v-btn
            class="ml-2"
            color="error"
            @click="deleteGenre()"
          >
            Delete
          </v-btn>
        </div>
      </v-snackbar>

      <v-snackbar v-model="snackbar.show" :color="snackbar.color">
        {{ snackbar.message }}
      </v-snackbar>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
  import type { DataTableHeader } from 'vuetify'
  import type { Genre } from '@/types/genre'
  import { onMounted, ref } from 'vue'
  import { useApi } from '@/utils/api.ts'

  const api = useApi()

  // Reactive data
  const genres = ref<Genre[]>([])
  const loading = ref<boolean>(false)
  const search = ref<string>('')
  const page = ref<number>(1)
  const itemsPerPage = ref<number>(10)
  const totalGenres = ref<number>(0)

  const selectedGenre = ref<Genre>()
  const showConfirmDelete = ref<boolean>(false)

  // Snackbar for notifications
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  })

  // Table headers with proper typing
  const headers = ref<DataTableHeader[]>([
    { title: 'Genre', key: 'genre', sortable: true },
    { title: 'Comments', key: 'comments', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false },
  ])

  // Methods
  async function fetchGenres (): Promise<void> {
    loading.value = true
    try {
      const response = await api.get('/api/genres/paged', {
        page: page.value,
        limit: itemsPerPage.value,
        search: search.value,
      })

      genres.value = response.data.genres
      totalGenres.value = response.data.total
    } catch (error) {
      console.error('Error fetching genres:', error)
      showSnackbar('Error fetching genres', 'error')
      genres.value = []
    } finally {
      loading.value = false
    }
  }

  async function deleteGenre (): Promise<void> {
    loading.value = true
    try {
      const response = await api.delete('/api/genres/' + selectedGenre.value?._id, {
        id: selectedGenre.value?._id,
      })

      if (response.status === 200 || response.status === 201) {
        showSnackbar('Genre deleted', 'primary')
        fetchGenres()
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error deleting genres:', error)
      showSnackbar('Error deleting referer', 'error')
      showConfirmDelete.value = false
    } finally {
      loading.value = false
      showConfirmDelete.value = false
    }
  }

  function onSearch (): void {
    page.value = 1
    fetchGenres()
  }

  function editGenre (referer: Genre): void {
    showSnackbar(`Editing referer: ${referer.genre}`, 'info')
  // Implement edit functionality
  }

  function confirmDeleteGenre (referer: Genre): void {
    // Implement delete functionality
    selectedGenre.value = referer
    showConfirmDelete.value = true
  }

  function showSnackbar (message: string, color: string): void {
    snackbar.value = {
      show: true,
      message,
      color,
    }
  }

  // Lifecycle hooks
  onMounted(() => {
    fetchGenres()
  })
</script>
