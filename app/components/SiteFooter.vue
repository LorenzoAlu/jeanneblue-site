<script setup lang="ts">
const { site, contact } = useAppConfig()
</script>

<template>
  <footer class="footer">
    <SiteContainer class="inner">
      <div>
        <p class="name">{{ site.name }}</p>
        <p>
          <a :href="`https://www.instagram.com/${contact.instagram}/`" rel="noopener">@{{ contact.instagram }}</a>
        </p>
        <address>
          {{ contact.studio.name }}<br>
          {{ contact.studio.street }}, {{ contact.studio.postalCode }} {{ contact.studio.city }}
        </address>
      </div>
      <div class="legal">
        <p>P.IVA {{ contact.vat }}</p>
        <p>
          <NuxtLink to="/privacy">Privacy</NuxtLink>
          ·
          <NuxtLink to="/cookie">Cookie</NuxtLink>
        </p>
      </div>
    </SiteContainer>
  </footer>
</template>

<style scoped>
.footer {
  padding-block: 3rem;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: var(--text-sm);
}

.inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5rem;
}

.name {
  color: var(--accent);
  font-weight: 700;
}

address {
  font-style: normal;
}

.legal a {
  color: inherit;
}
</style>
