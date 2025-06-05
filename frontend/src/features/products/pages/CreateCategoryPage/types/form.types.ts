
export interface CategoryAttribute {
    options?: string[];
    type: 'string' | 'number' | 'boolean' | 'enum';
    title: string;
    key: string;
}

export interface CategoryFormValues {
    name: string;
    description: string;
    image: File;
    attributes: CategoryAttribute[];
}