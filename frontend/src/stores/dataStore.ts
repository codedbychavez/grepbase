import { defineStore, storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useFetch } from '@vueuse/core'
import { useAppStore } from "./appStore";
import { notify } from "@kyvg/vue3-notification";

export const enum EMediaType {
    image = 'image',
    video = 'video',
    audio = 'audio',
}

export const useDataStore = defineStore("dataStore", () => {
    const appStore = useAppStore();
    const { appConfigs } = storeToRefs(appStore);

    const storeItems = ref<Array<Record<any, any>>>([]);
    const selectedStore = ref<string>('');
    const selectedMediaType = ref<EMediaType>(EMediaType.image);
    const stores = ref<string[]>([]);

    // When a store is selected we fetch the items for that store automatically
    watch(() => selectedStore.value, (newValue) => {
        if (selectedStore.value) {
            getStoreItems(newValue)
        }
    })

    // ## STORE MANAGEMENT ##

    // Create a store
    async function createStore(storeName: string): Promise<void> {
        const url = `${appConfigs.value.apiBaseUrl}/create-store/${storeName}`
        const { data, error } = await useFetch(url).post();
        if (data.value) {
            notify({
                type: 'success',
                title: 'Store created',
                text: 'Store was created successfully.'
            })
        }

        if (error.value) {
            notify({
                type: 'error',
                title: 'Create failed',
                text: 'There was an error.'
            })
        }

        await getStores();
    }

    // Get a list of stores
    async function getStores(storeToSelect?: string) {
        const url = `${appConfigs.value.apiBaseUrl}/get-stores`;
        const { data, error } = await useFetch(url).get().json();
        if (error.value) { return };
        stores.value = data.value;
        if (storeToSelect) {
            selectedStore.value = storeToSelect;
        } else {
            selectedStore.value = stores.value[0];
        }
    }

    // Get store items
    async function getStoreItems(storeName: string) {
        const url = `${appConfigs.value.apiBaseUrl}/get-store-items/${storeName}`
        const { data, error } = await useFetch(url).get().json();
        if (error.value) {
            return;
        } else {
            storeItems.value = data.value;
        }
    }

    // Rename a store
    async function renameStore(oldStoreName: string, newStoreName: string): Promise<void> {
        const url = `${appConfigs.value.apiBaseUrl}/rename-store/${oldStoreName}/${newStoreName}`;
        useFetch(url).patch().then(async (renameStoreResponse) => {
            if (renameStoreResponse.data) {
                await getStores(newStoreName);
                notify({
                    type: 'success',
                    title: 'Store renamed',
                    text: 'Store was renamed successfully.'
                })
            } else {
                notify({
                    type: 'error',
                    title: 'Rename failed',
                    text: 'There was an error.'
                })
            }
        })
    }

    // Delete a store
    async function deleteStore(storeName: string): Promise<void> {
        const url = `${appConfigs.value.apiBaseUrl}/delete-store/${storeName}`;

        const { data, error } = await useFetch(url).delete();

        if (data.value) {
            notify({
                type: 'success',
                title: 'Store delete',
                text: 'Store was deleted successfully.'
            })
        }

        if (error.value) {
            notify({
                type: 'error',
                title: 'Delete failed',
                text: 'There was an error.'
            })
        }
    }

    // ## STORE ITEM MANAGEMENT ##

    // Create store item
    async function createStoreItem(item: any): Promise<void> {
        const url = `${appConfigs.value.apiBaseUrl}/create-store-item/${selectedStore.value}`
        const { data, error } = await useFetch(url).post(item);
        console.log(data.value, error.value)

        if (data.value) {
            notify({
                type: 'success',
                title: 'Item created',
                text: 'Item was created successfully.'
            })
        }

        if (error.value) {
            notify({
                type: 'error',
                title: 'Create failed',
                text: 'There was an error.'
            })
        }
        await getStoreItems(selectedStore.value);

    }

    // Edit store item
    async function editStoreItem(item: any): Promise<void> {
        const url = `${appConfigs.value.apiBaseUrl}/edit-store-item/${selectedStore.value}`
        const { data, error } = await useFetch(url).patch(item);

        if (data.value) {
            notify({
                type: 'success',
                title: 'Item updated',
                text: 'Item was updated successfully.'
            })
        }

        if (error.value) {
            notify({
                type: 'error',
                title: 'Update failed',
                text: 'There was an error.'
            })
        }
        await getStoreItems(selectedStore.value);
    }

    // Delete store item
    async function deleteStoreItem(itemId: string): Promise<void> {
        const url = `${appConfigs.value.apiBaseUrl}/delete-store-item/${selectedStore.value}/${itemId}`
        const { data, error } = await useFetch(url).delete(itemId);

        if (data.value) {
            notify({
                type: 'success',
                title: 'Item deleted',
                text: 'Item was deleted successfully.'
            })
        }

        if (error.value) {
            notify({
                type: 'error',
                title: 'Delete failed',
                text: 'There was an error.'
            })
        }
        await getStoreItems(selectedStore.value);
    }

    // ## MEDIA ITEM MANAGEMENT ##

    // Upload media item
    async function uploadMediaItem(storeName: string, file: File, mediaType: string): Promise<void> {
        const url = `${appConfigs.value.apiBaseUrl}/upload-media-item/${storeName}`
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('mediaType', mediaType);
        const { data, error } = await useFetch(url).post(formData);
        if (data.value) {
            notify({
                type: 'success',
                title: 'Media uploaded',
                text: 'Media uploaded successfully'
            })
        }
        if (error.value) {
            notify({
                type: 'success',
                title: 'Media uploaded',
                text: 'Media uploaded successfully'
            })
        }
    }

    // Get media by type
    async function getMediaItems(storeName: string, mediaType: string): Promise<void> {
        const url = `${appConfigs.value.apiBaseUrl}/get-media-items/${storeName}/${mediaType}`;
        const { data, error } = await useFetch(url).json();
        if (error.value) {
            return;
        } else {
            storeItems.value = data.value;
        }
    }

    // Delete media item
    async function deleteMediaItem(mediaId: string): Promise<void> {
        const url = `${appConfigs.value.apiBaseUrl}/delete-media-item/${selectedStore.value}/${mediaId}`
        const { data, error } = await useFetch(url).delete(mediaId);
        if (data.value) {
            notify({
                type: 'success',
                title: 'Media item deleted',
                text: 'Media item was deleted successfully.'
            })
        }
        if (error.value) {
            notify({
                type: 'error',
                title: 'Delete failed',
                text: 'There was an error.'
            })
        }
        await getMediaItems(selectedStore.value, selectedMediaType.value);
    }

    return { stores, storeItems, selectedStore, getStores, getStoreItems, editStoreItem, deleteStoreItem, createStoreItem, createStore, deleteStore, renameStore, uploadMediaItem, getMediaItems, selectedMediaType, deleteMediaItem }
})