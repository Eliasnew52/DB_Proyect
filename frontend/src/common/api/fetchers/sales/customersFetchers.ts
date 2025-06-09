import type {Customer} from "../../../domain/sales/customer.types.ts";
import axiosClient from "../../axiosClient.ts";
import type {ApiResponseTypes} from "../../../types/apiResponse.types.ts";

export const getCustomers = async (signal?: AbortSignal): Promise<Customer[]> => {
    const res = await axiosClient.get<ApiResponseTypes<Customer[]>>("/customers/", { signal });
    return res.data.result;
}