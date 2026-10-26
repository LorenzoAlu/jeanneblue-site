<script setup lang="ts">
// Home provvisoria: verifica solo che i contenuti arrivino. Il layout vero dopo la fase design.
const { data: tatuaggi } = await useAsyncData('home-tatuaggi', () =>
  queryCollection('tatuaggi').order('data', 'DESC').limit(4).all(),
)
const { data: dipinti } = await useAsyncData('home-dipinti', () =>
  queryCollection('dipinti').order('anno', 'DESC').limit(3).all(),
)

useSeoMeta({ title: 'Tatuaggi e dipinti', titleTemplate: 'Jeanne Blue · %s' })
</script>

<template>
  <SiteContainer>
    <h1>Jeanne Blue</h1>

    <h2>Tatuaggi</h2>
    <ul>
      <li v-for="t in tatuaggi" :key="t.id">
        <NuxtImg :src="t.image" :alt="t.alt" width="400" height="500" loading="lazy" />
      </li>
    </ul>

    <h2>Dipinti</h2>
    <ul>
      <li v-for="d in dipinti" :key="d.id">
        <NuxtImg :src="d.image" :alt="d.alt" width="400" loading="lazy" />
        {{ d.titolo }}, {{ d.anno }}
      </li>
    </ul>
  </SiteContainer>
</template>
