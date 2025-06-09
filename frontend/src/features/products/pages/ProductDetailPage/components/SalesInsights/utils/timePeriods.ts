export type InputType = 'number' | 'date' | null;

export type TimePeriod = {
    value: string,
    label: string,
    inputType: InputType;

}

export const timePeriods: TimePeriod[] = [
    { value: 'd', label: 'Último día', inputType: null },
    { value: 'w', label: 'Última semana', inputType: null },
    { value: 'm', label: 'Último mes', inputType: null },
    { value: 'y', label: 'Último año', inputType: null },
    { value: 'custom_hours', label: 'Horas personalizadas', inputType: 'number' },
    { value: 'custom_days', label: 'Días personalizados', inputType: 'number' },
    { value: 'custom_weeks', label: 'Semanas personalizadas', inputType: 'number' },
    { value: 'custom_months', label: 'Meses personalizados', inputType: 'number' },
    { value: 'custom_years', label: 'Años personalizados', inputType: 'number' },
    { value: 'custom_date', label: 'Fecha personalizada', inputType: 'date' },
];
