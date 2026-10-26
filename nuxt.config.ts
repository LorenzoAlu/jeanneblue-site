// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/image', '@nuxt/fonts'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/tokens.css', '~/assets/css/transitions.css'],

  // View transition usata solo per il passaggio foglio -> parete dei dipinti, vedi transitions.css
  experimental: { viewTransition: true },

  app: {
    head: {
      htmlAttrs: { lang: 'it' },
      titleTemplate: '%s · Jeanne Blue',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'icon', href: '/favicon.ico' }],
    },
  },

  runtimeConfig: {
    public: {
      // [[DA CHIEDERE: dominio]] — serve per canonical, OG e JSON-LD
      siteUrl: 'https://jeanneblue.ink',
    },
  },

  content: {
    // node:sqlite nativo (Node >= 22.5): evita la build di better-sqlite3
    experimental: { sqliteConnector: 'native' },
  },

  fonts: {
    defaults: { weights: [400, 700], styles: ['normal'], subsets: ['latin'] },
  },

  image: {
    format: ['avif', 'webp'],
    screens: { xs: 390, sm: 480, md: 900, lg: 1280, xl: 1600 },
  },

  nitro: {
    prerender: { crawlLinks: true, routes: ['/'] },
  },
})
