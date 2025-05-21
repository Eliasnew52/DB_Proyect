import axios from 'axios';
import {formatError} from "../utils/formatErrors.ts";

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 15_000,
});

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        return Promise.reject(formatError(error));
    }
);

export default axiosClient;