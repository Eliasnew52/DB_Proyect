export interface EnumProperty<T extends string = string> {
    enum: T[];
    type: 'string';
    title: string;
}

export interface ProductSchema {
    type: 'object';
    $schema: string;
    required: string[];
    properties: Record<string, EnumProperty>;
}

export interface Category {
    id: number;
    name: string;
    description: string;
    last_updated: string;
    image: string;
    product_schema: ProductSchema;
    created_by: string | null;
}