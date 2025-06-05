export const isFilled = (v: unknown): v is string | number | boolean => {
    if (v === null) return false;

    if (typeof v === 'boolean') {
        return v;
    }

    if (typeof v === 'string') {
        return v.trim() !== '';
    }

    if (typeof v === 'number') {
        return !isNaN(v);
    }

    return false;
};
