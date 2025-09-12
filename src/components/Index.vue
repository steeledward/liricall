<template>
  <div>
    <v-app>
      <v-main>
        <v-container class="pa-6">
          <v-card class="mx-auto" elevation="4">
            <v-card-text class="text-center">
              <v-btn
                class="text-black"
                color="#ffc000"
                prepend-icon="mdi-credit-card"
                @click="goToOpenPay"
              >
                Pagar con tarjeta
              </v-btn>
            </v-card-text>
          </v-card>

          <v-card class="mx-auto" elevation="4">
            <v-card-title class="text-h5 v-card-title-color text-black">
              <v-icon class="mr-2" icon="mdi-music" />
              Liricall - Tu Historia en una Canción
            </v-card-title>

            <v-card-text class="pa-6">
              <v-form ref="form" v-model="valid" @click="handleSubmit">
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
                      color="#FFC000"
                      :disabled="!valid || loading"
                      :loading="loading"
                      size="large"
                    >
                      <template #loader>
                        <v-progress-circular
                          color="white"
                          indeterminate
                          size="24"
                        />
                      </template>
                      <v-icon class="mr-2" icon="mdi-send" />
                      Enviar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Success Dialog -->
          <v-dialog
            v-model="successDialog"
            max-width="500"
            @after-leave="resetForm"
          >
            <v-card>
              <v-card-title class="text-h6 v-card-title-color text-black">
                ¡Información enviada correctamente!
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
                <v-btn
                  class="primary-color"
                  @click="closeErrorDialog"
                >Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script setup lang="js">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useFormLibrary } from '@/composables/useFormLibrary'

  const form = ref(null)

  const router = useRouter()

  function goToOpenPay () {
    router.push({ path: '/openpay' }) // Make sure your route is named 'OpenPay'
  }

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
    submitForm,
    resetForm: resetFormComposable,
    closeSuccessDialog,
    closeErrorDialog,
  } = useFormLibrary()

  // Handle form submission
  async function handleSubmit () {
    const { valid: formValid } = await form.value.validate()

    if (formValid) {
      await submitForm()
    }
  }

  // Reset form with form reference
  function resetForm () {
    resetFormComposable(form.value)
  }
</script>

<style scoped>
.v-card {
  margin-top: 2rem;
}

.v-text-field,
.v-textarea {
  margin-bottom: 1.5rem;
}

.v-card-title-color {
  background-color: #ffc000;
}

.primary-color {
  color: #ffc000;
}
</style>
