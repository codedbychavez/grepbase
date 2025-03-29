import { ref, computed } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { useFetch } from "@vueuse/core";
import { useAppStore } from "./appStore";

export const useAuthStore = defineStore('authStore', () => {
  const appStore = useAppStore();
  const { appConfigs } = storeToRefs(appStore);

  const isUserLoggedIn = ref<boolean>(false);

  async function login(userCredentials: Record<string, string>) {
    
    const { data, error } = await useFetch<boolean>(`${appConfigs.value.apiBaseUrl}/auth/login`).post(userCredentials);

    if (error.value) {
      return;
    } else {
      isUserLoggedIn.value = true;
    }
  }


  return { isUserLoggedIn, login };
})