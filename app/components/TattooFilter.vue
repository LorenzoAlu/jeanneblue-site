<script setup lang="ts">
defineProps<{ options: string[] }>()
const model = defineModel<string | null>({ required: true })
</script>

<template>
  <div class="filter" role="group" aria-label="Filtra per stile">
    <button type="button" class="option" :aria-pressed="model === null" @click="model = null">
      Tutti
    </button>
    <button
      v-for="option in options"
      :key="option"
      type="button"
      class="option"
      :aria-pressed="model === option"
      @click="model = option"
    >
      {{ option }}
    </button>
  </div>
</template>

<style scoped>
.filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
}

.option {
  min-height: 44px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  cursor: pointer;
}

.option:hover {
  color: var(--accent);
}

.option[aria-pressed='true'] {
  color: var(--accent);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 0.35em;
}
</style>
