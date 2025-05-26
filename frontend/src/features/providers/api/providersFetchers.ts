import axiosClient from "../../../common/api/axiosClient.ts";

export const getProviders = async (signal?: AbortSignal) => {
    const res = await axiosClient.get('/suppliers/', { signal });
    return res.data.result;
}