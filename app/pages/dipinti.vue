<script setup lang="ts">
const { data: dipinti } = await useAsyncData('dipinti', () =>
  queryCollection('dipinti').order('anno', 'DESC').all(),
)

useSeoMeta({ title: 'Dipinti' })
</script>

<template>
  <SiteContainer>
    <h1>Dipinti</h1>
    <ul>
      <li v-for="d in dipinti" :key="d.id">
        <NuxtImg :src="d.image" :alt="d.alt" width="400" loading="lazy" />
        {{ d.titolo }}, {{ d.anno }} · {{ d.tecnica }} · {{ d.misure }} · {{ d.stato }}
      </li>
    </ul>
  </SiteContainer>
</template>
