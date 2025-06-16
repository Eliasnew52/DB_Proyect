import {StockMovement} from "../../../domain/inventory/stockMovements.types.ts";
import {StockMovementResponseDTO} from "../../dto/inventory/StockMovementResponse.dto.ts";

export const mapStockMovementResponseDTOToStockMovement= (dto: StockMovementResponseDTO): StockMovement => {
    return {
        id: dto.id,
        created_by: dto.created_by,
        movement_type: dto.movement_type,
        creation_date: dto.creation_date,
        product: dto.product,
        purchase: dto.purchase,
        purchase_return: dto.purchase_return,
        reason: dto.reason,
        sale: dto.sale,
        quantity: dto.quantity,
        sale_return: dto.sale_return
    };
}