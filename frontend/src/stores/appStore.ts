import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useAppStore = defineStore('appStore', () => {
    const appConfigs = ref({
        apiBaseUrl: 'http://localhost:3000',
    })

    return { appConfigs };
})