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
            <v-btn color="primary" :loading="loading" @click="fetchReviews">
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
        :items="reviews"
        :items-length="totalReviews"
        :loading="loading"
        :search="search"
        true
        @update:options="fetchReviews"
      >
        <template #item.review="{ item }">
          {{ item.review }}
        </template>

        <template #item.date="{ item }">
          {{ item.date }}
        </template>

        <template #item.actions="{ item }">
          <v-icon class="mr-2" color="primary" small @click="editReview(item)">
            mdi-pencil
          </v-icon>
          <v-icon color="error" small @click="confirmDeleteReview(item)">
            mdi-delete
          </v-icon>
        </template>

        <template #no-data>
          <v-btn color="primary" @click="fetchReviews"> Reset </v-btn>
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
            @click="deleteReview()"
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
  import type { Review } from '@/types/review'
  import { onMounted, ref } from 'vue'
  import { useApi } from '@/utils/api.ts'

  const api = useApi()

  // Reactive data
  const reviews = ref<Review[]>([])
  const loading = ref<boolean>(false)
  const search = ref<string>('')
  const page = ref<number>(1)
  const itemsPerPage = ref<number>(10)
  const totalReviews = ref<number>(0)

  const selectedReview = ref<Review>()
  const showConfirmDelete = ref<boolean>(false)

  // Snackbar for notifications
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  })

  // Table headers with proper typing
  const headers = ref<DataTableHeader[]>([
    { title: 'Review', key: 'review', sortable: true },
    { title: 'Date', key: 'date', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false },
  ])

  // Methods
  async function fetchReviews (): Promise<void> {
    loading.value = true
    try {
      const response = await api.get('/api/reviews/paged', {
        page: page.value,
        limit: itemsPerPage.value,
        search: search.value,
      })

      reviews.value = response.data.reviews
      totalReviews.value = response.data.total
    } catch (error) {
      console.error('Error fetching reviews:', error)
      showSnackbar('Error fetching reviews', 'error')
      reviews.value = []
    } finally {
      loading.value = false
    }
  }

  async function deleteReview (): Promise<void> {
    loading.value = true
    try {
      const response = await api.delete('/api/reviews/' + selectedReview.value?._id, {
        id: selectedReview.value?._id,
      })

      if (response.status === 200 || response.status === 201) {
        showSnackbar('Review deleted', 'primary')
        fetchReviews()
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error deleting reviews:', error)
      showSnackbar('Error deleting referer', 'error')
      showConfirmDelete.value = false
    } finally {
      loading.value = false
      showConfirmDelete.value = false
    }
  }

  function onSearch (): void {
    page.value = 1
    fetchReviews()
  }

  function editReview (referer: Review): void {
    showSnackbar(`Editing referer: ${referer.review}`, 'info')
  // Implement edit functionality
  }

  function confirmDeleteReview (referer: Review): void {
    // Implement delete functionality
    selectedReview.value = referer
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
    fetchReviews()
  })
</script>
