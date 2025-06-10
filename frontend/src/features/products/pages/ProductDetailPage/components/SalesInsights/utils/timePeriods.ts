export type InputType = 'number' | 'date' | null;

export type TimePeriod = {
    value: string,
    label: string,
    inputType: InputType;

}

export const timePeriods: TimePeriod[] = [
    { value: 'd', label: 'Hoy', inputType: null },
    { value: 'w', label: 'Última semana', inputType: null },
    { value: 'm', label: 'Último mes', inputType: null },
    { value: 'y', label: 'Último año', inputType: null },
    { value: 'custom_date', label: 'Fecha personalizada', inputType: 'date' },
];
