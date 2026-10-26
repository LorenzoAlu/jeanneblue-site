<template>
  <section class="section">
    <SiteContainer>
      <slot />
    </SiteContainer>
  </section>
</template>

<style scoped>
.section {
  padding-block: var(--space-section);
}
</style>
