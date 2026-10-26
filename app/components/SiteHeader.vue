<script setup lang="ts">
const links = [
  { to: '/tatuaggi', label: 'Tatuaggi' },
  { to: '/dipinti', label: 'Dipinti' },
  { to: '/chi-sono', label: 'Chi sono' },
  { to: '/cura', label: 'Cura' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contatti', label: 'Contatti' },
]
</script>

<template>
  <header>
    <a class="skip" href="#contenuto">Vai al contenuto</a>
    <SiteContainer>
      <NuxtLink to="/">Jeanne Blue</NuxtLink>
      <nav aria-label="Principale">
        <ul>
          <li v-for="link in links" :key="link.to">
            <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </SiteContainer>
  </header>
</template>

<style scoped>
.skip {
  position: absolute;
  left: -9999px;
}

.skip:focus {
  left: var(--gutter);
  top: 0.5rem;
}
</style>
