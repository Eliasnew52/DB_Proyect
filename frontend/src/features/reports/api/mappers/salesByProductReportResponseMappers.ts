import {SalesByProductResponseDTO} from "../dto/SalesByProductResponse.dto.ts";
import {SalesByProductReport} from "../../domain/SalesByProductReport.ts";

export const mapSalesByProductReportDTOToSalesByProduct = (dto: SalesByProductResponseDTO): SalesByProductReport => {
    return {
        totals: dto.totals,
        results: dto.results,
    }
};