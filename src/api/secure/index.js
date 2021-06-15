import * as SecureStore from 'expo-secure-store';

export const SetAccount = async (key, value) => {
    return await SecureStore.setItemAsync(
        key,
        JSON.stringify(value)
    )
}

export const GetAccount = async (key) => {
    return await SecureStore.getItemAsync(key)
}

export const RemoveAccount = async (key) => {
    return await SecureStore.deleteItemAsync(key)
}