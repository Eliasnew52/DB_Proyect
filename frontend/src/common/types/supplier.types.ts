import {Brand} from "./brands.types.ts";

export interface Supplier {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: number;
}

export interface SupplierWithBrands {
    id: number
    brands: Brand[]
    name: string
    email: string
    phone: string
    last_updated: string
    active: boolean
    company: number
    created_by: number
}

export type SuppliersResponse = SupplierWithBrands[]