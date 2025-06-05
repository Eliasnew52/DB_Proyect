export interface ProductFormValues {
    name: string;
    image: File | null;
    sale_price: string;
    purchase_price: string;
    category: number | null;
    brand: number | null;
    suppliers: number[];

    description: string;
    minimum_stock: number | null;
    stock: number | null;

    length: string;
    length_unit: string;
    width: string;
    height: string;
    weight: string;
    weight_unit: string;
    volume: string;
    volume_unit: string;
}