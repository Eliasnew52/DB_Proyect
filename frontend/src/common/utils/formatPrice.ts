export const formatPrice = (price: number | string | undefined): string => {
    const formattedNumber = Number(price);

    if (!formattedNumber || isNaN(formattedNumber)) return '—';

    return formattedNumber.toLocaleString('es-NI', {
        style: 'currency',
        currency: 'NIO',
    })
}