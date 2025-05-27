import {Supplier} from "./supplier.types.ts";
import {Category} from "./categories.types.ts";
import {Brand} from "./brands.types.ts";

export interface Product {
    id: number;
    category: Category;
    brand: Brand;
    suppliers: Supplier[];
    sale_price: number;
    purchase_price: number;
    name: string;
    description: string;
    minimum_stock: number;
    stock: number;
    last_updated: string;
    image: string;
    active: boolean;
    creation_date: string;
    attributes: string;
    created_by: number;
}

export interface UnitOption {
    key: string;
    label: string;
}