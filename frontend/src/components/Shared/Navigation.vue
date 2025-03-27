<template>
  <div class="navigation">
    <RouterLink to="/">
      <div class="logo text-emerald-500 font-bold text-2xl">grepbase</div>
    </RouterLink>
    <div class="navigation-links-wrapper">
      <ul class="navigation-links flex items-center gap-8">
        <li>
          <RouterLink to="/" active-class="font-semibold" class="p-1">
            Store Viewer
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/edit" active-class="font-semibold" class="p-1">
            Store Editor (JSON)
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.navigation {
  display: flex;
  gap: 8rem;
}
</style>