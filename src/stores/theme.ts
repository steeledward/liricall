import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark' | 'system'>('system')
  const currentTheme = ref<'light' | 'dark'>('light')

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
  if (savedTheme) {
    theme.value = savedTheme
  }

  // Watch for system theme changes
  watchEffect(() => {
    if (theme.value === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      currentTheme.value = prefersDark ? 'dark' : 'light'
    } else {
      currentTheme.value = theme.value
    }

    // Apply theme to document
    document.documentElement.dataset.theme = currentTheme.value
  })

  const setTheme = (newTheme: 'light' | 'dark' | 'system', p0?: number) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
  }

  return {
    theme,
    currentTheme,
    setTheme,
  }
})
