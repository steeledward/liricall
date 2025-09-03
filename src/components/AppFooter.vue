<template>
  <v-footer
    app
    height="40"
  >
    <a
      v-for="item in items"
      :key="item.title"
      class="d-inline-block mx-2 social-link"
      :href="item.href"
      rel="noopener noreferrer"
      target="_blank"
      :title="item.title"
    >
      <v-icon
        :icon="item.icon"
        :size="item.icon === '$vuetify' ? 24 : 16"
      />
    </a>

    <div
      class="text-caption text-disabled"
      style="position: absolute; right: 16px;"
    >
      &copy; {{ (new Date()).getFullYear() }} <span class="d-none d-sm-inline-block">Liricall, LLC</span>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
  const items = [
    {
      title: 'Administration',
      icon: 'mdi-shield-star-outline',
      href: 'https://www.appsheet.com/start/dc5de00c-91a8-4e58-998c-4ec2520f7ffe',
    },
    {
      title: 'YouTube',
      icon: 'mdi-youtube',
      href: 'https://www.youtube.com/@liricalling',
    },
    {
      title: 'Facebook',
      icon: 'mdi-facebook',
      href: 'https://www.facebook.com/profile.php?id=61579332326557',
    },
  ]
</script>

<style scoped lang="sass">
  .social-link :deep(.v-icon)
    color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
    text-decoration: none
    transition: .2s ease-in-out

    &:hover
      color: rgba(25, 118, 210, 1)
</style>
