<script setup lang="ts">
const { data: domande } = await useAsyncData('faq', () =>
  queryCollection('faq').order('ordine', 'ASC').all(),
)

useSeoMeta({ title: 'Domande frequenti' })
</script>

<template>
  <SiteContainer>
    <h1>Domande frequenti</h1>
    <section v-for="d in domande" :key="d.id">
      <h2>{{ d.title }}</h2>
      <ContentRenderer :value="d" />
    </section>
  </SiteContainer>
</template>
