import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { APP_CONFIG } from '@/config';
import { refreshAccessToken, logout, getAccessToken } from "./auth.service";

const baseURL = `${APP_CONFIG.serverUrl}:${APP_CONFIG.port}/api/${APP_CONFIG.apiVersion}`;
const headers = {
    'Content-Type': 'application/json'
}

export const axiosAuthClient = async (
    config: AxiosRequestConfig<any>,
): Promise<AxiosResponse<any, any, {}>> => {
    const axiosInstance = axios.create({
        baseURL,
        headers
    });

    axiosInstance.interceptors.request.use(
        async (config: any) => {
            const accessToken = await getAccessToken();

            if (accessToken) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${accessToken}`,
                };
            }
            return config;
        },
        error => Promise.reject(error),
    );

    axiosInstance.interceptors.response.use(
        response => response,
        async error => {
            const config = error.config;

            if (error.response?.status === 401 && !config.sent) {
                config.sent = true;

                const accessToken = await refreshAccessToken();

                if (!accessToken) {
                    await logout();
                    return Promise.reject(error);
                }

                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${accessToken}`,
                };

                return axiosInstance(config);
            }

            return Promise.reject(error);
        },
    );

    return axiosInstance(config);
};

export const axiosClient = async (
    config: AxiosRequestConfig<any>,
): Promise<AxiosResponse<any, any, {}>> => {
    const axiosInstance = axios.create({
        baseURL,
        headers
    });
    return axiosInstance(config);
};
