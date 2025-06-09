import {ApiResponseTypes} from "../../../types/apiResponse.types.ts";
import {PaymentMethod} from "../../../domain/sales/paymentsMethods.types.ts";
import axiosClient from "../../axiosClient.ts";

export const getPaymentMethods = async(signal?: AbortSignal): Promise<PaymentMethod[]> => {
    const res = await axiosClient.get<ApiResponseTypes<PaymentMethod[]>>('/payment_methods/', {signal});
    return res.data.result;
}