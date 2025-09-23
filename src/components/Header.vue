<template>
  <v-app-bar app color="primary">
    <v-app-bar-title class="d-flex align-center">
      <RouterLink to="/">
        <v-icon class="mr-2" color="secondary" icon="mdi-music" size="x-large" />
      </RouterLink>
      <span class="font-weight-bold">{{ appName }}</span>
      <span class="ml-2 hidden-sm-and-down">{{ slogan }}</span>
    </v-app-bar-title>

    <v-spacer />

    <!-- Language Selector -->
    <v-menu>
      <template #activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-icon>mdi-translate</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="lang in languages"
          :key="lang.value"
          @click="setLanguage(lang.value)"
        >
          <v-list-item-title>{{ lang.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Theme Selector -->
    <v-menu>
      <template #activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="t in themes"
          :key="t.value"
          @click="setTheme(t.value)"
        >
          <v-list-item-title>{{ t.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Auth Section -->
    <SocialLogin v-if="!user" />
    <v-btn v-else icon @click="logout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import SocialLogin from '@/components/Auth/SocialLogin.vue'
  import { useAuthStore } from '@/stores/auth'
  import { useThemeStore } from '@/stores/theme'

  const { t, locale } = useI18n()
  const authStore = useAuthStore()
  const themeStore = useThemeStore()

  const appName = import.meta.env.VITE_APP_NAME
  const slogan = import.meta.env.VITE_APP_SLOGAN

  const user = computed(() => authStore.user)

  const languages = [
    { value: 'es', title: 'Español' },
    { value: 'en', title: 'English' },
    { value: 'fr', title: 'Français' },
  ]

  const themes = [
    { value: 'light', title: t('theme.light') },
    { value: 'dark', title: t('theme.dark') },
    { value: 'system', title: t('theme.system') },
  ]

  function setLanguage (lang: string) {
    locale.value = lang
    localStorage.setItem('language', lang)
  }

  function setTheme (theme: string) {
    themeStore.setTheme(theme)
  }

  function logout () {
    authStore.logout()
  }
</script>
