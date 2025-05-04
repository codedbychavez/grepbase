<template>
  <div class="signin flex h-full items-center justify-center">
    <div>
      <Logo />
      <Form v-slot="{ meta }" class="w-96 border border-gray-100 shadow-sm p-4 bg-white rounded my-4" @submit="handleSignin">
        <div class="form-group mt-8">
          <label for="key" class="form-label text-sm text-stone-700 block capitalize">Username</label>
          <Field name="username" v-model="formData.username" :rules="validateUsername" type="text"
            class="my-1 bg-white w-full p-2 border border-gray-200 rounded-sm" placeholder="Enter Username" />
          <ErrorMessage name="username" class="text-sm text-red-500" />
        </div>
        <div class="form-group mt-4">
          <label for="key" class="form-label text-sm text-stone-700 block capitalize">Password</label>
          <div class="flex gap-2 items-center">
            <Field ref="passwordInput" name="password" v-model="formData.password" :rules="validatePassword"
              :type="hidePassword ? 'password' : 'text'"
              class="disabled:bg-gray-200 disabled:cursor-not-allowed form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-sm"
              placeholder="Enter Password" />
            <component @click="togglePasswordVisibility" class="cursor-pointer" :is="hidePassword ? EyeClosed : Eye" />
          </div>
          <ErrorMessage name="password" class="text-sm text-red-500" />
        </div>
        <div class="form-group mt-8 text-center">
          <button :disabled="!meta.valid" class="px-2 py-1 bg-blue-500 w-max rounded text-gray-50 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300" type="submit">Sign In</button>
        </div>
        <div class="mt-8">
          New to grepbase? <RouterLink to="/signup" class="text-blue-500 underline">Sign Up</RouterLink>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">

import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { notify } from '@kyvg/vue3-notification';
import { Form, Field, ErrorMessage } from 'vee-validate';
import Eye from '@/components/Icons/Eye.vue';
import EyeClosed from '@/components/Icons/EyeClosed.vue';
import Logo from '@/components/Logo.vue';

const router = useRouter();
const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

const hidePassword = ref<boolean>(true);

const formData = reactive({
  username: "",
  password: "",
})

function togglePasswordVisibility() {
  hidePassword.value = !hidePassword.value;
}

function validateUsername(value: any) {
  if (!value) {
    return 'This field is required';
  }

  return true;
}

function validatePassword(value: any) {
  if (!value) {
    return 'This field is required'
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters'
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

  router.push({ path: '/' });
}

</script>

<style scoped>

.signin {
  /* background-image: url(../assets/auth-bg.jpg); */
}

</style>