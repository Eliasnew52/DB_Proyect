export interface UnitOption {
    key: string;
    label: string;
}

export const LENGTH_UNITS: UnitOption[] = [
    { key: 'cm', label: 'Centimeters' },
    { key: 'in', label: 'Inches' },
    { key: 'm', label: 'Meters' },
    { key: 'mm', label: 'Millimeters' },
];

export const WEIGHT_UNITS: UnitOption[] = [
    { key: 'kg', label: 'Kilograms' },
    { key: 'lb', label: 'Pounds' },
    { key: 'g', label: 'Grams' },
    { key: 'mg', label: 'Milligrams' },
];

export const VOLUME_UNITS: UnitOption[] = [
    { key: 'L',  label: 'Liters' },
    { key: 'm3', label: 'Cubic meters' },
    { key: 'ml', label: 'Milliliters' },
    { key: 'cm3', label: 'Cubic centimeters' },
];