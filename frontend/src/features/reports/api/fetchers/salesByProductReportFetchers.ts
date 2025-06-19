import {
    ApiResponseTypes, PaginatedResponseWithField,
} from "../../../../common/types/apiResponse.types.ts";
import axiosClient from "../../../../common/api/axiosClient.ts";
import {ResultDTO, TotalsDTO} from "../dto/SalesByProductResponse.dto.ts";
import {mapResultDTOToResult, mapTotalsDTOToTotals} from "../mappers/salesByProductReportResponseMappers.ts";
import {Result, Totals} from "../../domain/SalesByProductReport.ts";

export const getSalesByProductReport = async(
    page: number,
    pageSize: number,
    signal?: AbortSignal
): Promise<PaginatedResponseWithField<Result, 'totals', Totals>> => {
    const res = await axiosClient
        .get<ApiResponseTypes<PaginatedResponseWithField<ResultDTO, 'totals', TotalsDTO>>>(
            "/reports/products-sales-summary/",
            { signal, params: { page, page_size: pageSize } }
        );

    const {
        count,
        next,
        previous,
        results: dtoResults,
        totals: dtoTotals
    } = res.data.result;

    return {
        count,
        next,
        previous,
        results: dtoResults.map(mapResultDTOToResult),
        totals:  mapTotalsDTOToTotals(dtoTotals),
    };
};