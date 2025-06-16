import axiosClient from "../../axiosClient.ts";
import {ApiResponseTypes} from "../../../types/apiResponse.types.ts";
import {SupplierResponse} from "../../../../features/products/api/dto/supplier/SupplierResponse.dto.ts";

export const getSupplier = async (signal?: AbortSignal): Promise<SupplierResponse[]> => {
    const res = await axiosClient.get<ApiResponseTypes<SupplierResponse[]>>('/suppliers/', { signal });
    return res.data.result;
}