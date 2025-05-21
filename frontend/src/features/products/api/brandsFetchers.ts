import axiosClient from "../../../common/api/axiosClient.ts";

export const getBrands = (signal?: AbortSignal) => axiosClient.get('/brands', { signal })