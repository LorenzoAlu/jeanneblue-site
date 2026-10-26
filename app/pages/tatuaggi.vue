<script setup lang="ts">
const { data: tatuaggi } = await useAsyncData('tatuaggi', () =>
  queryCollection('tatuaggi').order('data', 'DESC').all(),
)

useSeoMeta({ title: 'Tatuaggi' })
</script>

<template>
  <SiteContainer>
    <h1>Tatuaggi</h1>
    <ul>
      <li v-for="t in tatuaggi" :key="t.id">
        <NuxtImg :src="t.image" :alt="t.alt" width="400" height="500" loading="lazy" />
        {{ t.stile }} · {{ t.zona }}
      </li>
    </ul>
  </SiteContainer>
</template>
