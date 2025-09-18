import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import es from '../locales/es.json'
import fr from '../locales/fr.json'

// Create messages objects
const messages = {
  es,
  en,
  fr,
}

// Get browser language or default to Spanish
const browserLang = navigator.language.split('-')[0]
const defaultLang = Object.keys(messages).includes(browserLang) ? browserLang : 'es'

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || defaultLang,
  fallbackLocale: 'es',
  messages,
})

export default i18n
