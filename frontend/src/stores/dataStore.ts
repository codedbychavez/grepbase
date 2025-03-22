import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useFetch } from '@vueuse/core'
import { useAppStore } from "./appStore";

export const useDataStore = defineStore("dataStore", () => {
    const appStore = useAppStore();
    const { appConfigs } = storeToRefs(appStore);

    const storeData = ref<Array<Record<any, any>>>([]);
    const selectedStore = ref<string>('');
    const stores = ref<string[]>([]);

    async function fetchStores() {
        const { data, error } = await useFetch<Array<string[]> | null>(`${appConfigs.value.apiBaseUrl}/stores`).json();

        if (error.value) { return };

        stores.value = data.value;
        selectedStore.value = stores.value[0];
    }

    async function fetchStoreData(store: string) {
        const url = `${appConfigs.value.apiBaseUrl}/stores/${store}`
        const { data, error } = await useFetch(url).json();

        if (error.value) {
            return;
        } else {
            storeData.value = data.value;
        }
    }

    async function editStoreItem(itemId: string, updatedData: any): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/stores/${selectedStore.value}/${itemId}`

        const { error } = await useFetch(url).patch(updatedData);

        if (error.value) {
            return false;
        }

        await fetchStoreData(selectedStore.value);

        return true;

    }

    async function deleteStoreItem(itemId: string): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/stores/${selectedStore.value}/${itemId}`

        const { error } = await useFetch(url).delete(itemId);

        if (error.value) {
            return false;
        }

        await fetchStoreData(selectedStore.value);

        return true;
    }

    return { stores, storeData, selectedStore, fetchStores, fetchStoreData, editStoreItem, deleteStoreItem }
})