import {CategoryMini} from "../../../../../common/domain/products/categories.types.ts";
import {BrandMini} from "../../../../../common/domain/products/brands.types.ts";
import {SupplierMini} from "../../../../../common/domain/sales/suppliers.types.ts";
import {UserMini} from "../../../../../common/types/auth.types.ts";

export interface ProductResponse {
    id: number;
    active: boolean;
    name: string;
    description: string | null;
    category: CategoryMini;
    brand: BrandMini;
    suppliers: SupplierMini[];
    sale_price: number;
    purchase_price: number;
    attributes: Record<string, string | number | boolean>
    created_by: UserMini;
    last_updated: string;
    creation_date: string;
    image: string;
    stock: number;
    minimum_stock: number;
}

// "measurements": {
//     "length": "14.50",
//         "length_unit": "cm",
//         "width": "0.70",
//         "height": "14.50",
//         "weight": "72.00",
//         "weight_unit": "g",
//         "volume": "1.20",
//         "volume_unit": "ml"
// },