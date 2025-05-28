export interface EnumProperty<T extends string = string> {
    options: T[];
    type: 'string' | 'number' | 'boolean' | 'enum';
    title: string;
}

export interface ProductSchemaProperty<T extends string = string> {
    enum: T[];
    type: 'string' | 'number' | 'boolean';
    title: string;
    required: T[];
}

export interface ProductSchema {
    type: 'object';
    $schema: string;
    required: string[];
    properties: Record<string, ProductSchemaProperty>;
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