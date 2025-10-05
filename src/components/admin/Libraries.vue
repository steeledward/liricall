<template>
  <v-app>
    <v-main>
      <v-container>
        <!-- Table View -->
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
            <template #item.title="{ item }">
              {{ item.title }}
            </template>

            <template #item.story="{ item }">
              {{ sliceString(item.story) }}
            </template>

            <template #item.lyric="{ item }">
              {{ sliceString(item.lyric) }}
            </template>

            <template #item.date="{ item }">
              {{ item.date }}
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
              <span>Are you sure you want to delete this item? {{ selectedLibrary?.title }}</span>
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
        <!-- Edit Form Sidebar -->
        <!-- Overlay Background -->
        <div
          v-if="formVisible"
          class="overlay-background"
          @click="formVisible=false"
        />

        <!-- Slide-out Form Overlay -->
        <div
          class="form-overlay"
          :class="{ 'form-overlay--visible': formVisible }"
        >
          <v-card class="form-card">
            <v-card-title class="d-flex justify-space-between align-center">
              <span class="text-h6">{{ selectedLibrary?.title }}</span>
              <v-btn class="close-btn" icon @click="formVisible=false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>

            <v-divider />

            <v-card-text class="pa-6">
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="title"
                      label="Title"
                      required
                      :rules="[v => !!v || 'Title is required']"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="story"
                      label="Story"
                      required
                      rows="5"
                      :rules="[v => !!v || 'Story is required']"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="lyric"
                      label="Lyric"
                      required
                      rows="5"
                      :rules="[v => !!v || 'Lyric is required']"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-form>
              <v-row>
                <v-col cols="12">
                  <!-- Image Upload Field -->
                  <v-file-input
                    ref="fileInput"
                    v-model="imageFile"
                    accept="image/*"
                    :error-messages="imageErrors"
                    label="Upload Image"
                    prepend-icon="mdi-camera"
                    @change="handleFileSelect"
                    @click:clear="clearImage"
                  />
                </v-col>
                <v-col cols="12">
                  <!-- Image Preview -->
                  <v-card v-if="previewUrl" class="mt-4" max-width="300">
                    <v-img contain height="200" :src="previewUrl" />
                    <v-card-actions>
                      <v-btn color="error" @click="clearImage">Remove Image</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <!-- Upload Button -->
                  <v-btn
                    class="mt-4"
                    color="primary"
                    :disabled="!isFormValid"
                    :loading="uploading"
                    @click="handleSubmitPortrait"
                  >
                    Upload Image
                  </v-btn>
                </v-col>
                <!-- Error Message -->
                <div v-if="error" class="error-message">
                  {{ error }}
                </div>
              </v-row>
            </v-card-text>

            <v-divider />

            <v-card-actions class="pa-4">
              <v-spacer />
              <v-btn
                class="mr-3"
                variant="outlined"
                @click="formVisible=false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                :disabled="!valid"
                :loading="saving"
                @click="addUpdateLibrary"
              >
                {{ selectedLibrary ? 'Update' : 'Add' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-container>
    </v-main>
  </v-app>
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

  // Add or Update Library
  const formVisible = ref<boolean>(false)
  const title = ref<string>('')
  const story = ref<string>('')
  const lyric = ref<string>('')
  const valid = ref<boolean>(false)
  const saving = ref<boolean>(false)

  // Portrait upload
  const imageFile = ref<File | null>(null)
  const imagePreview = ref<string>('')
  const imageErrors = ref<string>('')
  const uploading = ref<boolean>(false)
  const selectedFile = ref<File | null>(null)
  const error = ref<string>('')
  const previewUrl = ref<string>('')

  // Validation rules
  const config = {
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    maxSize: 5 * 1024 * 1024, // 5MB
  }

  // Snackbar for notifications
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  })

  // Table headers with proper typing
  const headers = ref<DataTableHeader[]>([
    { title: 'Title', key: 'title', sortable: true },
    { title: 'Story', key: 'story', sortable: true },
    { title: 'Lyric', key: 'lyric', sortable: true },
    { title: 'Date', key: 'date', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false },
  ])

  function sliceString (fullString: string) {
    return fullString ? fullString.toString().slice(0, 20) : ''
  }

  // Computed properties
  const isFormValid = computed(() => {
    return imageFile.value && !imageErrors.value
  })

  function validateAndSetFile (file: File): void {
    console.log('Validating and setting file')

    error.value = ''

    // Check file type
    /*
    if (!config.allowedExtensions.includes(file.type)) {
      error.value = 'Invalid file type. Please select an image file.'
      return
    }
    */

    // Check file size
    if (file.size > config.maxSize) {
      error.value = `File size too large. Maximum size is ${config.maxSize / 1024 / 1024}MB.`
      return
    }

    selectedFile.value = file
    // emit('fileSelected', file)
    console.log(selectedFile.value)

    // Create preview
    const reader = new FileReader()
    reader.addEventListener('load', e => {
      previewUrl.value = e.target?.result as string
    })
    reader.readAsDataURL(file)
  }

  function handleFileSelect (event: Event): void {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (file) {
      validateAndSetFile(file)
    }
  }

  // Clear image
  function clearImage () {
    imageFile.value = null
    imagePreview.value = ''
    imageErrors.value = ''
  }

  // Methods

  async function handleSubmitPortrait (): Promise<void> {
    if (!isFormValid.value) return

    loading.value = true
    uploading.value = true

    try {
      if (selectedFile.value) {
        const formData = new FormData()
        formData.append('image', selectedFile.value)
        // formData.append('_id', selectedLibrary.value?._id)

        const response = await api.post('/api/libraries/portrait', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        console.log(response.data)

        if (response.status === 200 || response.status === 201) {
          showSnackbar('Portrait updated', 'primary')
          fetchLibraries()
        } else {
          throw new Error(`Unexpected response status: ${response.status}`)
        }
      }
    } catch (error) {
      console.error('Error updating portrait:', error)
      showSnackbar('Error updating portrait', 'error')
      showConfirmDelete.value = false
    } finally {
      loading.value = false
      uploading.value = false
    }
  }

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

  async function updateLibrary (): Promise<void> {
    if (selectedLibrary.value) {
      loading.value = true
      try {
        const response = await api.put('/api/libraries/' + selectedLibrary.value?._id, {
          _id: selectedLibrary.value?._id,
          title: title.value,
          story: story.value,
          lyric: lyric.value,
        })

        if (response.status === 200 || response.status === 201) {
          showSnackbar('Library updated', 'primary')
          fetchLibraries()
          formVisible.value = false
          selectedLibrary.value = undefined
        } else {
          throw new Error(`Unexpected response status: ${response.status}`)
        }
      } catch (error) {
        console.error('Error deleting libraries:', error)
        showSnackbar('Error deleting library', 'error')
        showConfirmDelete.value = false
      } finally {
        loading.value = false
      }
    }
  }

  function addUpdateLibrary () {
    if (selectedLibrary.value) {
      updateLibrary()
    }
  }

  function onSearch (): void {
    page.value = 1
    fetchLibraries()
  }

  function editLibrary (library: Library): void {
    // Implement edit functionality
    selectedLibrary.value = library

    title.value = library.title
    story.value = library.story
    lyric.value = library.lyric

    formVisible.value = true
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

  // Watch for file changes
  watch(imageFile, newFile => {
    if (!newFile) {
      imagePreview.value = ''
    }
  })

  // Lifecycle hooks
  onMounted(() => {
    fetchLibraries()
  })
</script>
<style scoped>
.overlay-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

.form-overlay {
  position: fixed;
  top: 0;
  right: -600px;
  width: 600px;
  height: 100vh;
  background: white;
  z-index: 1000;
  transition: right 0.3s ease;
  overflow-y: auto;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
}

.form-overlay--visible {
  right: 0;
}

.form-card {
  height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.form-card .v-card-text {
  flex: 1;
  overflow-y: auto;
}

.close-btn {
  transition: transform 0.2s ease;
}

.close-btn:hover {
  transform: rotate(90deg);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .form-overlay {
    width: 100vw;
    right: -100vw;
  }
}

/* Custom scrollbar for form */
.form-card .v-card-text::-webkit-scrollbar {
  width: 6px;
}

.form-card .v-card-text::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.form-card .v-card-text::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.form-card .v-card-text::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
