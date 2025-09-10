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
    title: 'Título de la canción',
    story: 'Relato de la canción',
    description: 'Norteño Banda con toques de Trap',
    contact: '1111111111',
  })

  // Validation rules
  const titleRules = [
    value => !!value || 'Title is required',
    value => (value && value.length >= 3) || 'Title must be at least 3 characters',
    value => (value && value.length <= 100) || 'Title must be less than 100 characters',
  ]

  const storyRules = [
    value => !!value || 'Story is required',
    value => (value && value.length >= 10) || 'Story must be at least 10 characters',
    value => (value && value.length <= 1000) || 'Story must be less than 1000 characters',
  ]

  const descriptionRules = [
    value => !value || value.length <= 500 || 'Description must be less than 500 characters',
  ]

  const contactRules = [
    value => !!value || 'Contact information is required',
    value => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      return emailRegex.test(value) || phoneRegex.test(value) || 'Please enter a valid email or phone number'
    },
  ]

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
        createdAt: new Date().toISOString(),
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

    // Methods
    submitForm,
    resetForm,
    closeSuccessDialog,
    closeErrorDialog,
  }
}
