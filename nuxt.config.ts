// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/image', '@nuxt/fonts'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/tokens.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'it' },
      titleTemplate: '%s · Jeanne Blue',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [{ rel: 'icon', href: '/favicon.ico' }],
    },
  },

  content: {
    // node:sqlite nativo (Node >= 22.5): evita la build di better-sqlite3
    experimental: { sqliteConnector: 'native' },
  },

  image: {
    formats: ['avif', 'webp'],
    screens: { sm: 480, md: 900, lg: 1280, xl: 1600 },
  },

  nitro: {
    prerender: { crawlLinks: true, routes: ['/'] },
  },
})
