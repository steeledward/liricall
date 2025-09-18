<template>
  <v-app :theme="theme">
    <Header />
    <v-main>
      <router-view />
    </v-main>
    <Footer />
    <GlobalSnackbar />
  </v-app>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import Footer from '@/components/Footer.vue'
  import GlobalSnackbar from '@/components/GlobalSnackbar.vue'
  import Header from '@/components/Header.vue'
  import { useThemeStore } from '@/stores/theme'

  const themeStore = useThemeStore()
  const theme = computed(() => themeStore.currentTheme)
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
</style>
