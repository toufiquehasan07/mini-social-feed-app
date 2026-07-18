export const APP_CONFIG = {
    serverUrl: process.env.EXPO_PUBLIC_SERVER_URL || 'http://0.0.0.0',
    port: parseInt(process.env.EXPO_PUBLIC_PORT || '3001', 10),
    apiVersion: process.env.EXPO_API_VERSION || "v1"
};
