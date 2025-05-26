import {CatalogEntity} from "../../../common/types/CatalogEntity.ts";

export type Category = CatalogEntity;
export type Brand    = CatalogEntity;

export interface Supplier {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: number;
}

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