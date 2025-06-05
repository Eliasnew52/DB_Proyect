import {MEASUREMENT_MAP} from "../../../constants/measurementMap.ts";
import {isFilled} from "./isFilled.ts";
import type {ProductFormValues} from "../types/form.types.ts";

type MeasurementPayload = Partial<Record<keyof typeof MEASUREMENT_MAP | (
    typeof MEASUREMENT_MAP[keyof typeof MEASUREMENT_MAP][number]
    ), string>>;

export const extractMeasurements = (src: ProductFormValues): MeasurementPayload | undefined => {
    const result: MeasurementPayload = {};

    (Object.keys(MEASUREMENT_MAP) as (keyof typeof MEASUREMENT_MAP)[])
        .forEach(unitKey => {
            if (!isFilled(src[unitKey])) return;
            result[unitKey] = src[unitKey];

            MEASUREMENT_MAP[unitKey].forEach(valKey => {
                result[valKey] = src[valKey] ?? '';
            });
        });

    return Object.keys(result).length ? result : undefined;
};
