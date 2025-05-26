export interface EnumProperty<T extends string = string> {
    options: T[];
    type: 'string' | 'number' | 'boolean' | 'enum';
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
    product_schema: string;
    created_by: string | null;
}