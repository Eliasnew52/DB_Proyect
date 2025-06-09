export interface ProductSchemaProperty {
    enum?: string[];
    type: 'string' | 'number' | 'boolean';
    title: string;
    required: string[];
}

export interface ProductSchema {
    type: 'object';
    $schema: string;
    required: string[];
    properties: ProductSchemaProperty;
}