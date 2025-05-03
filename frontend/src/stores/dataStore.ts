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
    async function createStore(storeName: string): Promise<boolean> {
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
        const url = `${appConfigs.value.apiBaseUrl}/delete-store-item/${selectedStore.value}/${itemId}`
        const { error } = await useFetch(url).delete(itemId);
        if (error.value) {
            return false;
        }
        await getStoreItems(selectedStore.value);
        return true;
    }

    // ## MEDIA ITEM MANAGEMENT ##

    // Upload media item
    async function uploadMediaItem(storeName: string, file: File, mediaType: string): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/upload-media-item/${storeName}`
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('mediaType', mediaType);
        const { error } = await useFetch(url).post(formData);
        if (error.value) {
            return false;
        }
        return true;
    }

    // Get media by type
    async function getMediaItems(storeName: string, mediaType: string) {
        const url = `${appConfigs.value.apiBaseUrl}/get-media-items/${storeName}/${mediaType}`;
        const { data, error } = await useFetch(url).json();
        if (error.value) {
            return;
        } else {
            storeData.value = data.value;
        }
    }

    // Delete media item
    async function deleteMediaItem(mediaId: string): Promise<boolean> {
        const url = `${appConfigs.value.apiBaseUrl}/delete-media-item/${selectedStore.value}/${mediaId}`

        const { error } = await useFetch(url).delete(mediaId);

        if (error.value) {
            return false;
        }

        await getMediaItems(selectedStore.value, selectedMediaType.value);

        return true;
    }

    return { stores, storeData, selectedStore, getStores, getStoreItems, editStoreItem, deleteStoreItem, createStoreItem, createStore, deleteStore, renameStore, uploadMediaItem, getMediaItems, selectedMediaType, deleteMediaItem }
})