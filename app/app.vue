<script setup lang="ts">
import { joinURL } from 'ufo'

useSiteJsonLd()

// Favicon: goccia d'inchiostro (SVG), PNG per i browser senza SVG e icona per iOS.
// joinURL: con il percorso base (anteprima su GitHub Pages) '/...' punterebbe fuori dal sito
const { baseURL } = useRuntimeConfig().app
useHead({
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: joinURL(baseURL, 'favicon.svg') },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: joinURL(baseURL, 'favicon-32.png') },
    { rel: 'apple-touch-icon', href: joinURL(baseURL, 'apple-touch-icon.png') },
  ],
})

const { noindex } = useRuntimeConfig().public
if (noindex) useSeoMeta({ robots: 'noindex, nofollow' })
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
