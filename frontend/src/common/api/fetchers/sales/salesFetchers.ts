import axiosClient from "../../axiosClient.ts";

export const createSale = async (saleData: any) => {
    const res = await axiosClient.post('/sales/', saleData);
    return res.data;
};

export const getSales = async (signal?: AbortSignal) => {
    const res = await axiosClient.get('/sales/', { signal });
    return res.data.result;
};