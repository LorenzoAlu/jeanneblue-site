<script setup lang="ts">
const { data: domande } = await useAsyncData('faq', () =>
  queryCollection('faq').order('ordine', 'ASC').all(),
)

usePageSeo({
  title: 'Domande frequenti',
  description: 'Prenotazioni, prezzi e tutto quello che mi chiedete più spesso.',
})
</script>

<template>
  <SiteContainer class="page">
    <PageIntro title="Domande frequenti" />
    <div class="list">
      <details v-for="d in domande" :key="d.id" class="item">
        <summary>{{ d.title }}</summary>
        <ProseContent :value="d" class="answer" />
      </details>
    </div>
    <p class="more">
      Non trovi la risposta? <NuxtLink to="/contatti">Scrivimi</NuxtLink>.
    </p>
  </SiteContainer>
</template>

<style scoped>
.page {
  padding-bottom: var(--space-section);
}

.list {
  max-width: 48rem;
  border-top: 1px solid var(--line);
}

.item {
  border-bottom: 1px solid var(--line);
}

summary {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 1.25rem;
  color: var(--accent);
  font-size: var(--text-lg);
  font-weight: 700;
  line-height: 1.25;
  list-style: none;
  cursor: pointer;
}

summary::-webkit-details-marker {
  display: none;
}

summary::after {
  content: '+';
  font-family: var(--font-mono);
  font-weight: 400;
}

.item[open] summary::after {
  content: '−';
}

.answer {
  padding-bottom: 1.5rem;
}

.more {
  margin-top: 2.5rem;
}
</style>
