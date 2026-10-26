<script setup lang="ts">
useSiteJsonLd()

const { noindex } = useRuntimeConfig().public
if (noindex) useSeoMeta({ robots: 'noindex, nofollow' })
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
