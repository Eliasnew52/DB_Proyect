import {CategoryFormValues} from "../pages/CreateCategoryPage/types/form.types.ts";
import {CreateCategoryDTO} from "../api/dto/category/CreateCategory.dto.ts";
import {Category} from "../../../common/types/categories.types.ts";

interface MappedAttribute {
    type: 'string' | 'number' | 'boolean';
    title: string;
    enum?: string[];
}


export const mapCreateCategoryFormToDTO = (data: CategoryFormValues): CreateCategoryDTO => {
    const properties = data.attributes.reduce((acc: Record<string, MappedAttribute>, { key, title, type, options }) => {
        acc[key] = {
            type: type === 'enum' ? 'string' : type,
            title,
            ...(type === 'enum' ? { enum: options } : {})
        };
        return acc;
    }, {});

    const product_schema = {
        type: 'object',
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        required: data.attributes.map(a => a.key),
        properties
    }

    return {
        name: data.name,
        description: data.description,
        image: data.image,
        product_schema: JSON.stringify(product_schema)
    }
}


export const mapCreateDTOToCategory = (
    dto: CreateCategoryDTO
): Category => ({
    id: new Date().getTime(),
    name: dto.name,
    description: dto.description,
    image: typeof dto.image === 'string' ? dto.image : '',
    product_schema: JSON.parse(dto.product_schema),
    last_updated: new Date().toISOString(),
    created_by: null,
});