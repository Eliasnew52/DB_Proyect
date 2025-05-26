import '@tanstack/react-query'
import {CustomError} from "./common/types/customError.types.ts";

declare module '@tanstack/react-query' {
    interface Register {
        defaultError: CustomError
    }
}
