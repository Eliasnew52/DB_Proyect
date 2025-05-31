import axiosClient from "../../axiosClient.ts";

export const createPurchase = async (purchaseData: FormData) => {
    const res = await axiosClient.post('/purchases/', purchaseData);
    return res.data;
};

export const getPurchases = async (signal?: AbortSignal) => {
    const res = await axiosClient.get('/purchases/', { signal });
    return res.data.result;
};