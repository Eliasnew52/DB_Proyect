import axios, {AxiosError} from 'axios';
import {CustomError} from "../types/customError.types.ts";

export const formatError = (error: AxiosError | Error): CustomError => {

    if (axios.isAxiosError(error)) {
        const { response, code, config } = error;
        const data = response?.data || {};

        const customError = {
            code: code || 'AXIOS_ERROR',
            status: response?.status ?? null,
            endpoint: config?.url ?? 'unknown',
            message: data.message
                || data.result
                || data.error
                || error.message
                || 'Ocurrió un error en el servidor',
            timestamp: new Date().toISOString(),
        };

        if (code === 'ERR_CANCELED' || axios.isCancel(error)) {
            customError.code = 'CANCELED';
            customError.message = 'Request was canceled';
            customError.status = null;
            return customError;
        }

        if (response && (response.status === 401 || response.status === 403)) {
            customError.code = 'UNAUTHORIZED';
            customError.message = 'Session has expired';
        }

        if (error.request && !response) {
            customError.code = 'NETWORK_ERROR';
            customError.message = 'Could not connect to the server. Please try again later.';
        }

        return customError;
    }

    if (error instanceof Error) {
        return {
            code: 'JS_ERROR',
            status: null,
            endpoint: 'client',
            message: error.message,
            timestamp: new Date().toISOString(),
        };
    }

    return {
        code: 'UNKNOWN_ERROR',
        status: null,
        endpoint: 'unknown',
        message: 'Unexpected error',
        timestamp: new Date().toISOString(),
    };
}
