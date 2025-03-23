<template>
  <div class="navigation bg-emerald-500 p-4">
    <RouterLink to="/">
      <div class="logo text-white font-bold text-lg">grepbase</div>
    </RouterLink>
    <div class="navigation-links-wrapper">
      <ul class="navigation-links flex items-center gap-8">
        <li>
          <RouterLink to="/"class="text-gray-100 underline">
            Store Viewer
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/edit" class="text-gray-100 underline">
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