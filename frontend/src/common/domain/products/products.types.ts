import {SupplierMini} from "./suppliers.types.ts";
import {CategoryMini} from "./categories.types.ts";
import {BrandMini} from "./brands.types.ts";
import {UserMini} from "./auth.types.ts";

export interface Measurements {
    length: string;
    length_unit: string;
    width: string;
    height: string;
    weight: string;
    weight_unit: string;
    volume: string;
    volume_unit: string;
}

export interface Product {
    id: number;
    name: string;
    description: string | null;
    category: CategoryMini;
    brand: BrandMini;
    suppliers: SupplierMini[];
    sale_price: number;
    purchase_price: number;
    attributes: Record<string, string | number | boolean>
    measurements: Measurements;
    created_by: UserMini;
    last_updated: string;
    creation_date: string;
    image: string;
    stock: number;
    minimum_stock: number;
}