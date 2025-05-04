<template>
  <div class="signin flex h-full items-center justify-center">
    <div>
      <Logo />
      <Form v-slot="{ meta }" class="w-96 border border-gray-100 shadow-sm p-4 bg-white rounded my-4" @submit="handleSignin">
        <div class="form-group mt-8">
          <label for="key" class="form-label text-sm text-stone-700 block capitalize">Username</label>
          <Field name="username" v-model="formData.username" :rules="validateRequired" type="text"
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

              <button type="button" @click="togglePasswordVisibility" class="cursor-pointer bg-gray-200 p-2 hover:bg-gray-300 rounded">
                <component :is="hidePassword ? EyeOff : Eye" />
              </button>
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
import { useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import Eye from '@/components/Icons/Eye.vue';
import EyeOff from '@/components/Icons/EyeOff.vue';
import Logo from '@/components/Logo.vue';
import { validateRequired, validatePassword } from '@/utils/formValidations.ts';

const router = useRouter();
const authStore = useAuthStore();

const hidePassword = ref<boolean>(true);

const formData = reactive({
  username: "",
  password: "",
})

function togglePasswordVisibility() {
  hidePassword.value = !hidePassword.value;
}

async function handleSignin() {
  await authStore.signin(formData);
  router.push({ path: '/' });
}

</script>