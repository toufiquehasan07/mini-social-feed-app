import AsyncStorage from '@react-native-async-storage/async-storage';

export const save = async (key: string, value: string): Promise<boolean> => {
    try {
        await AsyncStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
};

export const load = async (key: string): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(key);
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
};

export const remove = async (key: string): Promise<boolean> => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing data:', error);
        return false;
    }
};

export const clear = async (): Promise<boolean> => {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing storage:', error);
        return false;
    }
};

export default {
    save,
    load,
    remove,
    clear,
};