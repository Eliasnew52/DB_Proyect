import axios, {AxiosError} from 'axios';
import type {CustomError} from "../types/customError.types.ts";

export const formatError = (error: AxiosError | Error): CustomError => {

    if (axios.isAxiosError(error)) {
        const { response, code, config } = error;
        const data = response?.data || {};

        const customError: CustomError = {
            code: code || 'AXIOS_ERROR',
            status: response?.status ?? null,
            endpoint: config?.url ?? 'unknown',
            message: data.message ?? 'Ocurrió un error en el servidor',
            timestamp: new Date().toISOString(),
        };

        if (data.errors && typeof data.errors === 'object') {
            customError.fieldErrors = data.errors;
            const allMsgs = Object.values(data.errors).flat().map(String);
            customError.messages = allMsgs;
            customError.message = allMsgs[0];
        }


        if (code === 'ERR_CANCELED' || axios.isCancel(error)) {
            customError.code = 'CANCELED';
            customError.message = 'Request was canceled';
            customError.status = null;
            return customError;
        }

        if (response && (response.status === 401 || response.status === 403)) {
            customError.code = 'UNAUTHORIZED';
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
