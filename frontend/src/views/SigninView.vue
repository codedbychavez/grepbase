<template>
  <div class="flex h-full items-center justify-center">
    <Form class="w-96 border border-gray-100 shadow p-4" @submit="handleSignin">
      <h2 class="text-2xl text-center">Sign In</h2>
      <div class="form-group mt-8">
        <label for="key" class="form-label text-sm text-stone-700 block capitalize">Username</label>
        <Field name="username" v-model="formData.username" :rules="validateUsername" type="text"
          class="my-1 bg-white w-full p-2 border border-gray-200 rounded-md" placeholder="Enter Username" />
        <ErrorMessage name="username" class="text-sm text-red-500" />
      </div>
      <div class="form-group mt-4">
        <label for="key" class="form-label text-sm text-stone-700 block capitalize">Password</label>
        <Field name="password" v-model="formData.password" :rules="validatePassword" type="text"
          class="disabled:bg-gray-200 disabled:cursor-not-allowed form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-md"
          placeholder="Enter Password" />
        <ErrorMessage name="password" class="text-sm text-red-500" />
      </div>
      <div class="form-group mt-8 text-center">
        <button class="px-2 py-1 bg-blue-500 w-max rounded text-gray-50 cursor-pointer" type="submit">Sign In</button>
      </div>
      <div class="mt-8">
        New to grepbase? <RouterLink to="/signup" class="text-blue-500 underline">Sign Up</RouterLink>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">

import { reactive } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { notify } from '@kyvg/vue3-notification';
import { Form, Field, ErrorMessage } from 'vee-validate';

const router = useRouter();
const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

const formData = reactive({
  username: "",
  password: "",
})

function validateUsername(value: any) {
  if (!value) {
    return 'This field is required';
  }

  return true;
}

function validatePassword(value: any) {
  if (!value) {
    return 'This field is required';
  }

  return true;
}

async function handleSignin() {

  await authStore.signin(formData);

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

  router.push({ name: 'home' });
}

</script>