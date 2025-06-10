import {ProductFormValues} from "../../../pages/CreateProductPage/types/form.types.ts";
import {extractAttributes} from "../../../pages/CreateProductPage/helpers/extractAttributes.ts";
import {extractMeasurements} from "../../../pages/CreateProductPage/helpers/extractMeasurements.ts";
import {Category} from "../../../../../common/domain/products/categories.types.ts";
import {ProductSaleInsightsFormValues} from "../../../pages/ProductDetailPage/components/SalesInsights/types/form.types.ts";
import {GetProductSaleInsightsDTO} from "../../dto/product/GetProductSaleInsights.dto.ts";

export const mapCreateProductFormToDTO = (data: ProductFormValues, selectedCategory: Category | null): FormData => {

    const schemaKeys = Object.keys(
        selectedCategory?.product_schema.properties || {},
    );

    const attributes = extractAttributes(schemaKeys, data);

    const measurements = extractMeasurements(data);


    const formData = new FormData();

    formData.append('name',        data.name)
    if (data.description)  formData.append('description', data.description)
    formData.append('sale_price',     String(data.sale_price))
    formData.append('purchase_price', String(data.purchase_price))
    formData.append('category',       String(data.category))
    formData.append('brand',          String(data.brand))
    formData.append('stock',          String(data.stock))
    formData.append('minimum_stock',  String(data.minimum_stock))
    if (attributes)    formData.append('attributes',   JSON.stringify(attributes))
    if (measurements)  formData.append('measurements', JSON.stringify(measurements))
    formData.append('image', data.image!)

    data.suppliers.forEach(id => {
        formData.append('suppliers', String(id))
    })

    return formData;
}

export const mapProductSaleInsightsFormToDTO = (data: ProductSaleInsightsFormValues): GetProductSaleInsightsDTO => {
    return {
        product_id: data.product_id,
        period: data.period,
        from_date: data.from_date,
        to_date: data.to_date,
        group_by: data.group_by,
    }
}