<script setup lang="ts">
const { data } = await useAsyncData('home', async () => {
  const [home, about, tatuaggi, dipinti] = await Promise.all([
    queryCollection('pagine').path('/pagine/home').first(),
    queryCollection('pagine').path('/pagine/chi-sono').first(),
    queryCollection('tatuaggi').order('data', 'DESC').limit(7).all(),
    queryCollection('dipinti').order('anno', 'DESC').limit(2).all(),
  ])
  return { home, about, tatuaggi, dipinti }
})

const home = computed(() => data.value?.home)
const about = computed(() => data.value?.about)
// Il tatuaggio più recente fa da hero, i successivi vanno nella selezione
const hero = computed(() => data.value?.tatuaggi[0])
const selection = computed(() => data.value?.tatuaggi.slice(1) ?? [])

usePageSeo({
  title: home.value?.title ?? 'Tatuaggi e dipinti',
  description: home.value?.description ?? '',
  image: hero.value?.image,
})
useHead({ titleTemplate: 'Jeanne Blue · %s' })
</script>

<template>
  <div>
    <HomeHero v-if="home?.hero && hero" :title="home.hero" :image="hero" />
    <HomeAbout v-if="about" :page="about" />

    <section class="tattoos" aria-labelledby="home-tatuaggi">
      <SiteContainer>
        <SectionHeading id="home-tatuaggi" title="Tatuaggi" :link="{ to: '/tatuaggi', label: 'Tutti i tatuaggi' }" />
        <TattooGrid :items="selection" />
      </SiteContainer>
    </section>

    <HomePaintings v-if="data?.dipinti.length" :items="data.dipinti" />

    <PageSection>
      <h2 class="contact-title">Prenota un tatuaggio</h2>
      <ContactLinks />
    </PageSection>
  </div>
</template>

<style scoped>
.tattoos {
  padding-bottom: var(--space-section);
}

.contact-title {
  margin-bottom: 2rem;
  font-size: var(--text-xl);
}
</style>
