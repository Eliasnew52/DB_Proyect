export interface CategoryResponse {
    id: number;
    name: string;
    description: string;
    image: string;
    product_schema: string;
    last_updated: string;
    created_by: string | null;
}