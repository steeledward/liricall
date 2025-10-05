<template>
  <v-container>
    <!-- Controls -->
    <v-card class="controls-container bg-primary">
      <v-row class="mt-5 ml-5 mr-5">
        <v-col cols="12" md="3" sm="6">
          <v-text-field
            v-model="search"
            clearable
            label="Buscar"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-select
            v-model="filterCategory"
            clearable
            :items="categories"
            label="Filtrar por Genero"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            label="Ordenar por"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-btn
            block
            color="primary"
            prepend-icon="mdi-plus"
            variant="flat"
          >
            Crear Canción
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Card Grid -->
    <v-row class="mt-5">
      <v-col
        v-for="(library, index) in libraries"
        :key="library._id"
        class="staggered-item"
        cols="12"
        lg="3"
        md="4"
        sm="6"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <v-card
          class="card-container mx-auto"
          elevation="6"
          rounded="lg"
        >
          <div class="position-relative">
            <v-img
              class="card-image align-end"
              cover
              gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5)"
              src="/src/assets/libraries/liricall.jpeg"
            >
              <v-card-title class="card-title text-white">
                {{ library.title }}
              </v-card-title>
            </v-img>

            <v-chip
              class="card-tag ma-2"
              label
              size="small"
            >
              {{ library.date }}
            </v-chip>
          </div>

          <v-card-text class="card-description pt-4">
            {{ sliceString(library.story) }}
          </v-card-text>

          <v-card-actions class="card-actions">
            <div>
              <v-icon :color="getRatingColor(library.stars)" size="small">mdi-star</v-icon>
              <span class="text-caption ml-1">{{ library.stars }}</span>
            </div>

            <div>
              <v-btn
                color="primary"
                icon
                size="small"
                variant="text"
              >
                <v-icon>
                  {{ library.stars > 3 ? 'mdi-heart' : 'mdi-heart-outline' }}
                </v-icon>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
  import type { Library } from '@/types/library'
  import { useApi } from '@/utils/api.ts'
  const api = useApi()

  // ------------------------------------------------------
  const search = ref('')
  const filterCategory = ref(null)
  const sortBy = ref('title')

  const categories = [
    'Technology',
    'Design',
    'Business',
    'Science',
    'Art',
    'Travel',
  ]

  const sortOptions = [
    { title: 'Title', value: 'title' },
    { title: 'Rating', value: 'rating' },
    { title: 'Newest', value: 'newest' },
    { title: 'Oldest', value: 'oldest' },
  ]

  function getRatingColor (rating) {
    if (rating >= 4.5) return 'yellow-darken-3'
    if (rating >= 4) return 'green'
    if (rating >= 3.5) return 'blue'
    return 'grey'
  }

  // ----------------------------------------------------
  // Reactive data
  const libraries = ref<Library[]>([])
  const loading = ref<boolean>(false)
  const page = ref<number>(1)
  const itemsPerPage = ref<number>(10)
  const totalLibraries = ref<number>(0)

  // Snackbar for notifications
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  })

  function sliceString (fullString: string) {
    return fullString ? fullString.toString().slice(0, 200) : ''
  }

  async function fetchLibraries (): Promise<void> {
    loading.value = true
    try {
      const response = await api.get('/api/libraries', {
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
