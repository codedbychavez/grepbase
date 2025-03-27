<template>
  <main class="py-16 flex justify-center">
    <div>
      <h1 class="text-3xl text-center">Authenticate</h1>
      <form class="mt-12 w-xl border border-gray-100 shadow p-4" @submit.prevent="submitForm">
        <h2 class="text-2xl text-center">Login</h2>
        <div class="form-group mt-8">
          <label for="key" class="form-label text-sm text-stone-700 block capitalize">Username</label>
          <input id="username" v-model="formData.username" type="text"
            class="disabled:bg-gray-200 disabled:cursor-not-allowed form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-md"
            placeholder="Enter Username" />
        </div>
        <div class="form-group mt-4">
          <label for="key" class="form-label text-sm text-stone-700 block capitalize">Password</label>
          <input id="password" v-model="formData.password" type="password"
            class="disabled:bg-gray-200 disabled:cursor-not-allowed form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-md"
            placeholder="Enter Password" />
        </div>
        <div class="form-group mt-8 text-center">
          <button class="px-2 py-1 bg-blue-500 w-max rounded text-gray-50 cursor-pointer" type="submit">Login to grepbase</button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">

import { reactive } from 'vue';

const formData = reactive({
  username: "",
  password: "",
})

async function submitForm() {
  // TODO: Implement
  console.log('Login', formData)
}

</script>