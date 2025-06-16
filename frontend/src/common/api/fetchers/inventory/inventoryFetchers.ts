import {ApiResponseTypes, PaginatedResponse} from "../../../types/apiResponse.types.ts";
import {StockMovementResponseDTO} from "../../dto/stockMovements/StockMovementResponse.dto.ts";

// export const getStockMovements = async(): Promise<ApiResponseTypes<PaginatedResponse<StockMovementResponseDTO>>> => {
//
// }



export const getStockMovementsByProductId = async(signal:? AbortSignal, dto): Promise<PaginatedResponse<>> => {

}