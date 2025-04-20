import axios from "axios";
import { getEnvVariables } from "./getEnvVariables";
const { API_URL } = getEnvVariables();

const coordApi = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

coordApi.interceptors.request.use((config) => {
    const user = sessionStorage.getItem('user');
    const { token } = user ? JSON.parse(user) : {};
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default coordApi;