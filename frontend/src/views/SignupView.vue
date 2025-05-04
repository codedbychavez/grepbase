<template>
  <div class="flex h-full items-center justify-center">
    <div>
      <Logo />
      <Form v-slot="{ meta }" name="form" class="w-96 border border-gray-100 shadow p-4 bg-white rounded-sm my-4" @submit="handleSignup">
        <div class="form-group mt-8">
          <label for="key" class="form-label text-sm text-stone-700 block capitalize">Username</label>
          <Field name="username" v-model="formData.username" :rules="validateRequired" type="text"
            class="my-1 bg-white w-full p-2 border border-gray-200 rounded-sm" placeholder="Enter Username" />
          <ErrorMessage name="username" class="text-sm text-red-500" />
        </div>
        <div class="form-group mt-4">
          <label for="password" class="form-label text-sm text-stone-700 block capitalize">Password</label>
          <Field name="password" v-model="formData.password" :rules="validatePassword" type="text"
            class="disabled:bg-gray-200 disabled:cursor-not-allowed form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-sm"
            placeholder="Enter Password" />
          <ErrorMessage name="password" class="text-sm text-red-500" />
        </div>
        <div class="form-group mt-4">
          <label for="confirm-password" class="form-label text-sm text-stone-700 block capitalize">Confirm
            Password</label>
          <Field name="confirm-password" v-model="formData.confirmPassword" :rules="validateConfirmPassword" type="text"
            class="disabled:bg-gray-200 disabled:cursor-not-allowed form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-sm"
            placeholder="Enter Password" />
          <ErrorMessage name="confirm-password" class="text-sm text-red-500" />
        </div>
        <div class="form-group mt-8 text-center">
          <button :disabled="!meta.valid" class="px-2 py-1 bg-blue-500 w-max rounded text-gray-50 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300" type="submit">Sign Up</button>
        </div>
        <div class="mt-8">
          Already have an account? <RouterLink to="/signin" class="text-blue-500 underline">Sign In</RouterLink>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">

import { reactive } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import Logo from '@/components/Logo.vue';
import { validateRequired, validatePassword } from '@/utils/formValidations';

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  username: "",
  password: "",
  confirmPassword: ""
})

function validateConfirmPassword(value: any) {

  if (!value) {
    return 'This field is required'
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters'
  }

  if (value !== formData.password) {
    return 'Passwords do not match'
  }

  return true;
}

async function handleSignup() {

  await authStore.signup(formData);

  router.push('/');

}

</script>