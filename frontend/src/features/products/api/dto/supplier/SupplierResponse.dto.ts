import {BrandMini} from "../../../../../common/domain/products/brands.types.ts";
import {CompanyMini} from "../../../../../common/domain/sales/company.types.ts";

export interface SupplierResponse {
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