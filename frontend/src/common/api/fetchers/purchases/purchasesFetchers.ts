import axiosClient from "../../axiosClient.ts";

export const createPurchase = async (purchaseData: FormData) => {
    const res = await axiosClient.post('/purchases/', purchaseData);
    return res.data;
};