<template>
  <header class="hero h-[60vh] bg-emerald-500 flex items-center justify-center px-6 py-16">
    <div class="hero-content text-center max-w-3xl">
      <h1 class="text-white text-4xl md:text-5xl font-extrabold leading-tight">
        File-based database to power your development
      </h1>
      <p class="text-gray-100 text-lg mt-4">
        GrepBase is a lightweight JSON database with an Express backend and Vue frontend—perfect for prototyping and
        testing your apps with realistic data.
      </p>
      <a href="https://github.com/codedbychavez/grepbase" target="_blank"
        class="inline-block mt-6 bg-white text-emerald-600 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition">
        Learn More on GitHub →
      </a>
    </div>
  </header>

  <main class="px-6 py-16">
    <h2 class="text-3xl font-bold text-center mb-12">Features 🎉</h2>

    <div class="feature-cards flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
      <div
        class="feature-card w-full sm:w-80 p-6 border border-gray-200 rounded-2xl shadow transition hover:shadow-md bg-white"
        v-for="(feature, index) in features" :key="index">
        <h3 class="text-xl font-semibold text-center mb-2">{{ feature.title }}</h3>
        <p class="text-gray-600 text-center">{{ feature.description }}</p>
      </div>
    </div>
  </main>

  <footer class="mt-24 py-8 border-t text-center text-gray-600">
    <p class="mb-2">
      If you like GrepBase, consider giving it a ⭐ and following me on
      <a href="https://github.com/codedbychavez" target="_blank" class="text-emerald-600 font-semibold hover:underline">
        GitHub
      </a>.
    </p>
    <p class="text-sm">Made with ❤️ by @codedbychavez</p>
  </footer>
</template>

<script setup>
const features = [
  {
    title: 'Text Storage',
    description: 'Store text data in JSON format (key-value pairs).'
  },
  {
    title: 'Media Storage',
    description: 'Store images, videos, and audio files.'
  },
  {
    title: 'File-based',
    description: 'No complex setup—data lives in a plain .json file.'
  },
  {
    title: 'Simple API',
    description: 'Manage your data through a clean, intuitive API.'
  }
];
</script>

<style scoped>
/* Additional styles if needed */
</style>
