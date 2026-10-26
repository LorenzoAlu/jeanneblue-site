<template>
  <div class="container">
    <slot />
  </div>
</template>

<style scoped>
.container {
  max-width: var(--container);
  margin-inline: auto;
  padding-inline: var(--gutter);
}
</style>
