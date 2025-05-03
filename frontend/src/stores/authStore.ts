import { defineStore, storeToRefs } from "pinia";
import { useFetch, useStorage } from "@vueuse/core";
import { useAppStore } from "./appStore";

export const useAuthStore = defineStore('authStore', () => {
  const appStore = useAppStore();
  const { appConfigs } = storeToRefs(appStore);

  const user = useStorage('user', null);

  async function checkSession(): Promise<boolean> {
    const url = `${appConfigs.value.apiBaseUrl}/check-session`;
    const { data, error } = await useFetch(url, {
      credentials: 'include'
    })

    if (error.value) {
      return false;
    }

    return true;
  };

  async function signin(userCredentials: Record<string, string>) {
    const url = `${appConfigs.value.apiBaseUrl}/sign-in`;
    const { data, error } = await useFetch(url, {
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
    const url = `${appConfigs.value.apiBaseUrl}/sign-up`;

    const { data, error } = await useFetch(url, {
      credentials: 'include'
    }).post(userCredentials).json();

    if (error.value) {
      return false;
    }

    return true;
  }

  async function signout(): Promise<boolean> {
    const url = `${appConfigs.value.apiBaseUrl}/sign-out`;

    const { data, error } = await useFetch(url, {
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