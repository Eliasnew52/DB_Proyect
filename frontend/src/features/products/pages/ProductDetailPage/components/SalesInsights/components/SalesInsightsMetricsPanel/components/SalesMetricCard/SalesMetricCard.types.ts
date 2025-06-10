import {ReactNode} from "react";

export interface SalesMetricCardProps {
    label?: string;
    value?: number;
    prefix?: string;
    decimals?: number;
    children?: ReactNode;
}