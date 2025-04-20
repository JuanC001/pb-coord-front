export const getEnvVariables = () => {
    return {
        API_URL: import.meta.env.VITE_API_URL,
        VITE_GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    }
}