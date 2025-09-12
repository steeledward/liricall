<template>
  <v-container>
    <v-card class="mx-auto" elevation="4">
      <v-card-text class="text-center">
        <v-row>
          <v-col>
            <v-btn
              class="text-black"
              color="#ffc000"
              prepend-icon="mdi-music"
              @click="goToCreateSong"
            >
              Crear Canción
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              class="text-black"
              color="#ffc000"
              prepend-icon="mdi-credit-card"
              @click="goToOpenPay"
            >
              Pagar con tarjeta
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
  <v-container class="fill-height" fluid>
    <iframe
      allowfullscreen
      frameborder="0"
      src="https://www.appsheet.com/start/b704b4e4-6206-4e16-8389-aafa864cff2a"
      style="width: 100%; height: 100%"
    />
  </v-container>
</template>
<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const router = useRouter()

  function goToCreateSong () {
    router.push({ path: '/' })
  }

  function goToOpenPay () {
    router.push({ path: '/openpay' }) // Make sure your route is named 'OpenPay'
  }
</script>
