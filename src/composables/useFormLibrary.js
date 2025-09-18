// composables/useFormLibrary.js
import { reactive, ref } from 'vue'
import { useApi } from './useApi'

export function useFormLibrary () {
  const { api } = useApi()

  const valid = ref(false)
  const loading = ref(false)
  const successDialog = ref(false)
  const errorDialog = ref(false)
  const errorMessage = ref('')

  const formData = reactive({
    title: '',
    story: '',
    description: '',
    contact: '',
    sale_id: '',
    credits: 0,
  })

  // Validation rules
  const titleRules = [
    value => !!value || 'Título es requerido',
    value => (value && value.length >= 3) || 'Título debe ser al menos 3 caracteres',
    value => (value && value.length <= 50) || 'Título debe ser máximo 50 caracteres',
  ]

  const storyRules = [
    value => !!value || 'Relato es requerido',
    value => (value && value.length >= 50) || 'Relato debe ser al menos 50 caracteres',
    value => (value && value.length <= 1000) || 'Relato de ser máximo 1000 caracteres',
  ]

  const descriptionRules = [
    value => !!value || 'Descripción musical es requerida',
    value => !value || value.length <= 500 || 'Descripción musical debe ser máximo 500 caracteres',
  ]

  const contactRules = [
    value => !!value || 'Información de contacto es requerida, inventa un email o teléfono, tus datos están protegidos',
    value => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      return emailRegex.test(value) || phoneRegex.test(value) || 'Escribe un email o teléfono valido'
    },
  ]

  const idRules = [
    value => !!value || 'ID de AUTORIZACIÓN es requerido. Realiza una compra ficticia',
    value => !value || value.length >= 20 || 'ID de AUTORIZACIÓN debe ser al menos de 20 caracteres',
    value => !value || value.length <= 30 || 'ID de AUTORIZACIÓN debe ser máximo 30 caracteres',
  ]

  const validateSaleId = async () => {
    loading.value = true

    try {
      // Use the api instance instead of axios directly
      const response = await api.get('/api/credits/available/' + formData.sale_id, {
        sale_id: formData.sale_id,
      })

      if (response.status === 200 || response.status === 201) {
        formData.credits = response.data.available

        return { success: true, data: response.data }
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)

      if (error.response) {
        errorMessage.value = `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
      } else if (error.request) {
        errorMessage.value = 'Network error: Please check your connection and try again.'
      } else {
        errorMessage.value = `Error: ${error.message}`
      }

      errorDialog.value = true
      return { success: false, error: errorMessage.value }
    } finally {
      loading.value = false
    }
  }

  // Submit form to API
  const submitForm = async () => {
    loading.value = true

    try {
      // Use the api instance instead of axios directly
      const response = await api.post('/api/libraries', {
        title: formData.title,
        story: formData.story,
        description: formData.description,
        contact: formData.contact,
        quantiy: formData.quantity,
        createdAt: new Date().toISOString(),
        sale_id: formData.sale_id,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200 || response.status === 201) {
        successDialog.value = true
        return { success: true, data: response.data }
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)

      if (error.response) {
        errorMessage.value = `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
      } else if (error.request) {
        errorMessage.value = 'Network error: Please check your connection and try again.'
      } else {
        errorMessage.value = `Error: ${error.message}`
      }

      errorDialog.value = true
      return { success: false, error: errorMessage.value }
    } finally {
      loading.value = false
    }
  }

  // Reset form
  const resetForm = (formRef = null) => {
    if (formRef) {
      formRef.reset()
    }
    Object.assign(formData, {
      title: '',
      story: '',
      description: '',
      contact: '',
      sale_id: '',
      credits: 0,
    })
    errorDialog.value = false
    errorMessage.value = ''
  }

  // Close dialogs
  const closeSuccessDialog = () => {
    successDialog.value = false
  }

  const closeErrorDialog = () => {
    errorDialog.value = false
    errorMessage.value = ''
  }

  return {
    // State
    valid,
    loading,
    successDialog,
    errorDialog,
    errorMessage,
    formData,

    // Rules
    titleRules,
    storyRules,
    descriptionRules,
    contactRules,
    idRules,

    // Methods
    validateSaleId,
    submitForm,
    resetForm,
    closeSuccessDialog,
    closeErrorDialog,
  }
}
