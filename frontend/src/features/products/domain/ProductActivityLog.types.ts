import {UserMini} from "../../../common/domain/auth/user.types.ts";

export interface Change {
    field:
        'active' |
        'name' |
        'description' |
        'image' |
        'stock' |
        'minimum_stock' |
        'sale_price' |
        'purchase_price' |
        'category' |
        'brand' |
        'suppliers' |
        'height' |
        'width' |
        'weight' |
        'weight_unit' |
        'volume' |
        'volume_unit' |
        'length_unit' |
        'length';
    old: string | number | boolean | string[];
    new: string | number | boolean | string[];
}

export interface ProductActivityLog {
    history_id: number;
    history_date: string;
    history_type: string;
    history_change_reason: string | null;
    history_user: UserMini;
    id: number;
    name: string;
    changes: Change[];
}