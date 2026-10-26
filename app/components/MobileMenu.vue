<script setup lang="ts">
const open = ref(false)
const route = useRoute()

watch(() => route.path, () => (open.value = false))

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}
</script>

<template>
  <div class="menu" @keydown="onKeydown">
    <button
      type="button"
      class="toggle"
      :aria-expanded="open"
      aria-controls="menu-mobile"
      @click="open = !open"
    >
      {{ open ? 'Chiudi' : 'Menu' }}
    </button>
    <div v-show="open" id="menu-mobile" class="panel">
      <SiteContainer>
        <SiteNav stacked @navigate="open = false" />
      </SiteContainer>
    </div>
  </div>
</template>

<style scoped>
.toggle {
  min-height: 44px;
  padding: 0 0.25rem;
  border: 0;
  background: none;
  color: var(--accent);
  font: inherit;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.2em;
  cursor: pointer;
}

.panel {
  position: absolute;
  inset: 100% 0 auto;
  z-index: 20;
  padding-block: 1rem 2rem;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
}
</style>
