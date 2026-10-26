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
  position: relative;
  text-decoration: none;
}

/* Tratto di penna che si disegna sotto la voce */
.link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.15em;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
}

.link:hover::after,
.link:focus-visible::after,
.link.router-link-active::after {
  transform: scaleX(1);
  transform-origin: left;
}

.stacked .link::after {
  bottom: 0.35em;
  width: auto;
  right: auto;
  min-width: 2rem;
}

.stacked .link {
  display: block;
  padding-block: 0.5rem;
  font-size: var(--text-lg);
  font-weight: 700;
}


</style>
