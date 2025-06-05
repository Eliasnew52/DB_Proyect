export const formatDate = (date?: Date | string): string => {
    if (!date) return '-';

    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return d.toLocaleDateString('es-ES', options)
}