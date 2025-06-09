import axiosClient from "../../axiosClient.ts";
import {ApiResponseTypes} from "../../../types/apiResponse.types.ts";
import {TransactionStatus} from "../../../types/transactionStatus.types.ts";

export const getTransactionStatuses = async(signal?: AbortSignal): Promise<TransactionStatus[]> => {
    const res = await axiosClient.get<ApiResponseTypes<TransactionStatus[]>>('/transaction-status/', { signal });
    return res.data.result;
}