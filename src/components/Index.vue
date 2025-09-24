<template>
  <v-container max-width="600">
    <!-- Show information -->
    <v-card class="mb-5" elevation="4">
      <v-card-text>
        <v-alert>
          <span>
            Realiza una compra ficticia.
            Guarda el número de <strong>ID</strong> y aplícalo para crear <strong>Tú
              Historia en una Canción</strong> gratis. <router-link to="payment"><v-icon color="primary" icon="mdi-credit-card" /></router-link>
          </span>
        </v-alert>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto" elevation="4">
      <v-card-title class="text-h5">
        <v-icon class="mr-2" icon="mdi-music" />
        Liricall - Tu Historia en una Canción
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="form" v-model="valid" @click="handleSubmit">

          <!-- ID Field -->
          <v-text-field
            v-model="formData.sale_id"
            class="mb-4"
            clearable
            :disabled="loading"
            label="ID"
            required
            :rules="idRules"
            variant="outlined"
            @blur="handleValidateSaleId"
          ><v-badge class="mr-5" color="primary" :content="formData.credits" location="top right">
            <v-icon icon="mdi-credit-card" />
          </v-badge></v-text-field>

          <!-- Title Field -->
          <v-text-field
            v-model="formData.title"
            class="mb-4"
            clearable
            :disabled="loading"
            label="Título"
            prepend-inner-icon="mdi-format-title"
            required
            :rules="titleRules"
            variant="outlined"
          />

          <!-- Story Field -->
          <v-textarea
            v-model="formData.story"
            auto-grow
            class="mb-4"
            clearable
            :disabled="loading"
            label="Relato"
            prepend-inner-icon="mdi-book-open-page-variant"
            required
            rows="4"
            :rules="storyRules"
            variant="outlined"
          />

          <!-- Description Field -->
          <v-textarea
            v-model="formData.description"
            auto-grow
            class="mb-4"
            clearable
            :disabled="loading"
            label="¿Cómo quieres que se escuche?"
            prepend-inner-icon="mdi-music"
            rows="3"
            :rules="descriptionRules"
            variant="outlined"
          />

          <!-- Contact Field -->
          <v-text-field
            v-model="formData.contact"
            class="mb-4"
            clearable
            :disabled="loading"
            label="Información de Contacto"
            prepend-inner-icon="mdi-email"
            required
            :rules="contactRules"
            variant="outlined"
          />

          <!-- Action Buttons -->
          <v-row class="mt-4">
            <v-col cols="6">
              <v-btn
                block
                color="secondary"
                :disabled="loading"
                size="large"
                variant="outlined"
                @click="resetForm"
              >
                <v-icon class="mr-2" icon="mdi-refresh" />
                Borrar
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                block
                color="primary"
                :disabled="!valid || loading || formData.credits == 0"
                :loading="loading"
                size="large"
              >
                <template #loader>
                  <v-progress-circular color="white" indeterminate size="24" />
                </template>
                <v-icon class="mr-2" icon="mdi-send" />
                Crear Canción
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="500" @after-leave="resetForm">
      <v-card>
        <v-card-title>
          ¡Tu Historia en una Canción enviada correctamente!
        </v-card-title>
        <v-card-text class="pa-4">
          <p><strong>Título:</strong> {{ formData.title }}</p>
          <p><strong>Relato:</strong> {{ formData.story }}</p>
          <p><strong>Música:</strong> {{ formData.description }}</p>
          <p><strong>Contacto:</strong> {{ formData.contact }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="primary-color"
            @click="closeSuccessDialog"
          >Enterado</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Error Dialog -->
    <v-dialog v-model="errorDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6 bg-error text-white">
          <v-icon class="mr-2" icon="mdi-alert-circle" />
          Error al enviar
        </v-card-title>
        <v-card-text class="pa-4">
          <p>{{ errorMessage }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="primary-color" @click="closeErrorDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useFormLibrary } from '@/composables/useFormIndex'

  const router = useRouter()

  interface QueryParams {
    id?: string | undefined
  }

  const route = useRoute()
  const query = route.query as QueryParams

  const form = ref(null)

  // Use the composable
  const {
    valid,
    loading,
    successDialog,
    errorDialog,
    errorMessage,
    formData,
    titleRules,
    storyRules,
    descriptionRules,
    contactRules,
    idRules,
    validateSaleId,
    submitForm,
    resetForm: resetFormComposable,
    closeSuccessDialog,
    closeErrorDialog,
  } = useFormLibrary()

  formData.sale_id = query.id

  // Handle form submission
  async function handleSubmit () {
    if (form.value) {
      const { valid: formValid } = await (form.value as any).validate()

      if (formValid && formData.credits > 0) {
        await submitForm()
      }
    }
  }

  // Handle form submission
  async function handleValidateSaleId () {
    if (formData.sale_id) {
      const data = await validateSaleId()
      formData.credits = data.data.availables
    }
  }

  // Reset form with form reference
  function resetForm () {
    resetFormComposable()
    router.push('/')
  }
</script>
<style scoped>
.v-card {
  max-width: 700px;
  margin: auto;
  margin-top: 20px;
}
</style>
