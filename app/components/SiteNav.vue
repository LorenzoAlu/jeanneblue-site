<script setup lang="ts">
defineProps<{ stacked?: boolean }>()
defineEmits<{ navigate: [] }>()
</script>

<template>
  <nav aria-label="Principale">
    <ul role="list" :class="['list', { stacked }]">
      <li v-for="link in mainNav" :key="link.to">
        <NuxtLink :to="link.to" class="link" @click="$emit('navigate')">{{ link.label }}</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.list {
  display: flex;
  gap: 1.75rem;
}

.list.stacked {
  flex-direction: column;
  gap: 0.25rem;
}

.link {
  text-decoration: none;
}

.stacked .link {
  display: block;
  padding-block: 0.5rem;
  font-size: var(--text-lg);
  font-weight: 700;
}

.link:hover,
.link.router-link-active {
  text-decoration: underline;
}
</style>
