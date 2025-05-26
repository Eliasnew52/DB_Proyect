import type {Customer} from "../../../common/types/customer.types.ts";
import axiosClient from "../../../common/api/axiosClient.ts";
import type {ApiResponseTypes} from "../../../common/types/apiResponse.types.ts";

export const getCustomers = async (signal?: AbortSignal): Promise<Customer[]> => {
    const res = await axiosClient.get<ApiResponseTypes<Customer[]>>("/customers/", { signal });
    return res.data.result;
}