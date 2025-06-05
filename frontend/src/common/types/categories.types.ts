import {ProductSchema} from "./productSchema.types.ts";

export interface Category {
    id: number;
    name: string;
    description: string;
    last_updated: string;
    image: string;
    product_schema: ProductSchema;
    created_by: string | null;
}

export interface CategoryMini {
    id: number;
    name: string;
    description: string;
    image: string;
}