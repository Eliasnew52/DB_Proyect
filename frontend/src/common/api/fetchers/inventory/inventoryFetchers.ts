import {PaginatedResponse} from "../../../types/apiResponse.types.ts";
import {StockMovementResponseDTO} from "../../dto/inventory/StockMovementResponse.dto.ts";
import axiosClient from "../../axiosClient.ts";

export const getProductStockMovementsById = async(productId: number, page: number, pageSize: number, signal?: AbortSignal): Promise<PaginatedResponse<StockMovementResponseDTO>> => {
   const res = await axiosClient.get(`/stock-movements/product/${productId}/`, { params: { page, page_size: pageSize }, signal})
    return res.data.result;
}