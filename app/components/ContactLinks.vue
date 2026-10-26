<script setup lang="ts">
const { contact } = useAppConfig()

const whatsappUrl = contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : null
const instagramDm = `https://ig.me/m/${contact.instagram}`
</script>

<template>
  <ul role="list" class="links">
    <li>
      <span class="kind">WhatsApp</span>
      <a v-if="whatsappUrl" :href="whatsappUrl" rel="noopener">Scrivimi su WhatsApp</a>
      <span v-else>[[DA CHIEDERE: numero WhatsApp]]</span>
    </li>
    <li>
      <span class="kind">Instagram</span>
      <a :href="instagramDm" rel="noopener">Mandami un DM a @{{ contact.instagram }}</a>
    </li>
    <li>
      <span class="kind">Studio</span>
      <address>
        {{ contact.studio.name }}<br>
        {{ contact.studio.street }}, {{ contact.studio.postalCode }} {{ contact.studio.city }}
      </address>
    </li>
  </ul>
</template>

<style scoped>
.links {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 900px) {
  .links {
    grid-template-columns: repeat(3, 1fr);
  }
}

.kind {
  display: block;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

a {
  font-size: var(--text-lg);
  font-weight: 700;
  line-height: 1.2;
}

address {
  font-style: normal;
}
</style>
