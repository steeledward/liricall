import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          primary: '#ffc000',
          secondary: '#66BB6A',
          accent: '#8BC34A',
        },
      },
      dark: {
        colors: {
          primary: '#ffc000',
          secondary: '#000',
          accent: '#8BC34A',
        },
      },
    },
  },
})
