import {SummaryCard} from "./components/SummaryCard.tsx";
import {Stack} from "@mui/material";
import {Totals} from "../../../../domain/SalesByProductReport.ts";

export const SalesSummaryCards = ({ totals }: { totals?: Totals }) => {

  return (
      <Stack
        spacing={2}
        direction={'row'}
      >
          <SummaryCard
              label={'Total de productos'}
              value={totals?.total_products ?? 0}
          />

          <SummaryCard
              label={'Total de productos vendidos'}
              value={totals?.quantity_sold ?? 0}
              prefix={'C$'}
          />

          <SummaryCard
            label={'Total de ingresos'}
            value={totals?.net_revenue ?? 0}
            prefix={'C$'}
          />

          <SummaryCard
              label={'Margen de ganancia'}
              value={totals?.total_margin ?? 0}
              prefix={'C$'}
          />
      </Stack>
  )
};