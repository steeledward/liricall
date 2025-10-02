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
            <v-btn color="primary" :loading="loading" @click="fetchReferers">
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
        :items="referers"
        :items-length="totalReferers"
        :loading="loading"
        :search="search"
        true
        @update:options="fetchReferers"
      >
        <template #item.content="{ item }">
          {{ item.content }}
        </template>

        <template #item.createdAt="{ item }">
          {{ item.createdAt }}
        </template>

        <template #item.actions="{ item }">
          <v-icon class="mr-2" color="primary" small @click="editReferer(item)">
            mdi-pencil
          </v-icon>
          <v-icon color="error" small @click="confirmDeleteReferer(item)">
            mdi-delete
          </v-icon>
        </template>

        <template #no-data>
          <v-btn color="primary" @click="fetchReferers"> Reset </v-btn>
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
            @click="deleteReferer()"
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
  import type { Referer } from '@/types/referer'
  import { onMounted, ref } from 'vue'
  import { useApi } from '@/utils/api.ts'

  const api = useApi()

  // Reactive data
  const referers = ref<Referer[]>([])
  const loading = ref<boolean>(false)
  const search = ref<string>('')
  const page = ref<number>(1)
  const itemsPerPage = ref<number>(10)
  const totalReferers = ref<number>(0)

  const selectedReferer = ref<Referer>()
  const showConfirmDelete = ref<boolean>(false)

  // Snackbar for notifications
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  })

  // Table headers with proper typing
  const headers = ref<DataTableHeader[]>([
    { title: 'Content', key: 'content', sortable: true },
    { title: 'createdAt', key: 'createdAt', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false },
  ])

  // Methods
  async function fetchReferers (): Promise<void> {
    loading.value = true
    try {
      const response = await api.get('/api/referers/paged', {
        page: page.value,
        limit: itemsPerPage.value,
      })
      console.log(response.data)

      referers.value = response.data.referers
      totalReferers.value = response.data.total
    } catch (error) {
      console.error('Error fetching referers:', error)
      showSnackbar('Error fetching referers', 'error')
      referers.value = []
    } finally {
      loading.value = false
    }
  }

  async function deleteReferer (): Promise<void> {
    loading.value = true
    try {
      const response = await api.delete('/api/referers/' + selectedReferer.value?._id, {
        id: selectedReferer.value?._id,
      })

      if (response.status === 200 || response.status === 201) {
        showSnackbar('Referer deleted', 'primary')
        fetchReferers()
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error deleting referers:', error)
      showSnackbar('Error deleting referer', 'error')
      showConfirmDelete.value = false
    } finally {
      loading.value = false
      showConfirmDelete.value = false
    }
  }

  function onSearch (): void {
    page.value = 1
    fetchReferers()
  }

  function editReferer (referer: Referer): void {
    console.log('Edit referer:', referer)
    showSnackbar(`Editing referer: ${referer.content}`, 'info')
  // Implement edit functionality
  }

  function confirmDeleteReferer (referer: Referer): void {
    // Implement delete functionality
    selectedReferer.value = referer
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
    fetchReferers()
  })
</script>
