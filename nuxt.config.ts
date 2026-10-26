import { fileURLToPath } from 'node:url'
import { imageSizeFromFile } from 'image-size/fromFile'

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
      script: [
        {
          // Prima del primo paint: segna che le animazioni partiranno, così il CSS
          // può nascondere da subito ciò che entra animato (niente flash).
          innerHTML: "matchMedia('(prefers-reduced-motion: reduce)').matches||(document.documentElement.dataset.motion='')",
          tagPosition: 'head',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      // [[DA CHIEDERE: dominio]] — serve per canonical, OG e JSON-LD
      siteUrl: 'https://jeanneblue.ink',
      // true sulle anteprime (NUXT_PUBLIC_NOINDEX=true): niente indicizzazione di bozze
      noindex: false,
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
    quality: 72,
    screens: { xs: 390, sm: 480, md: 900, lg: 1280, xl: 1600 },
  },

  hooks: {
    // I dipinti caricati dal pannello non hanno width/height: li leggo dalla foto
    async 'content:file:afterParse'({ collection, content }) {
      if (collection.name !== 'dipinti') return
      const painting = content as { image?: string, width?: number, height?: number }
      if (!painting.image || (painting.width && painting.height)) return
      const file = fileURLToPath(new URL(`./public${painting.image}`, import.meta.url))
      const size = await imageSizeFromFile(file)
      // Foto del telefono ruotate via EXIF (5-8): larghezza e altezza scambiate
      const rotated = (size.orientation ?? 1) >= 5
      painting.width = rotated ? size.height : size.width
      painting.height = rotated ? size.width : size.height
    },
  },

  nitro: {
    prerender: { crawlLinks: true, routes: ['/'] },
  },
})
