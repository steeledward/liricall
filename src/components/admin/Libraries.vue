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
            <v-btn color="primary" :loading="loading" @click="fetchLibraries">
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
        :items="libraries"
        :items-length="totalLibraries"
        :loading="loading"
        :search="search"
        true
        @update:options="fetchLibraries"
      >
        <template #item.Title="{ item }">
          {{ item.Title }}
        </template>

        <template #item.Story="{ item }">
          {{ sliceString(item.Story) }}
        </template>

        <template #item.Lyric="{ item }">
          {{ sliceString(item.Lyric) }}
        </template>

        <template #item.Date="{ item }">
          {{ item.Date }}
        </template>

        <template #item.actions="{ item }">
          <v-icon class="mr-2" color="primary" small @click="editLibrary(item)">
            mdi-pencil
          </v-icon>
          <v-icon color="error" small @click="confirmDeleteLibrary(item)">
            mdi-delete
          </v-icon>
        </template>

        <template #no-data>
          <v-btn color="primary" @click="fetchLibraries"> Reset </v-btn>
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
          <span>Are you sure you want to delete this item? {{ selectedLibrary?.Title }}</span>
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
            @click="deleteLibrary()"
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
  import type { Library } from '@/types/library'
  import { onMounted, ref } from 'vue'
  import { useApi } from '@/utils/api.ts'

  const api = useApi()

  // Reactive data
  const libraries = ref<Library[]>([])
  const loading = ref<boolean>(false)
  const search = ref<string>('')
  const page = ref<number>(1)
  const itemsPerPage = ref<number>(10)
  const totalLibraries = ref<number>(0)

  const selectedLibrary = ref<Library>()
  const showConfirmDelete = ref<boolean>(false)

  // Snackbar for notifications
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  })

  // Table headers with proper typing
  const headers = ref<DataTableHeader[]>([
    { title: 'Title', key: 'Title', sortable: true },
    { title: 'Story', key: 'Story', sortable: true },
    { title: 'Lyric', key: 'Lyric', sortable: true },
    { title: 'Date', key: 'Date', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false },
  ])

  function sliceString (fullString: string) {
    return fullString ? fullString.toString().slice(0, 20) : ''
  }

  // Methods
  async function fetchLibraries (): Promise<void> {
    loading.value = true
    try {
      const response = await api.get('/api/libraries/paged', {
        page: page.value,
        limit: itemsPerPage.value,
        search: search.value,
      })

      libraries.value = response.data.libraries
      totalLibraries.value = response.data.total
    } catch (error) {
      console.error('Error fetching libraries:', error)
      showSnackbar('Error fetching libraries', 'error')
      libraries.value = []
    } finally {
      loading.value = false
    }
  }

  async function deleteLibrary (): Promise<void> {
    loading.value = true
    try {
      const response = await api.delete('/api/libraries/' + selectedLibrary.value?._id, {
        id: selectedLibrary.value?._id,
      })

      if (response.status === 200 || response.status === 201) {
        showSnackbar('Library deleted', 'primary')
        fetchLibraries()
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error deleting libraries:', error)
      showSnackbar('Error deleting library', 'error')
      showConfirmDelete.value = false
    } finally {
      loading.value = false
      showConfirmDelete.value = false
    }
  }

  function onSearch (): void {
    page.value = 1
    fetchLibraries()
  }

  function editLibrary (library: Library): void {
    console.log('Edit library:', library)
    showSnackbar(`Editing library: ${library.Title}`, 'info')
  // Implement edit functionality
  }

  function confirmDeleteLibrary (library: Library): void {
    // Implement delete functionality
    selectedLibrary.value = library
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
    fetchLibraries()
  })
</script>
