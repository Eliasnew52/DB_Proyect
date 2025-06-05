import {ProductFormValues} from "../types/form.types.ts";
import {isFilled} from "./isFilled.ts";

export const extractAttributes = (
    schemaKeys: string[],
    source: ProductFormValues
): Record<string, string> | undefined => {
    const entries = schemaKeys
        .filter(
            (k): k is keyof ProductFormValues => {
                if (!(k in source)) return false;

                return isFilled(source[k as keyof ProductFormValues]);
            }
        )
        .map((k) => {
            const val = source[k];
            return [k, String(val)];
        });

    const attrs = Object.fromEntries(entries);
    return Object.keys(attrs).length ? attrs : undefined;
};
