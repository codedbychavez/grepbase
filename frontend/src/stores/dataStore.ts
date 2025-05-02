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

    // ## STORE MANAGEMENT ##

    // Create a store
    async function createStore(storeName: any): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/create-store/${storeName}`
        const { error } = await useFetch(url).post();
        if (error.value) {
            return false;
        }
        await getStores();
        return true;
    }

    // Get a list of stores
    async function getStores() {
        const url = `${appConfigs.value.apiBaseUrl}/get-stores`;
        const { data, error } = await useFetch(url).get().json();
        if (error.value) { return };
        stores.value = data.value;
        selectedStore.value = stores.value[0];
    }

    // Get store items
    async function getStoreItems(storeName: string) {
        const url = `${appConfigs.value.apiBaseUrl}/get-store-items/${storeName}`
        const { data, error } = await useFetch(url).get().json();
        if (error.value) {
            return;
        } else {
            storeData.value = data.value;
        }
    }

    // Rename a store
    async function renameStore(oldStoreName: string, newStoreName: string): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/rename-store/${oldStoreName}/${newStoreName}`;
        const { error } = await useFetch(url).patch();
        if (error.value) {
            return false;
        }
        await getStores();
        return true;
    }

    // Delete a store
    async function deleteStore(storeName: string): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/delete-store/${storeName}`;
        const { error } = await useFetch(url).delete();
        if (error.value) {
            return false;
        }
        await getStores();
        return true;
    }

    // ## STORE ITEM MANAGEMENT ##

    // Create store item
    async function createStoreItem(item: any): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/create-store-item/${selectedStore.value}`
        const { error } = await useFetch(url).post(item);
        if (error.value) {
            return false;
        }
        await getStoreItems(selectedStore.value);
        return true;
    }

    // Create initial store item
    async function createInitialStoreItem(item: any) {
        const url = `${appConfigs.value.apiBaseUrl}/create-initial-store-item/${selectedStore.value}`;
        const { error } = await useFetch(url).post(item);
        if (error.value) {
            return false;
        }
        await getStoreItems(selectedStore.value);
        return true;
    }

    // Edit store item
    async function editStoreItem(item: any): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/edit-store-item/${selectedStore.value}`
        const { error } = await useFetch(url).patch(item);
        if (error.value) {
            return false;
        }
        await getStoreItems(selectedStore.value);
        return true;
    }

    // Delete store item

    async function deleteStoreItem(itemId: string): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/stores/${selectedStore.value}/${itemId}`

        const { error } = await useFetch(url).delete(itemId);

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