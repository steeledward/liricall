import { ref } from 'vue'

export interface SnackbarOptions {
  color?: string
  timeout?: number
  location?: 'top' | 'bottom' | 'left' | 'right'
}

export function useSnackbar () {
  const message = ref('')
  const visible = ref(false)
  const color = ref('primary')
  const timeout = ref(3000)
  const location = ref('bottom')

  function showSnackbar (text: string, options: SnackbarOptions = {}) {
    message.value = text
    color.value = options.color || 'primary'
    timeout.value = options.timeout || 3000
    location.value = options.location || 'bottom'
    visible.value = true
  }

  function showSuccess (text: string, options: Omit<SnackbarOptions, 'color'> = {}) {
    showSnackbar(text, { ...options, color: 'success' })
  }

  function showError (text: string, options: Omit<SnackbarOptions, 'color'> = {}) {
    showSnackbar(text, { ...options, color: 'error' })
  }

  function showWarning (text: string, options: Omit<SnackbarOptions, 'color'> = {}) {
    showSnackbar(text, { ...options, color: 'warning' })
  }

  function showInfo (text: string, options: Omit<SnackbarOptions, 'color'> = {}) {
    showSnackbar(text, { ...options, color: 'info' })
  }

  function hideSnackbar () {
    visible.value = false
  }

  return {
    message,
    visible,
    color,
    timeout,
    location,
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideSnackbar,
  }
}
