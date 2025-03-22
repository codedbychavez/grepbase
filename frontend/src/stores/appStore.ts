import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useAppStore = defineStore('app', () => {
    const appConfigs = ref({
        apiBaseUrl: 'http://localhost:3000',
    })

    return { appConfigs };
})