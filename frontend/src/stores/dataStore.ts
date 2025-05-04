import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useFetch } from '@vueuse/core'
import { useAppStore } from "./appStore";
import { notify } from "@kyvg/vue3-notification";

export const useDataStore = defineStore("dataStore", () => {
    const appStore = useAppStore();
    const { appConfigs } = storeToRefs(appStore);

    const storeItems = ref<Array<Record<any, any>>>([]);
    const selectedStore = ref<string>('');
    const stores = ref<string[]>([]);

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

    return { stores, storeItems, selectedStore, getStores, getStoreItems, editStoreItem, deleteStoreItem, createStoreItem, createStore, deleteStore, renameStore }
})