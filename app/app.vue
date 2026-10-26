<script setup lang="ts">
import { joinURL } from 'ufo'

useSiteJsonLd()

// Con il percorso base (anteprima su GitHub Pages) '/favicon.ico' punterebbe fuori dal sito
useHead({ link: [{ rel: 'icon', href: joinURL(useRuntimeConfig().app.baseURL, 'favicon.ico') }] })

const { noindex } = useRuntimeConfig().public
if (noindex) useSeoMeta({ robots: 'noindex, nofollow' })
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
