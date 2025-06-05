import {Brand, BrandMini} from "../../../../common/types/brands.types.ts";

// {
//     "id": 1,
//     "brands": [
//     {
//         "id": 1,
//         "name": "BIC",
//         "description": "BIC",
//         "image": "http://127.0.0.1:8000/media/brands/bic.jpeg"
//     }
// ],
//     "name": "Supplier 1",
//     "email": "supplier1@example.com",
//     "phone": "12345678",
//     "last_updated": "2025-04-29T11:13:37.196187Z",
//     "creation_date": "2025-05-26",
//     "active": true,
//     "company": 1,
//     "created_by": null
// },

export interface ProviderResponse {
    id: number;
    name: string;
    brands: BrandMini[];
    email: string;
    phone: string;
    last_updated: string;
    creation_date: string;
    active: boolean;
    company: string;
}