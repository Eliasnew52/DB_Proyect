import axios, { AxiosError } from 'axios';
import type { CustomError } from "../types/customError.types.ts";

export const formatError = (error: AxiosError | Error): CustomError => {
    const timestamp = new Date().toISOString();

    if (axios.isAxiosError(error)) {
        const { response, code, config, request } = error;
        const status = response?.status ?? null;
        const endpoint = config?.url ?? 'unknown';
        const data = (response?.data as {
            message?: string;
            errors?: Record<string, any>;
        }) || {};

        const customError: CustomError = {
            code: code || 'AXIOS_ERROR',
            status,
            endpoint,
            message: data.message || 'Ocurrió un error en el servidor',
            timestamp,
            fieldErrors: {},
            messages: [],
        };

        if (request && !response) {
            customError.code = 'NETWORK_ERROR';
            customError.message = 'Could not connect to the server. Please try again later.';
            return customError;
        }

        if (code === 'ERR_CANCELED' || axios.isCancel(error)) {
            customError.code = 'CANCELED';
            customError.message = 'Request was canceled';
            customError.status = null;
            return customError;
        }

        if (response && (status === 401 || status === 403)) {
            customError.code = 'unauthorized';
        }

        if (data.errors && typeof data.errors === 'object') {
            const fieldErrors: Record<string, string[]> = {};
            for (const [field, value] of Object.entries(data.errors)) {
                if (Array.isArray(value)) {
                    fieldErrors[field] = value.map(String);
                } else {
                    fieldErrors[field] = [String(value)];
                }
            }
            customError.fieldErrors = fieldErrors;

            customError.messages = Object.values(fieldErrors).flat();

            if (customError.messages.length > 0) {
                customError.message = customError.messages[0];
            }
        }

        return customError;
    }

    if (error instanceof Error) {
        return {
            code: 'JS_ERROR',
            status: null,
            endpoint: 'client',
            message: error.message,
            timestamp,
            fieldErrors: {},
            messages: [error.message],
        };
    }

    return {
        code: 'UNKNOWN_ERROR',
        status: null,
        endpoint: 'unknown',
        message: 'Unexpected error',
        timestamp,
        fieldErrors: {},
        messages: ['Unexpected error'],
    };
};
