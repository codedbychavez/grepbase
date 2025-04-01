<template>
  <main class="py-16 flex justify-center">
    <div>
      <h1 class="text-3xl text-center">My Account</h1>
      <!-- Login form -->
      <form v-if="authState === 'signin'" class="mt-12 w-96 border border-gray-100 shadow p-4"
        @submit.prevent="handleSignin">
        <h2 class="text-2xl text-center">Sign In</h2>
        <div class="form-group mt-8">
          <label for="key" class="form-label text-sm text-stone-700 block capitalize">Username</label>
          <input id="username" v-model="formData.username" type="text"
            class="disabled:bg-gray-200 disabled:cursor-not-allowed form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-md"
            placeholder="Enter Username" />
        </div>
        <div class="form-group mt-4">
          <label for="key" class="form-label text-sm text-stone-700 block capitalize">Password</label>
          <input id="password" v-model="formData.password" type="text"
            class="disabled:bg-gray-200 disabled:cursor-not-allowed form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-md"
            placeholder="Enter Password" />
        </div>
        <div class="form-group mt-8 text-center">
          <button class="px-2 py-1 bg-blue-500 w-max rounded text-gray-50 cursor-pointer" type="submit">Sign In</button>
        </div>
      </form>
      <!-- Signup form -->
      <form v-else-if="authState === 'signup'" class="mt-12 w-96 border border-gray-100 shadow p-4"
        @submit.prevent="handleSignup">
        <h2 class="text-2xl text-center">Sign Up</h2>
        <div class="form-group mt-8">
          <label for="key" class="form-label text-sm text-stone-700 block capitalize">Username</label>
          <input id="username" v-model="formData.username" type="text"
            class="disabled:bg-gray-200 disabled:cursor-not-allowed form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-md"
            placeholder="Enter Username" />
        </div>
        <div class="form-group mt-4">
          <label for="key" class="form-label text-sm text-stone-700 block capitalize">Password</label>
          <input id="password" v-model="formData.password" type="text"
            class="disabled:bg-gray-200 disabled:cursor-not-allowed form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-md"
            placeholder="Enter Password" />
        </div>
        <div class="form-group mt-8 text-center">
          <button class="px-2 py-1 bg-blue-500 w-max rounded text-gray-50 cursor-pointer" type="submit">Sign Up</button>
        </div>
      </form>

      <div v-if="!user" class="mt-4">
        Account? <button type="button" @click="() => {
          switch (authState) {
            case 'signin':
              authState = 'signup'
              break;
            case 'signup':
              authState = 'signin'
            default:
              break;
          }
        }" class="underline text-blue-500 cursor-pointer">
          {{ authState === 'signin' ? 'Sign Up' : 'Sign In' }}
        </button>
      </div>
      <div v-else class="mt-8">
        <button @click="handleSignout" class="cursor-pointer bg-blue-500 px-3 py-2 rounded text-gray-50">Logout</button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">

import { computed, reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { notify } from '@kyvg/vue3-notification';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const { user } = storeToRefs(authStore);

console.log(user)

const formData = reactive({
  username: "",
  password: "",
})

const authState = computed(() => {
  if (user.value) {
    return 'signout'
  } else if (user.value == null) {
    return 'signin'
  } else {
    return 'signup'
  }
})

async function handleSignin() {

  await authStore.signin(formData);

  setTimeout(() => {
    if (user.value) {
      notify({
        type: 'success',
        title: "Login Successful",
        text: "Welcome to grepbase"
      })
    } else {
      notify({
        type: 'error',
        title: 'Login Failed',
        text: 'Incorrect username or password'
      })
    }

    router.push('/');

  }, 2000)
}

async function handleSignup() {

  const didSignup = await authStore.signup(formData);

  setTimeout(() => {
    if (didSignup === true) {
      notify({
        type: 'success',
        title: "Signup Successful",
        text: "Welcome to grepbase"
      })
    } else {
      notify({
        type: 'error',
        title: 'Signup Failed',
        text: 'Failed to signup user'
      })
    }
    router.push('/');
  }, 2000)
}

async function handleSignout() {

await authStore.signout();

setTimeout(() => {
  if (user.value == null) {
    notify({
      type: 'success',
      title: "Signout Successful",
      text: "Thanks for using grepbase"
    })
  } else {
    notify({
      type: 'error',
      title: 'Signout Failed',
      text: 'Signout failed, please try again'
    })
  }
  router.push('/auth');
}, 2000)
}


</script>