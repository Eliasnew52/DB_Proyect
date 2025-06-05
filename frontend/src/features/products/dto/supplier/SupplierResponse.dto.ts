import {BrandMini} from "../../../../common/types/brands.types.ts";
import {CompanyMini} from "../../../../common/types/company.types.ts";

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