import {BrandMini} from "./brands.types.ts";
import {CompanyMini} from "../sales/company.types.ts";

export interface Supplier {
    id: number;
    name: string;
    brands: BrandMini[];
    email: string;
    phone: string;
    last_updated: string;
    creation_date: string;
    active: boolean;
    company: CompanyMini;
}

export interface SupplierMini {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: CompanyMini;
}