import {ProductMini} from "../products/products.types.ts";
import {UserMini} from "../auth/user.types.ts";
import {Sale} from "../sales/sales.types.ts";

export interface MovementType {
    code: string;
    label: string;
    active: boolean;
    creation_date: string;
}

export interface StockMovement {
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