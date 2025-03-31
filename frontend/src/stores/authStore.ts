import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { useFetch } from "@vueuse/core";
import { useAppStore } from "./appStore";

export const useAuthStore = defineStore('authStore', () => {
  const appStore = useAppStore();
  const { appConfigs } = storeToRefs(appStore);

  const user = ref<Record<string, any> | null>(null);

  async function checkSession(): Promise<boolean> {
    const { data, error } = await useFetch(`${appConfigs.value.apiBaseUrl}/auth/check-session`, {
      credentials: 'include'
    })

    if (error.value) {
      return false;
    }

    return true;
  };

  async function signin(userCredentials: Record<string, string>) {

    const { data, error } = await useFetch<Record<string, string>>(`${appConfigs.value.apiBaseUrl}/auth/login`, {
      credentials: 'include'
    }).post(userCredentials).json();

    if (error.value) {
      user.value = null;
      return;
    } else {
      const response = data.value;
      user.value = response.user;
    }
  }

  async function signup(userCredentials: Record<string, string>): Promise<boolean> {

    const { data, error } = await useFetch<Record<string, string>>(`${appConfigs.value.apiBaseUrl}/auth/signup`, {
      credentials: 'include'
    }).post(userCredentials).json();

    if (error.value) {
      return false;
    } 

    return true;
  }

  async function signout(): Promise<boolean> {

    const { data, error } = await useFetch<Record<string, string>>(`${appConfigs.value.apiBaseUrl}/auth/signout`, {
      credentials: 'include'
    }).json();

    if (error.value) {
      return false;
    } 

    user.value = null;
    return true;
  }

  return { user, signin, checkSession, signup, signout };
})