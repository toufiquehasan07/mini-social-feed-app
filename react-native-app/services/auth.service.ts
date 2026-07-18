import axios from "axios";
import { APP_CONFIG } from "@/config";
import storageService from "./storage";
import { User } from '@/types/index';

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

export const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const refreshToken = await storageService.load(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
            return null;
        }

        const response = await axios({
            method: "POST",
            url: `${APP_CONFIG.serverUrl}:${APP_CONFIG.port}/api/${APP_CONFIG.apiVersion}/token/refresh`,
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                token: refreshToken
            }
        })

        const accessToken = response.data?.data?.accessToken;

        if (!accessToken) {
            return null;
        }
        await storageService.save(ACCESS_TOKEN_KEY, accessToken);
        return accessToken;
    } catch (error) {
        return null;
    }
};
export const saveSession = async (
    user: User,
    accessToken: string,
    refreshToken: string
) => {
    await storageService.save(USER_KEY, JSON.stringify(user));
    await storageService.save(ACCESS_TOKEN_KEY, accessToken);
    await storageService.save(REFRESH_TOKEN_KEY, refreshToken);
};

export const getUser = async (): Promise<User | null> => {
    const user = await storageService.load(USER_KEY);

    if (!user) return null;

    return JSON.parse(user);
};

export const getAccessToken = async () => {
    return storageService.load(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = async () => {
    return storageService.load(REFRESH_TOKEN_KEY);
};

export const logout = async () => {
    console.log("info logout called.");
    await storageService.remove(USER_KEY);
    await storageService.remove(ACCESS_TOKEN_KEY);
    await storageService.remove(REFRESH_TOKEN_KEY);
};