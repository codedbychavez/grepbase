import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useFetch } from '@vueuse/core'
import { useAppStore } from "./appStore";

export const enum EMediaType {
    image = 'image',
    video = 'video',
    audio = 'audio',
}

export const useDataStore = defineStore("dataStore", () => {
    const appStore = useAppStore();
    const { appConfigs } = storeToRefs(appStore);

    const storeData = ref<Array<Record<any, any>>>([]);
    const selectedStore = ref<string>('');
    const selectedMediaType = ref<EMediaType>(EMediaType.image);
    const stores = ref<string[]>([]);

    async function fetchStores() {
        const url = `${appConfigs.value.apiBaseUrl}/get-stores`;
        const { data, error } = await useFetch(url).get().json();

        if (error.value) { return };

        stores.value = data.value.sort((a: string, b: string) => a.localeCompare(b));
        selectedStore.value = stores.value[0];
    }

    async function fetchStoreData(store: string) {
        const url = `${appConfigs.value.apiBaseUrl}/stores/${store}`
        const { data, error } = await useFetch(url).get().json();

        if (error.value) {
            return;
        } else {
            storeData.value = data.value;
        }
    }

    async function editStoreItem(itemId: string, itemData: any): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/stores/${selectedStore.value}/${itemId}`

        const { error } = await useFetch(url).patch(itemData);

        if (error.value) {
            return false;
        }

        await fetchStoreData(selectedStore.value);

        return true;

    }

    async function createStoreItem(itemData: any): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/stores/${selectedStore.value}/create`

        const { error } = await useFetch(url).post(itemData);

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

    async function createInitialStoreItem(data: any) {
        const url = `${appConfigs.value.apiBaseUrl}/stores/${selectedStore.value}/createInitial`;

        const { error } = await useFetch(url).post(data);

        if (error.value) {
            return false;
        }

        await fetchStoreData(selectedStore.value);

        return true;
    }

    async function createStore(data: any): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/stores/create`

        const { error } = await useFetch(url).post(data);

        if (error.value) {
            return false;
        }

        await fetchStores();

        return true;

    }

    async function renameStore(data: any): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/rename-store`;

        const { error } = await useFetch(url).patch(data);

        if (error.value) {
            return false;
        }

        await fetchStores();

        return true;

    }

    async function deleteStore(storeName: any): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/stores/delete`;

        const { error } = await useFetch(url).post(storeName);

        if (error.value) {
            return false;
        }

        await fetchStores();

        return true;

    }

    async function editStoreData(store: string, storeData: any): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/stores/${store}`

        const { error } = await useFetch(url).patch(storeData);

        if (error.value) {
            return false;
        }

        await fetchStoreData(selectedStore.value);

        return true;

    }

    async function uploadMedia(store: string, file: File, mediaType: string): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/${store}/upload`

        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('mediaType', mediaType);

        const { error } = await useFetch(url).post(formData);

        if (error.value) {
            return false;
        }

        return true;

    }

    async function fetchMedia(store: string, mediaType: string) {
        const url = `${appConfigs.value.apiBaseUrl}/stores/${store}/${mediaType}`;

        const { data, error } = await useFetch(url).json();

        if (error.value) {
            return;
        } else {
            storeData.value = data.value;
        }
    }

    async function deleteMediaItem(mediaId: string): Promise<boolean> {
        const modifiedMediaId = mediaId.replace(/\//g, '-');
        const url = `${appConfigs.value.apiBaseUrl}/stores/${selectedStore.value}/media/${modifiedMediaId}`

        const { error } = await useFetch(url).delete(mediaId);

        if (error.value) {
            return false;
        }

        await fetchMedia(selectedStore.value, selectedMediaType.value);

        return true;
    }

    return { stores, storeData, selectedStore, fetchStores, fetchStoreData, editStoreItem, deleteStoreItem, createStoreItem, createStore, editStoreData, deleteStore, renameStore, uploadMedia, fetchMedia, selectedMediaType, deleteMediaItem, createInitialStoreItem }
})