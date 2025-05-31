import axiosClient from "../axiosClient.ts";

export const getProviders = async (signal?: AbortSignal) => {
    const res = await axiosClient.get('/suppliers/', { signal });
    return res.data.result;
}