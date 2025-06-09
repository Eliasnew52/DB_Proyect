export interface CreateProductDTO {
    name: string;
    description?: string;
    sale_price: string;
    purchase_price: string;
    category: string;
    brand: string;
    stock: string;
    minimum_stock: number;
    attributes?: string;
    measurements?: string;
    image: File;
    suppliers: number[];
}