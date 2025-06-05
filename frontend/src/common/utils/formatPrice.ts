export const formatPrice = (price?: number): string => {
    if (!price || isNaN(price)) return '—';

    return price.toLocaleString('es-NI', {
        style: 'currency',
        currency: 'NIO',
    })
}