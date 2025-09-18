<template>
  <v-footer app class="py-5" color="primary">
    <v-container>
      <v-row>
        <v-col class="text-center text-md-left" cols="12" md="4">
          <h3 class="text-h5 font-weight-bold mb-4">{{ appName }}</h3>
          <p class="mb-4">{{ slogan }}</p>
          <p class="text-caption">© {{ new Date().getFullYear() }} {{ appName }}. Todos los derechos reservados.</p>
        </v-col>

        <v-col class="text-center" cols="12" md="4">
          <h4 class="text-h6 mb-4">Enlaces rápidos</h4>
          <v-btn color="white" to="/" variant="text">Crear Canción</v-btn>
          <v-btn color="white" to="/payment" variant="text">Comprar</v-btn>
          <v-btn color="white" to="/libraries" variant="text">Biblioteca</v-btn>
        </v-col>

        <v-col class="text-center" cols="12" md="4">
          <h4 class="text-h6 mb-4">Síguenos</h4>
          <div>
            <v-btn
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              icon
              size="large"
              target="_blank"
              variant="text"
            >
              <v-icon size="x-large">{{ social.icon }}</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
  const appName = import.meta.env.VITE_APP_NAME
  const slogan = import.meta.env.VITE_APP_SLOGAN

  const socialLinks = [
    { name: 'Facebook', icon: 'mdi-facebook', url: 'https://www.facebook.com/liricall/' },
    { name: 'Instagram', icon: 'mdi-instagram', url: 'https://instagram.com/liricalling' },
    { name: 'YouTube', icon: 'mdi-youtube', url: 'https://www.youtube.com/@liricalling' },
  ]
</script>
