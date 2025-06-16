import {ProductMini} from "../../../domain/products/products.types.ts";
import {UserMini} from "../../../domain/auth/user.types.ts";
import {Sale} from "../../../domain/sales/sales.types.ts";
import {MovementType} from "../../../domain/inventory/stockMovements.types.ts";

export interface StockMovementResponseDTO {
    id: number;
    product: ProductMini;
    movement_type: MovementType;
    reason: string;
    quantity: number;
    created_by: UserMini;
    creation_date: string;
    purchase: Record<string, string> | null;
    sale: Sale | null;
    purchase_return: Record<string, string> | null;
    sale_return: Record<string, string> | null;
}