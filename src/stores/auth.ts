import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../utils/api'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const { post } = useApi()

  const loginWithGoogle = async () => {
    try {
      // Implement Google OAuth2 flow
      // This would typically redirect to Google's auth endpoint
      // and handle the callback
      const response = await post('/auth/google')
      user.value = response.data.user
      isAuthenticated.value = true
    } catch (error) {
      console.error('Google login failed', error)
    }
  }

  const loginWithFacebook = async () => {
    try {
      // Implement Facebook OAuth2 flow
      const response = await post('/auth/facebook')
      user.value = response.data.user
      isAuthenticated.value = true
    } catch (error) {
      console.error('Facebook login failed', error)
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    // Additional cleanup as needed
  }

  return {
    user,
    isAuthenticated,
    loginWithGoogle,
    loginWithFacebook,
    logout,
  }
})
