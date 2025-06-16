import type {CategoryMini} from "../../../../../common/domain/products/categories.types.ts";
import type {BrandMini} from "../../../../../common/domain/products/brands.types.ts";
import type {SupplierMini} from "../../../../../common/domain/products/suppliers.types.ts";
import type {UserMini} from "../../../../../common/domain/auth/user.types.ts";

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